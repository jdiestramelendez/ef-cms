import axios from 'axios';
import uuidv4 from 'uuid/v4';

const { uploadPdf } = require('../../shared/src/persistence/s3/uploadPdf');
const { getDocument } = require('../../shared/src/persistence/s3/getDocument');

const {
  uploadDocument,
} = require('../../shared/src/persistence/s3/uploadDocument');

import { assignWorkItems } from '../../shared/src/proxies/workitems/assignWorkItemsProxy';
import { createCase } from '../../shared/src/proxies/createCaseProxy';
import { downloadDocumentFile } from '../../shared/src/business/useCases/downloadDocumentFile.interactor';
import { fileRespondentDocument } from '../../shared/src/business/useCases/respondent/fileRespondentDocument.interactor';
import { getCase } from '../../shared/src/proxies/getCaseProxy';
import { queryForCases } from '../../shared/src/proxies/cases/queryForCasesProxy';
import { getCaseTypes } from '../../shared/src/business/useCases/getCaseTypes.interactor';
import { filePetition } from '../../shared/src/business/useCases/filePetition.interactor';
import { getFilingTypes } from '../../shared/src/business/useCases/getFilingTypes.interactor';
import { getProcedureTypes } from '../../shared/src/business/useCases/getProcedureTypes.interactor';
import { getTrialCities } from '../../shared/src/business/useCases/getTrialCities.interactor';
import { getUser } from '../../shared/src/business/useCases/getUser.interactor';
import { getWorkItem } from '../../shared/src/proxies/workitems/getWorkItemProxy';
import { getWorkItems } from '../../shared/src/proxies/workitems/getWorkItemsProxy';
import { getWorkItemsBySection } from '../../shared/src/proxies/workitems/getWorkItemsBySectionProxy';
import { queryForUsers } from '../../shared/src/proxies/users/queryForUsersProxy';

import { getSentWorkItemsForUser } from '../../shared/src/proxies/workitems/getSentWorkItemsForUserProxy';
import { getSentWorkItemsForSection } from '../../shared/src/proxies/workitems/getSentWorkItemsForSectionProxy';

import { recallPetitionFromIRSHoldingQueue } from '../../shared/src/proxies/recallPetitionFromIRSHoldingQueueProxy';
import { sendPetitionToIRSHoldingQueue } from '../../shared/src/proxies/sendPetitionToIRSHoldingQueueProxy';
import { updateCase } from '../../shared/src/proxies/updateCaseProxy';
import { updateWorkItem } from '../../shared/src/proxies/workitems/updateWorkItemProxy';
import { forwardWorkItem } from '../../shared/src/proxies/workitems/forwardWorkItemProxy';
import { validatePetition } from '../../shared/src/business/useCases/validatePetition.interactor';
import { validateCaseDetail } from '../../shared/src/business/useCases/validateCaseDetail.interactor';
import { createDocument } from '../../shared/src/proxies/documents/createDocumentProxy';

import Petition from '../../shared/src/business/entities/Petition';
import ErrorFactory from './presenter/errors/ErrorFactory';
import decorateWithTryCatch from './tryCatchDecorator';

let user;

const getCurrentUser = () => {
  return user;
};
const setCurrentUser = newUser => {
  user = newUser;
};

let token;
const getCurrentUserToken = () => {
  return token;
};
const setCurrentUserToken = newToken => {
  token = newToken;
};

const allUseCases = {
  assignWorkItems,
  createDocument,
  createCase,
  downloadDocumentFile,
  fileRespondentDocument,
  filePetition,
  forwardWorkItem,
  getCase,
  getCaseTypes,
  getFilingTypes,
  getSentWorkItemsForSection,
  getSentWorkItemsForUser,
  getProcedureTypes,
  getTrialCities,
  getUser,
  getWorkItem,
  getWorkItems,
  queryForUsers,
  getWorkItemsBySection,
  queryForCases,
  recallPetitionFromIRSHoldingQueue,
  sendPetitionToIRSHoldingQueue,
  updateCase,
  updateWorkItem,
  validatePetition,
  validateCaseDetail,
};
decorateWithTryCatch(allUseCases);

const applicationContext = {
  getBaseUrl: () => {
    return process.env.API_URL || 'http://localhost:3000/v1';
  },
  getEnvironment: () => {
    return process.env.USTC_ENV;
  },
  getCognitoLoginUrl: () => {
    if (process.env.COGNITO) {
      return 'https://auth-dev-flexion-efcms.auth.us-east-1.amazoncognito.com/login?response_type=token&client_id=6tu6j1stv5ugcut7dqsqdurn8q&redirect_uri=http%3A//localhost:1234/log-in';
    } else {
      return (
        process.env.COGNITO_LOGIN_URL ||
        'http://localhost:1234/mock-login?redirect_uri=http%3A//localhost%3A1234/log-in'
      );
    }
  },
  getError: e => {
    return ErrorFactory.getError(e);
  },
  getHttpClient: () => axios,
  getUniqueId: () => {
    return uuidv4();
  },
  getEntityConstructors: () => ({
    Petition,
  }),
  getPersistenceGateway: () => {
    return {
      getDocument,
      saveCase: updateCase,
      uploadDocument,
      uploadPdf,
    };
  },
  getUseCases: () => allUseCases,
  getCurrentUser,
  setCurrentUser,
  getCurrentUserToken,
  setCurrentUserToken,
};

export default applicationContext;
