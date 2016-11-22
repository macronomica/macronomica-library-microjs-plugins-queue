'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _amqplib = require('amqplib');

var _amqplib2 = _interopRequireDefault(_amqplib);

var _constants = require('./constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

exports.default = function () {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      DRIVER = _ref.driver,
      _ref$url = _ref.url,
      url = _ref$url === undefined ? _constants.QUEUE_OPTIONS_HOST : _ref$url,
      timeout = _ref.timeout,
      socketOptions = _objectWithoutProperties(_ref, ['driver', 'url', 'timeout']);

  return function (micro, name, pluginId) {
    var plugin = { name: name, id: pluginId };
    var connectStack = [];
    var _client = void 0;

    micro.queue({
      case: 'wait',
      args: [],
      done: function done() {
        return _amqplib2.default.connect(url, _extends({}, socketOptions)).then(function (connect) {
          _client = connect.on('error', errorCallback(micro));

          return Promise.all(connectStack.map(function (_ref2) {
            var _ref3 = _slicedToArray(_ref2, 1),
                resolve = _ref3[0];

            return resolve(_client);
          })).then(function () {
            return connectStack = [];
          }).then(function () {
            return connect;
          });
        }).catch(function (error) {
          errorCallback(micro)(error);
          return Promise.all(connectStack.map(function (_ref4) {
            var _ref5 = _slicedToArray(_ref4, 2),
                reject = _ref5[1];

            return reject(error);
          })).then(function () {
            return connectStack = [];
          }).then(function () {
            return Promise.reject(error);
          });
        });
      }
    }).queue({
      case: 'close',
      args: [],
      done: function done() {
        return _client.close().catch(errorCallback(micro));
      }
    });

    return {
      middleware: _amqplib2.default,
      client: function client() {
        if (!!_client) {
          return Promise.resolve(_client);
        }

        return new Promise(function (resolve, reject) {
          return connectStack.push([resolve, reject]);
        });
      }
    };
  };
};

function errorCallback(micro) {
  return function (error) {
    if (!!error) {
      micro.logger.error('The server refused the connection', {
        code: 'error.plugin-cache-redis/' + error.code,
        message: error.message.toString()
      });
    }
  };
}
//# sourceMappingURL=index.js.map