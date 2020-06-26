const { CaseExternal } = require('./CaseExternal');
const { PARTY_TYPES } = require('../EntityConstants');

describe('CaseExternal', () => {
  describe('for Corporation Contacts', () => {
    it('should not validate without contact', () => {
      const caseExternal = new CaseExternal({
        caseType: 'Other',
        filingType: 'Myself',
        hasIrsNotice: true,
        irsNoticeDate: '2009-10-13',
        partyType: PARTY_TYPES.corporation,
        petitionFile: {},
        petitionFileSize: 1,
        preferredTrialCity: 'Chattanooga, Tennessee',
        procedureType: 'Small',
        signature: true,
        stinFile: {},
        stinFileSize: 1,
      });
      expect(caseExternal.isValid()).toEqual(false);
    });

    it('should not validate without inCareOf', () => {
      const caseExternal = new CaseExternal({
        caseType: 'Other',
        contactPrimary: {
          address1: '876 12th Ave',
          city: 'Nashville',
          country: 'USA',
          countryType: 'domestic',
          email: 'someone@example.com',
          name: 'Jimmy Dean',
          phone: '1234567890',
          postalCode: '05198',
          state: 'AK',
        },
        filingType: 'Myself',
        hasIrsNotice: true,
        irsNoticeDate: '2009-10-13',
        partyType: PARTY_TYPES.corporation,
        petitionFile: {},
        petitionFileSize: 1,
        preferredTrialCity: 'Chattanooga, Tennessee',
        procedureType: 'Small',
        signature: true,
      });
      expect(caseExternal.isValid()).toEqual(false);
    });

    it('can validate primary contact', () => {
      const caseExternal = new CaseExternal({
        caseType: 'Other',
        contactPrimary: {
          address1: '876 12th Ave',
          city: 'Nashville',
          country: 'USA',
          countryType: 'domestic',
          email: 'someone@example.com',
          inCareOf: 'USTC',
          name: 'Jimmy Dean',
          phone: '1234567890',
          postalCode: '05198',
          state: 'AK',
        },
        filingType: 'Myself',
        hasIrsNotice: true,
        irsNoticeDate: '2009-10-13',
        partyType: PARTY_TYPES.corporation,
        petitionFile: {},
        petitionFileSize: 1,
        preferredTrialCity: 'Chattanooga, Tennessee',
        procedureType: 'Small',
        signature: true,
        stinFile: {},
        stinFileSize: 1,
      });
      expect(caseExternal.getFormattedValidationErrors()).toEqual(null);
    });
  });
});
