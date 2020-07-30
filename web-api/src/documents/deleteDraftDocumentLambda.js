const { genericHandler } = require('../genericHandler');

/**
 * deletes the draft document from a case
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.deleteDraftDocumentLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext
      .getUseCases()
      .deleteDraftDocumentInteractor({
        applicationContext,
        ...event.pathParameters,
      });
  });
