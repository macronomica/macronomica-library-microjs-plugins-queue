import middleware from "amqplib";
import isFunction from "lodash.isfunction";
import connect from "./connect";
import actions from "./actions";
import ErrorHandler from "./utils/error-handler";

export default (settings = {}) => {
  return (micro, name, pluginId) => {
    const errorHandler = ErrorHandler(micro);
    const plugin = { name, id: pluginId, middleware, client: null };
    const __actions = {};

    micro
      .queue({
        case: 'wait',
        args: [],
        done: () => connect(settings)
          .then(connect => plugin.client = connect.on('error', errorHandler))
          .then(applyActions(micro, __actions))
          .catch(errorHandler)
      })
      .queue({
        case: 'close',
        args: [],
        done: () => plugin.client.close().catch(errorHandler)
      });

    return new Proxy(plugin, {
      get(target, property) {
        if (property in target) {
          return target[ property ];
        }

        if (property in __actions) {
          return __actions[ property ];
        }

        return plugin.client[ property ];
      }
    })
  };
}

function applyActions(micro, __actions) {
  return client => Object
    .keys(actions)
    .forEach(key => {
      if (isFunction(actions[ key ])) {
        __actions[ key ] = actions[ key ](micro, client, __actions)
      } else {
        __actions[ key ] = actions[ key ];
      }
    })
}