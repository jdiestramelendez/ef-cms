import { AddToTrialModal } from './CaseDetail/AddToTrialModal';
import { BlockFromTrialModal } from './CaseDetail/BlockFromTrialModal';
import { CaseDeadlinesInternal } from './CaseDetail/CaseDeadlinesInternal';
import { CaseDetailHeader } from './CaseDetailHeader';
import { CaseDetailPendingReportList } from './CaseDetail/CaseDetailPendingReportList';
import { CaseDetailSubnavTabs } from './CaseDetailSubnavTabs';
import { CaseInformationInternal } from './CaseDetail/CaseInformationInternal';
import { CaseNotes } from './CaseDetail/CaseNotes';
import { CreateCaseDeadlineModalDialog } from './CaseDetail/CreateCaseDeadlineModalDialog';
import { DeleteCaseDeadlineModalDialog } from './CaseDetail/DeleteCaseDeadlineModalDialog';
import { DocketRecord } from './DocketRecord/DocketRecord';
import { DraftDocuments } from './DraftDocuments/DraftDocuments';
import { EditCaseDeadlineModalDialog } from './CaseDetail/EditCaseDeadlineModalDialog';
import { ErrorNotification } from './ErrorNotification';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { MessagesInProgress } from './CaseDetail/MessagesInProgress';
import { PartyInformation } from './CaseDetail/PartyInformation';
import { PrioritizeCaseModal } from './CaseDetail/PrioritizeCaseModal';
import { RemoveFromTrialSessionModal } from './CaseDetail/RemoveFromTrialSessionModal';
import { SuccessNotification } from './SuccessNotification';
import { Tab, Tabs } from '../ustc-ui/Tabs/Tabs';
import { UnblockFromTrialModal } from './CaseDetail/UnblockFromTrialModal';
import { UnprioritizeCaseModal } from './CaseDetail/UnprioritizeCaseModal';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const CaseDetailInternal = connect(
  {
    baseUrl: state.baseUrl,
    caseDetail: state.caseDetail,
    caseDetailHelper: state.caseDetailHelper,
    formattedCaseDetail: state.formattedCaseDetail,
    primaryTab: state.caseDetailPage.primaryTab,
    showModal: state.showModal,
    token: state.token,
  },
  ({
    baseUrl,
    caseDetail,
    caseDetailHelper,
    formattedCaseDetail,
    primaryTab,
    showModal,
    token,
  }) => {
    return (
      <>
        <CaseDetailHeader className="margin-bottom-0" />
        <CaseDetailSubnavTabs />

        <section
          className="usa-section grid-container"
          id="case-detail-internal"
        >
          <SuccessNotification />
          <ErrorNotification />
          {primaryTab === 'docketRecord' && (
            <>
              <div className="title">
                <h1>Docket Record</h1>
              </div>
              <DocketRecord />
            </>
          )}
          {primaryTab === 'deadlines' && (
            <>
              <div className="title">
                <h1>Deadlines</h1>
              </div>
              <CaseDeadlinesInternal />
            </>
          )}
          {primaryTab === 'inProgress' && (
            <Tabs
              bind="caseDetailPage.inProgressTab"
              className="classic-horizontal-header3 tab-border"
            >
              <Tab
                id="tab-draft-documents"
                tabName="draftDocuments"
                title="Draft Documents"
              >
                <DraftDocuments />
              </Tab>
              <Tab id="tab-messages" tabName="messages" title="Messages">
                <MessagesInProgress />
              </Tab>
              <Tab
                id="tab-pending-report"
                tabName="pendingReport"
                title="Pending Report"
              >
                <CaseDetailPendingReportList />
              </Tab>
            </Tabs>
          )}
          {primaryTab === 'caseInformation' && (
            <Tabs
              bind="caseDetailPage.caseInformationTab"
              className="classic-horizontal-header3 tab-border"
            >
              <Tab id="tab-overview" tabName="overview" title="Overview">
                <CaseInformationInternal />
              </Tab>
              <Tab id="tab-petitioner" tabName="petitioner" title="Petitioner">
                <PartyInformation />
              </Tab>
              <Tab id="tab-respondent" tabName="respondent" title="Respondent">
                <PartyInformation />
              </Tab>
            </Tabs>
          )}
          {primaryTab === 'notes' && (
            <>
              <div className="title">
                <h1>Notes</h1>
              </div>
              {caseDetailHelper.showCaseNotes && <CaseNotes />}
            </>
          )}
        </section>

        {/* This section below will be removed in a future story */}
        <section className="usa-section grid-container">
          {formattedCaseDetail.status === 'General Docket - Not at Issue' && (
            <>
              {formattedCaseDetail.contactPrimary && (
                <a
                  aria-label="View PDF"
                  className="usa-button usa-button--unstyled margin-right-1"
                  href={`${baseUrl}/case-documents/${caseDetail.caseId}/${
                    formattedCaseDetail.docketNumber
                  }_${formattedCaseDetail.contactPrimary.name.replace(
                    /\s/g,
                    '_',
                  )}.zip/document-download-url?token=${token}`}
                >
                  <FontAwesomeIcon icon={['far', 'file-pdf']} />
                  Batch Zip Download
                </a>
              )}
            </>
          )}
        </section>

        {showModal === 'CreateCaseDeadlineModalDialog' && (
          <CreateCaseDeadlineModalDialog />
        )}
        {showModal === 'EditCaseDeadlineModalDialog' && (
          <EditCaseDeadlineModalDialog />
        )}
        {showModal === 'DeleteCaseDeadlineModalDialog' && (
          <DeleteCaseDeadlineModalDialog />
        )}
        {showModal === 'AddToTrialModal' && <AddToTrialModal />}
        {showModal === 'BlockFromTrialModal' && <BlockFromTrialModal />}
        {showModal === 'UnblockFromTrialModal' && <UnblockFromTrialModal />}
        {showModal === 'PrioritizeCaseModal' && <PrioritizeCaseModal />}
        {showModal === 'UnprioritizeCaseModal' && <UnprioritizeCaseModal />}
        {showModal === 'RemoveFromTrialSessionModal' && (
          <RemoveFromTrialSessionModal />
        )}
      </>
    );
  },
);
