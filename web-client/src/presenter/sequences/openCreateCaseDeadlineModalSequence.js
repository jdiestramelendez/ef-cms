import { clearFormAction } from '../actions/clearFormAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { set } from 'cerebral/factories';
import { state } from 'cerebral';

export const openCreateCaseDeadlineModalSequence = [
  clearModalStateAction,
  clearFormAction,
  set(state.showModal, 'CreateCaseDeadlineModalDialog'),
];