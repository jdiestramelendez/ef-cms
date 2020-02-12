import { CerebralTest } from 'cerebral/test';
import { ContactFactory } from '../../../../shared/src/business/entities/contacts/ContactFactory';
import { presenter } from '../presenter';

let test = CerebralTest(presenter);

describe('generateInternalCaseCaptionSequence', () => {
  it('should create and set a case caption for the case', async () => {
    test.setState('form', {
      contactPrimary: {
        name: 'Carl Fredricksen',
      },
      partyType: ContactFactory.PARTY_TYPES.petitioner,
    });

    await test.runSequence('generateInternalCaseCaptionSequence');

    expect(test.getState('form.caseCaption')).toBe(
      'Carl Fredricksen, Petitioner',
    );
  });
});
