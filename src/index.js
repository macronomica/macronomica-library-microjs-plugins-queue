import middleware from "amqplib";
import { DRIVER, QUEUE_OPTIONS_HOST } from './constants';

export default ({ driver:DRIVER, url = QUEUE_OPTIONS_HOST, timeout, ...socketOptions } = {}) => {
  return (micro, name, pluginId) => {
    const plugin = { name, id: pluginId };
    let connectStack = [];
    let client;

    micro
      .queue({
        case: 'wait',
        args: [],
        done: () => middleware.connect(url, { ...socketOptions })
          .then(connect => {
            client = connect
              .on('error', errorCallback(micro));

            return Promise
              .all(connectStack.map(([resolve]) => resolve(client)))
              .then(() => connectStack = [])
              .then(() => connect);
          })
          .catch(error => {
            errorCallback(micro)(error);
            return Promise
              .all(connectStack.map(([,reject]) => reject(error)))
              .then(() => connectStack = [])
              .then(() => Promise.reject(error));
          })
      })
      .queue({
        case: 'close',
        args: [],
        done: () => client.close().catch(errorCallback(micro))
      });

    return {
      middleware,
      client: () => {
        if (!!client) {
          return Promise.resolve(client)
        }

        return new Promise((resolve, reject) => connectStack.push([ resolve, reject ]));
      }
    }
  };
}
function errorCallback(micro) {
  return error => {
    if (!!error) {
      micro.logger.error('The server refused the connection', {
        code   : `error.plugin-cache-redis/${ error.code }`,
        message: error.message.toString()
      })
    }
  }
}