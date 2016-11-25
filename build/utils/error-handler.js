"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = errorHandler;
function errorHandler(micro) {
  return function (error) {
    if (!!error) {
      micro.logger.error({ error: {
          code: "error.microjs-plugin-queue",
          message: error.message.toString(),
          detail: error
        } });

      return Promise.reject(error);
    }
  };
}
//# sourceMappingURL=error-handler.js.map