import { messageModalHelper as messageModalHelperComputed } from '../../src/presenter/computeds/messageModalHelper';
import { refreshElasticsearchIndex } from '../helpers';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const messageModalHelper = withAppContextDecorator(messageModalHelperComputed);

export const petitionsClerkCreatesMessageToChambers = test => {
  const getHelper = () => {
    return runCompute(messageModalHelper, {
      state: test.getState(),
    });
  };

  return it('Petitions clerk sends a message to armensChambers', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    await test.runSequence('openCreateMessageModalSequence');

    await test.runSequence('updateSectionInCreateMessageModalSequence', {
      key: 'toSection',
      value: 'armensChambers',
    });

    await test.runSequence('updateModalFormValueSequence', {
      key: 'toUserId',
      value: '9c9292a4-2d5d-45b1-b67f-ac0e1c9b5df5', //armensChambers
    });

    const messageDocument = getHelper().documents[0];
    test.testMessageDocumentId = messageDocument.documentId;

    await test.runSequence('updateMessageModalAttachmentsSequence', {
      documentId: messageDocument.documentId,
    });

    expect(test.getState('modal.form.subject')).toEqual(
      messageDocument.documentTitle || messageDocument.documentType,
    );

    test.testMessageSubject = `hi chambers! ${Date.now()}`;

    await test.runSequence('updateModalFormValueSequence', {
      key: 'subject',
      value: test.testMessageSubject,
    });

    await test.runSequence('updateModalFormValueSequence', {
      key: 'message',
      value: 'how ya doin?',
    });

    await test.runSequence('createMessageSequence');

    expect(test.getState('validationErrors')).toEqual({});

    await refreshElasticsearchIndex();
  });
};
