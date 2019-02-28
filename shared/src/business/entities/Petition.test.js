const Petition = require('./Petition');

describe('Petition entity', () => {
  describe('isValid', () => {
    it('requires ownership disclosure if filing type is a business', () => {
      const petition = new Petition({
        caseType: 'other',
        businessType: 'Corporation',
        procedureType: 'Small',
        filingType: 'A business',
        preferredTrialCity: 'Chattanooga, TN',
        hasIrsNotice: false,
        irsNoticeDate: null,
      });
      expect(
        petition.getFormattedValidationErrors().ownershipDisclosureFile,
      ).toEqual('Ownership Disclosure Statement is required.');
    });
    it('does not require ownership disclosure if filing type not set', () => {
      const petition = new Petition({
        caseType: 'other',
        procedureType: 'Small',
        preferredTrialCity: 'Chattanooga, TN',
        hasIrsNotice: false,
        irsNoticeDate: null,
      });
      expect(
        petition.getFormattedValidationErrors().ownershipDisclosureFile,
      ).toBeUndefined();
    });
    it('does not require ownership disclosure if filing type not a business', () => {
      const petition = new Petition({
        caseType: 'other',
        procedureType: 'Small',
        filingType: 'not a biz',
        preferredTrialCity: 'Chattanooga, TN',
        hasIrsNotice: false,
        irsNoticeDate: null,
      });
      expect(
        petition.getFormattedValidationErrors().ownershipDisclosureFile,
      ).toBeUndefined();
    });
  });

  describe('irs notice date validation', () => {
    it('should require notice date', () => {
      const petition = new Petition({
        caseType: 'other',
        procedureType: 'Small',
        filingType: 'Myself',
        preferredTrialCity: 'Chattanooga, TN',
        petitionFile: {},
        signature: true,
        hasIrsNotice: true,
        partyType:
          'Next Friend for a Minor (Without a Guardian, Conservator, or other like Fiduciary)',
      });
      expect(petition.getFormattedValidationErrors().irsNoticeDate).toEqual(
        'Notice Date is a required field.',
      );
    });

    it('should not require notice date', () => {
      const petition = new Petition({
        caseType: 'other',
        procedureType: 'Small',
        filingType: 'Myself',
        preferredTrialCity: 'Chattanooga, TN',
        petitionFile: {},
        signature: true,
        hasIrsNotice: false,
        partyType:
          'Next Friend for a Minor (Without a Guardian, Conservator, or other like Fiduciary)',
      });
      expect(
        petition.getFormattedValidationErrors().irsNoticeDate,
      ).toBeUndefined();
    });

    it('should not require case type without indicating they have a notice ', () => {
      const petition = new Petition({
        hasIrsNotice: undefined,
        procedureType: 'Small',
        filingType: 'Myself',
        preferredTrialCity: 'Chattanooga, TN',
        petitionFile: {},
        signature: true,
        partyType:
          'Next Friend for a Minor (Without a Guardian, Conservator, or other like Fiduciary)',
      });
      expect(petition.getFormattedValidationErrors().caseType).toBeUndefined();
    });

    it('should inform you if notice date is in the future', () => {
      const petition = new Petition({
        caseType: 'other',
        procedureType: 'Small',
        filingType: 'Myself',
        preferredTrialCity: 'Chattanooga, TN',
        hasIrsNotice: true,
        irsNoticeDate: '3009-10-13',
        petitionFile: {},
        signature: true,
        partyType:
          'Next Friend for a Minor (Without a Guardian, Conservator, or other like Fiduciary)',
      });
      expect(petition.getFormattedValidationErrors().irsNoticeDate).toEqual(
        'Notice Date is in the future. Please enter a valid date.',
      );
    });
  });
});
