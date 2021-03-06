const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  DOCKET_NUMBER_SUFFIXES,
  ROLES,
} = require('../../entities/EntityConstants');
const {
  getDocumentQCInboxForUserInteractor,
} = require('./getDocumentQCInboxForUserInteractor');

describe('getDocumentQCInboxForUserInteractor', () => {
  let mockWorkItem = {
    createdAt: '',
    docketNumber: '101-18',
    docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.SMALL,
    document: {
      sentBy: 'petitioner',
    },
    messages: [],
    section: 'docket',
    sentBy: 'docketclerk',
  };

  it('throws an error if the user does not have access to the work item', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.petitioner,
      userId: 'petitioner',
    });
    applicationContext.getPersistenceGateway().getDocumentQCServedForSection = async () =>
      mockWorkItem;

    let error;
    try {
      await getDocumentQCInboxForUserInteractor({
        applicationContext,
        section: 'docket',
      });
    } catch (e) {
      error = e;
    }
    expect(error).toBeDefined();
  });
});
