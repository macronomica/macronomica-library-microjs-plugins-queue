import config from 'config';
import amqplib from "amqplib";
import isString from 'lodash.isstring';
import isPlainObject from 'lodash.isplainobject';
import {
  CONFIG_SECTION_QUEUE,
  QUEUE_OPTIONS_URL
} from '../constants';

/**
 * @param {string|object} [queue]=CONFIG_SECTION_QUEUE
 * @returns {*}
 */
export default ({ queue = CONFIG_SECTION_QUEUE } = {}) => {
  if (!isString(queue) && !isPlainObject(queue)) {
    throw new TypeError([
      'Настройки для соединения с RabbitMQ могут быть только:',
      '- {string} -> название имени ключа из конфигурации',
      '- {object} -> объектом с настройками @see # Пример url: http://www.squaremobius.net/amqp.node/channel_api.html#connect',
    ].join('\n'))
  }

  const {
    url = QUEUE_OPTIONS_URL,
    ...other
  } = isPlainObject(queue) ? queue : config.has(queue) ? config.get(queue) : {};

  return amqplib.connect(url, { ...other });
}