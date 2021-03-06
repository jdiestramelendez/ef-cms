import { CASE_STATUS_TYPES } from '../../../shared/src/business/entities/EntityConstants';
import { Case } from '../../../shared/src/business/entities/cases/Case';

const { VALIDATION_ERROR_MESSAGES } = Case;

export const petitionsClerkSubmitsCaseToIrs = test => {
  return it('Petitions clerk submits case to IRS', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    await test.runSequence('gotoPetitionQcSequence', {
      docketNumber: test.docketNumber,
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'irsDay',
      value: '24',
    });
    await test.runSequence('updateFormValueSequence', {
      key: 'irsMonth',
      value: '12',
    });
    await test.runSequence('updateFormValueSequence', {
      key: 'irsYear',
      value: '2050',
    });
    await test.runSequence('updateFormValueSequence', {
      key: 'paymentDateYear',
      value: '2018',
    });
    await test.runSequence('updateFormValueSequence', {
      key: 'paymentDateMonth',
      value: '12',
    });
    await test.runSequence('updateFormValueSequence', {
      key: 'paymentDateDay',
      value: '24',
    });

    await test.runSequence('saveSavedCaseForLaterSequence');
    expect(test.getState('validationErrors')).toEqual({
      irsNoticeDate: VALIDATION_ERROR_MESSAGES.irsNoticeDate[0].message,
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'irsYear',
      value: '2017',
    });

    await test.runSequence('saveSavedCaseForLaterSequence');
    expect(test.getState('validationErrors')).toEqual({});
    await test.runSequence('serveCaseToIrsSequence');

    test.setState('caseDetail', {});
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    // check that save occurred
    expect(test.getState('caseDetail.irsNoticeDate')).toEqual(
      '2017-12-24T05:00:00.000Z',
    );
    expect(test.getState('caseDetail.status')).toEqual(
      CASE_STATUS_TYPES.generalDocket,
    );
    //check that documents were served
    const documents = test.getState('caseDetail.documents');
    for (const document of documents) {
      expect(document.servedAt).toBeDefined();
    }
  });
};
