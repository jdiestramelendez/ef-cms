const {
  isAuthorized,
  UPDATE_CASE,
} = require('../../authorization/authorizationClientService');
const { Case, STATUS_TYPES } = require('../entities/Case');
const { UnauthorizedError, NotFoundError } = require('../../errors/errors');

/**
 * @param applicationContext
 * @returns {Promise<*>}
 */
exports.updateCaseTrialSortTags = async ({ applicationContext, caseId }) => {
  const user = applicationContext.getCurrentUser();

  const caseToUpdate = await applicationContext
    .getPersistenceGateway()
    .getCaseByCaseId({
      applicationContext,
      caseId,
    });

  if (!caseToUpdate) {
    throw new NotFoundError(`Case ${caseId} was not found.`);
  }

  const caseEntity = new Case(caseToUpdate);

  if (!isAuthorized(user, UPDATE_CASE)) {
    throw new UnauthorizedError('Unauthorized for update case');
  }

  if (caseEntity.status === STATUS_TYPES.generalDocketReadyForTrial) {
    await applicationContext
      .getPersistenceGateway()
      .updateCaseTrialSortMappingRecords({
        applicationContext,
        caseId: caseEntity.validate().toRawObject().caseId,
      });
  }
};
