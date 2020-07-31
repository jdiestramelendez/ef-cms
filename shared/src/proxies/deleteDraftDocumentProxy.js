const { remove } = require('./requests');

/**
 * deleteDraftDocumentInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.docketNumber the docket number of the case
 * @param {string} providers.documentId the document id to delete
 * @returns {Promise<*>} the promise of the api call
 */
exports.deleteDraftDocumentInteractor = ({
  applicationContext,
  docketNumber,
  documentId,
}) => {
  return remove({
    applicationContext,
    endpoint: `/case-documents/${docketNumber}/${documentId}`,
  });
};
