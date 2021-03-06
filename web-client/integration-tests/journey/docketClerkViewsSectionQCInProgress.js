export const docketClerkViewsSectionQCInProgress = (test, shouldExist) => {
  return it('Docket clerk views Section Document QC - In Progress', async () => {
    await test.runSequence('gotoWorkQueueSequence');
    expect(test.getState('currentPage')).toEqual('WorkQueue');
    await test.runSequence('chooseWorkQueueSequence', {
      box: 'inProgress',
      queue: 'section',
    });

    const workQueueToDisplay = test.getState('workQueueToDisplay');

    expect(workQueueToDisplay.queue).toEqual('section');
    expect(workQueueToDisplay.box).toEqual('inProgress');

    const inProgressQueue = test.getState('workQueue');
    const inProgressWorkItem = inProgressQueue.find(
      workItem =>
        workItem.document.documentId === test.docketRecordEntry.documentId,
    );

    if (shouldExist) {
      expect(inProgressWorkItem).toBeTruthy();
      expect(inProgressWorkItem.document.otherFilingParty).toEqual(
        'Brianna Noble',
      );
    } else {
      expect(inProgressWorkItem).toBeFalsy();
    }
  });
};
