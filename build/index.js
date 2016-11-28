"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _amqplib = require("amqplib");

var _amqplib2 = _interopRequireDefault(_amqplib);

var _lodash = require("lodash.isfunction");

var _lodash2 = _interopRequireDefault(_lodash);

var _connect = require("./connect");

var _connect2 = _interopRequireDefault(_connect);

var _actions = require("./actions");

var _actions2 = _interopRequireDefault(_actions);

var _errorHandler = require("./utils/error-handler");

var _errorHandler2 = _interopRequireDefault(_errorHandler);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  var settings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  return function (micro, name, pluginId) {
    var errorHandler = (0, _errorHandler2.default)(micro);
    var plugin = { name: name, id: pluginId, middleware: _amqplib2.default, client: null };
    var __actions = {};

    micro.queue({
      case: 'wait',
      args: [],
      done: function done() {
        return (0, _connect2.default)(settings).then(function (connect) {
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
    return Object.keys(_actions2.default).forEach(function (key) {
      if ((0, _lodash2.default)(_actions2.default[key])) {
        __actions[key] = _actions2.default[key](micro, client, __actions);
      } else {
        __actions[key] = _actions2.default[key];
      }
    });
  };
}
//# sourceMappingURL=index.js.map