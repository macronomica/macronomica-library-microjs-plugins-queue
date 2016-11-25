"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _amqplib = require("amqplib");

var _amqplib2 = _interopRequireDefault(_amqplib);

var _lodash = require("lodash.isfunction");

var _lodash2 = _interopRequireDefault(_lodash);

var _errorHandler = require("./utils/error-handler");

var _errorHandler2 = _interopRequireDefault(_errorHandler);

var _constants = require("./constants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

exports.default = function () {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref$driver = _ref.driver,
      driver = _ref$driver === undefined ? _constants.DRIVER : _ref$driver,
      _ref$url = _ref.url,
      url = _ref$url === undefined ? _constants.QUEUE_OPTIONS_HOST : _ref$url,
      socketOptions = _objectWithoutProperties(_ref, ["driver", "url"]);

  return function (micro, name, pluginId) {
    var errorHandler = (0, _errorHandler2.default)(micro);
    var plugin = { name: name, id: pluginId, middleware: _amqplib2.default, client: null };
    var __actions = {};

    micro.queue({
      case: 'wait',
      args: [],
      done: function done() {
        return _amqplib2.default.connect(url, _extends({}, socketOptions)).then(function (connect) {
          return plugin.client = connect.on('error', errorHandler);
        }).then(applyActions(micro, __actions)).catch(errorHandler);
      }
    }).queue({
      case: 'close',
      args: [],
      done: function done() {
        return plugin.client.close().catch(errorHandler);
      }
    });

    return new Proxy(plugin, {
      get: function get(target, property) {
        if (property in target) {
          return target[property];
        }

        if (property in __actions) {
          return __actions[property];
        }

        return plugin.client[property];
      }
    });
  };
};

function applyActions(micro, __actions) {
  return function (client) {
    return Object.keys(actions).forEach(function (key) {
      if ((0, _lodash2.default)(actions[key])) {
        __actions[key] = actions[key](micro, client, __actions);
      } else {
        __actions[key] = actions[key];
      }
    });
  };
}
//# sourceMappingURL=index.js.map