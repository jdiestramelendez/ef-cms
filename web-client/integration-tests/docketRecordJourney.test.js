import { applicationContextForClient as applicationContext } from '../../shared/src/business/test/createTestApplicationContext';
import { docketClerkAddsDocketEntryFromOrder } from './journey/docketClerkAddsDocketEntryFromOrder';
import { docketClerkCreatesAnOrder } from './journey/docketClerkCreatesAnOrder';
import { docketClerkServesDocument } from './journey/docketClerkServesDocument';
import { docketClerkSignsOrder } from './journey/docketClerkSignsOrder';
import { docketClerkUploadsACourtIssuedDocument } from './journey/docketClerkUploadsACourtIssuedDocument';
import { docketClerkViewsDraftOrder } from './journey/docketClerkViewsDraftOrder';
import { petitionerFilesADocumentForCase } from './journey/petitionerFilesADocumentForCase';
import { petitionsClerkServesPetitionFromDocumentView } from './journey/petitionsClerkServesPetitionFromDocumentView';

import {
  createCourtIssuedDocketEntry,
  fakeFile,
  getFormattedCaseDetailForTest,
  loginAs,
  setupTest,
  uploadPetition,
} from './helpers';

import { petitionsClerkCreatesNewCase } from './journey/petitionsClerkCreatesNewCase';

const { PAYMENT_STATUS } = applicationContext.getConstants();
const test = setupTest();
test.draftOrders = [];

describe('Docket Clerk Verifies Docket Record Display', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  loginAs(test, 'petitionsclerk@example.com');
  petitionsClerkCreatesNewCase(test, fakeFile, 'Birmingham, Alabama', false);
  it('verifies petition, APW, RQT, and DISC', async () => {
    const { formattedDocketEntries } = await getFormattedCaseDetailForTest(
      test,
    );

    expect(formattedDocketEntries).toMatchObject([
      {
        createdAtFormatted: expect.anything(),
        eventCode: 'P',
        index: 1,
        showNotServed: true,
        showServed: false,
      },
      {
        createdAtFormatted: expect.anything(),
        eventCode: 'APW',
        index: 2,
        showNotServed: true,
        showServed: false,
      },
      {
        createdAtFormatted: expect.anything(),
        eventCode: 'RQT',
        index: 3,
        showNotServed: true,
        showServed: false,
      },
      {
        createdAtFormatted: expect.anything(),
        eventCode: 'DISC',
        index: 4,
        showNotServed: true,
        showServed: false,
      },
    ]);
  });

  loginAs(test, 'docketclerk@example.com');
  it('files an initial filing type document AFTER a paper petition is added', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    await test.runSequence('gotoAddDocketEntrySequence', {
      docketNumber: test.docketNumber,
    });

    await test.runSequence('updateDocketEntryFormValueSequence', {
      key: 'dateReceivedMonth',
      value: 1,
    });
    await test.runSequence('updateDocketEntryFormValueSequence', {
      key: 'dateReceivedDay',
      value: 1,
    });
    await test.runSequence('updateDocketEntryFormValueSequence', {
      key: 'dateReceivedYear',
      value: 2018,
    });

    await test.runSequence('updateDocketEntryFormValueSequence', {
      key: 'primaryDocumentFile',
      value: fakeFile,
    });

    await test.runSequence('updateDocketEntryFormValueSequence', {
      key: 'primaryDocumentFileSize',
      value: 100,
    });

    await test.runSequence('updateDocketEntryFormValueSequence', {
      key: 'eventCode',
      value: 'RQT',
    });

    await test.runSequence('updateDocketEntryFormValueSequence', {
      key: 'trialLocation',
      value: 'Little Rock, AR',
    });

    await test.runSequence('updateDocketEntryFormValueSequence', {
      key: 'partyPrimary',
      value: true,
    });

    await test.runSequence('fileDocketEntrySequence', {
      isSavingForLater: true,
    });

    const { formattedDocketEntries } = await getFormattedCaseDetailForTest(
      test,
    );

    expect(formattedDocketEntries[4]).toMatchObject({
      createdAtFormatted: expect.anything(),
      eventCode: 'RQT',
      index: 5,
      showNotServed: true,
      showServed: false,
    });
  });

  loginAs(test, 'petitionsclerk@example.com');
  it('serves the petition', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    await test.runSequence('serveCaseToIrsSequence');
  });

  loginAs(test, 'docketclerk@example.com');
  it('files an initial filing type document AFTER the petition is served', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    await test.runSequence('gotoAddDocketEntrySequence', {
      docketNumber: test.docketNumber,
    });

    await test.runSequence('updateDocketEntryFormValueSequence', {
      key: 'dateReceivedMonth',
      value: 1,
    });
    await test.runSequence('updateDocketEntryFormValueSequence', {
      key: 'dateReceivedDay',
      value: 1,
    });
    await test.runSequence('updateDocketEntryFormValueSequence', {
      key: 'dateReceivedYear',
      value: 2018,
    });

    await test.runSequence('updateDocketEntryFormValueSequence', {
      key: 'primaryDocumentFile',
      value: fakeFile,
    });

    await test.runSequence('updateDocketEntryFormValueSequence', {
      key: 'primaryDocumentFileSize',
      value: 100,
    });

    await test.runSequence('updateDocketEntryFormValueSequence', {
      key: 'eventCode',
      value: 'RQT',
    });

    await test.runSequence('updateDocketEntryFormValueSequence', {
      key: 'trialLocation',
      value: 'Little Rock, AR',
    });

    await test.runSequence('updateDocketEntryFormValueSequence', {
      key: 'partyPrimary',
      value: true,
    });

    await test.runSequence('fileDocketEntrySequence', {
      isSavingForLater: true,
    });

    const { formattedDocketEntries } = await getFormattedCaseDetailForTest(
      test,
    );

    expect(formattedDocketEntries[5]).toMatchObject({
      createdAtFormatted: expect.anything(),
      eventCode: 'RQT',
      index: undefined,
      showNotServed: true,
      showServed: false,
    });
  });

  loginAs(test, 'docketclerk@example.com');
  it('updates the fee payment status on case detail and verifies minute entry on the docket record', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    await test.runSequence('gotoEditPetitionDetailsSequence', {
      docketNumber: test.docketNumber,
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'petitionPaymentStatus',
      value: PAYMENT_STATUS.PAID,
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'petitionPaymentMethod',
      value: 'check',
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

    await test.runSequence('updatePetitionDetailsSequence');

    const { formattedDocketEntries } = await getFormattedCaseDetailForTest(
      test,
    );

    const feeEntry = formattedDocketEntries.find(
      entry => entry.eventCode === 'FEE',
    );

    expect(feeEntry).toMatchObject({
      createdAtFormatted: expect.anything(),
      eventCode: 'FEE',
      index: 6,
    });
  });

  loginAs(test, 'docketclerk@example.com');
  docketClerkUploadsACourtIssuedDocument(test, fakeFile);
  it('verifies the docket record after filing an unservable document type', async () => {
    const uploadedDocument = test.draftOrders[0];

    await createCourtIssuedDocketEntry({
      docketNumber: test.docketNumber,
      documentId: uploadedDocument.documentId,
      eventCode: 'HEAR',
      test,
      trialLocation: 'Brimingham, AL',
    });

    const { formattedDocketEntries } = await getFormattedCaseDetailForTest(
      test,
    );

    const docketEntry = formattedDocketEntries.find(
      entry => entry.documentId === uploadedDocument.documentId,
    );
    expect(docketEntry).toMatchObject({
      createdAtFormatted: expect.anything(),
      eventCode: 'HEAR',
      index: 7,
      servedAtFormatted: undefined,
      showNotServed: false,
      showServed: false,
    });
  });

  loginAs(test, 'docketclerk@example.com');
  docketClerkCreatesAnOrder(test, {
    documentTitle: 'Order to do something',
    eventCode: 'O',
    expectedDocumentType: 'Order',
  });
  docketClerkViewsDraftOrder(test, 1);
  docketClerkSignsOrder(test, 1);
  docketClerkAddsDocketEntryFromOrder(test, 1);
  it('verifies the docket record after adding a draft order to the docket record (not served)', async () => {
    const { formattedDocketEntries } = await getFormattedCaseDetailForTest(
      test,
    );

    const orderEntry = formattedDocketEntries[8];

    expect(orderEntry).toMatchObject({
      createdAtFormatted: undefined,
      eventCode: 'O',
      index: undefined,
      servedAtFormatted: undefined,
      showNotServed: true,
    });
  });

  loginAs(test, 'docketclerk@example.com');
  docketClerkCreatesAnOrder(test, {
    documentTitle: 'Order to do something else',
    eventCode: 'O',
    expectedDocumentType: 'Order',
  });

  docketClerkViewsDraftOrder(test, 2);
  docketClerkSignsOrder(test, 2);
  docketClerkAddsDocketEntryFromOrder(test, 2);
  docketClerkServesDocument(test, 2);
  it('verifies the docket record after adding a draft order to the docket record and serving', async () => {
    const { formattedDocketEntries } = await getFormattedCaseDetailForTest(
      test,
    );

    const orderEntry = formattedDocketEntries[8];

    expect(orderEntry).toMatchObject({
      createdAtFormatted: expect.anything(),
      eventCode: 'O',
      index: 8,
      servedAtFormatted: expect.anything(),
      showNotServed: false,
    });
  });

  loginAs(test, 'docketclerk@example.com');
  it('verifies the docket record after filing a paper document (without serving)', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    await test.runSequence('gotoAddDocketEntrySequence', {
      docketNumber: test.docketNumber,
    });

    await test.runSequence('updateDocketEntryFormValueSequence', {
      key: 'dateReceivedMonth',
      value: 1,
    });
    await test.runSequence('updateDocketEntryFormValueSequence', {
      key: 'dateReceivedDay',
      value: 2,
    });
    await test.runSequence('updateDocketEntryFormValueSequence', {
      key: 'dateReceivedYear',
      value: 2018,
    });

    await test.runSequence('updateDocketEntryFormValueSequence', {
      key: 'primaryDocumentFile',
      value: fakeFile,
    });

    await test.runSequence('updateDocketEntryFormValueSequence', {
      key: 'primaryDocumentFileSize',
      value: 100,
    });

    await test.runSequence('updateDocketEntryFormValueSequence', {
      key: 'eventCode',
      value: 'A',
    });

    await test.runSequence('updateDocketEntryFormValueSequence', {
      key: 'partyPrimary',
      value: true,
    });

    await test.runSequence('fileDocketEntrySequence', {
      isSavingForLater: true,
    });

    const { formattedDocketEntries } = await getFormattedCaseDetailForTest(
      test,
    );

    const entry = formattedDocketEntries[6];

    test.documentId = entry.documentId;

    expect(entry).toMatchObject({
      createdAtFormatted: expect.anything(),
      eventCode: 'A',
      index: undefined,
      showNotServed: true,
    });
  });

  it('verifies the docket record after serving a paper filing', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    await test.runSequence('openConfirmServePaperFiledDocumentSequence', {
      documentId: test.documentId,
    });

    await test.runSequence('servePaperFiledDocumentSequence');

    const { formattedDocketEntries } = await getFormattedCaseDetailForTest(
      test,
    );

    const servedEntry = formattedDocketEntries.find(
      entry => entry.documentId === test.documentId,
    );

    expect(servedEntry).toMatchObject({
      createdAtFormatted: expect.anything(),
      eventCode: 'A',
      index: 9,
      showNotServed: false,
      showServed: true,
    });
  });

  it('verifies the docket record after filing a petition electronically', async () => {
    const caseDetail = await uploadPetition(test, {
      ownershipDisclosureFileId: '2da6d239-555a-40e8-af81-1949c8270cd7',
    });
    test.docketNumber = caseDetail.docketNumber;

    const { formattedDocketEntries } = await getFormattedCaseDetailForTest(
      test,
    );

    expect(formattedDocketEntries).toMatchObject([
      {
        createdAtFormatted: expect.anything(),
        eventCode: 'P',
        index: 1,
        showNotServed: true,
        showServed: false,
      },
      {
        createdAtFormatted: expect.anything(),
        eventCode: 'RQT',
        index: 2,
      },
      {
        createdAtFormatted: expect.anything(),
        eventCode: 'DISC',
        index: 3,
        showNotServed: true,
        showServed: false,
      },
    ]);
  });

  loginAs(test, 'petitionsclerk@example.com');
  petitionsClerkServesPetitionFromDocumentView(test);

  loginAs(test, 'petitioner@example.com');
  petitionerFilesADocumentForCase(test, fakeFile);
  it('verifies the docket record after filing a document electronically after serving the petition', async () => {
    const { formattedDocketEntries } = await getFormattedCaseDetailForTest(
      test,
    );

    const entry = formattedDocketEntries[3];

    expect(entry).toMatchObject({
      createdAtFormatted: expect.anything(),
      eventCode: 'CIVP',
      index: 4,
      showNotServed: false,
      showServed: true,
    });
  });
});
