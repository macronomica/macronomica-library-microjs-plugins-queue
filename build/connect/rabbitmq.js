'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _config = require('config');

var _config2 = _interopRequireDefault(_config);

var _amqplib = require('amqplib');

var _amqplib2 = _interopRequireDefault(_amqplib);

var _lodash = require('lodash.isstring');

var _lodash2 = _interopRequireDefault(_lodash);

var _lodash3 = require('lodash.isplainobject');

var _lodash4 = _interopRequireDefault(_lodash3);

var _constants = require('../constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

/**
 * @param {string|object} [queue]=CONFIG_SECTION_QUEUE
 * @returns {*}
 */
exports.default = function () {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref$queue = _ref.queue,
      queue = _ref$queue === undefined ? _constants.CONFIG_SECTION_QUEUE : _ref$queue;

  if (!(0, _lodash2.default)(queue) && !(0, _lodash4.default)(queue)) {
    throw new TypeError(['Настройки для соединения с RabbitMQ могут быть только:', '- {string} -> название имени ключа из конфигурации', '- {object} -> объектом с настройками @see # Пример url: http://www.squaremobius.net/amqp.node/channel_api.html#connect'].join('\n'));
  }

  var _ref2 = (0, _lodash4.default)(queue) ? queue : _config2.default.has(queue) ? _config2.default.get(queue) : {},
      _ref2$url = _ref2.url,
      url = _ref2$url === undefined ? _constants.QUEUE_OPTIONS_HOST : _ref2$url,
      other = _objectWithoutProperties(_ref2, ['url']);

  return _amqplib2.default.connect(url, _extends({}, other));
};
//# sourceMappingURL=rabbitmq.js.map