/**
 * getCaseProxy
 *
 * @param applicationContext
 * @param caseId
 * @param userToken
 * @returns {Promise<*>}
 */
exports.getCase = async ({ applicationContext, docketNumber, userId }) => {
  const userToken = userId; //TODO refactor for jwt
  const response = await applicationContext
    .getHttpClient()
    .get(`${applicationContext.getBaseUrl()}/cases/${docketNumber}`, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });
  return response.data;
};
