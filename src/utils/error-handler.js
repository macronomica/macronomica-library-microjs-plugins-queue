
export default function errorHandler(micro) {
  return error => {
    if (!!error) {
      micro.logger.error({ error: {
        code   : `error.microjs-plugin-queue`,
        message: error.message.toString(),
        detail : error
      } });

      return Promise.reject(error);
    }
  };
}