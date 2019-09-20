const createApplicationContext = require('../applicationContext');
const { getUserFromAuthHeader } = require('../middleware/apiGatewayHelper');
const { handle } = require('../middleware/apiGatewayHelper');

/**
 */
exports.handler = event => {
  return handle(event, async () => {
    const user = getUserFromAuthHeader(event);
    const applicationContext = createApplicationContext(user);
    try {
      const endpoint = `${event.requestContext.domainName}/${event.requestContext.stage}`;
      const results = await applicationContext
        .getUseCases()
        .onConnectInteractor({
          applicationContext,
          connectionId: event.requestContext.connectionId,
          endpoint,
        });
      applicationContext.logger.info('User', user);
      applicationContext.logger.info('Results', results);
      return results;
    } catch (e) {
      applicationContext.logger.error(e);
      throw e;
    }
  });
};
