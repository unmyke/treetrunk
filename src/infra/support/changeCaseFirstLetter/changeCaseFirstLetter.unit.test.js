import { uppercaseFirstLetter, lowercaseFirstLetter } from '.';

const emptyString = '';
const lowercasedFirstLetterWord = 'lOWERCASEDFIRSTLETTERWORD';
const lowercasedFirstTwoLetterWord = 'loWERCASEDFIRSTTWOLETTERWORD';
const lowercasedWord = 'lowercasedword';
const uppercasedFirstLetterWord = 'Uppercasedfirstletterword';
const uppercasedFirstTwoLetterWord = 'UPpercasedfirsttwoletterword';
const uppercasedWord = 'UPPERCASEDWORD';

describe('Domain :: lib :: changeCaseFirstLetter', () => {
  describe('#toUpperCase', () => {
    context('when word is empty string', () => {
      test('should returns empty string', () => {
        expect(uppercaseFirstLetter(emptyString)).toHaveLength(0);
      });
    });

    context('when word with lowercased first letter', () => {
      test('should returns word with uppercased first letter', () => {
        expect(uppercaseFirstLetter(lowercasedFirstLetterWord)).toBe(
          'LOWERCASEDFIRSTLETTERWORD'
        );
      });
    });

    context('when word with lowercased first two letters', () => {
      test('should returns word with uppercased first letter and lowercased second letter', () => {
        expect(uppercaseFirstLetter(lowercasedFirstTwoLetterWord)).toBe(
          'LoWERCASEDFIRSTTWOLETTERWORD'
        );
      });
    });

    context('when lowercased word', () => {
      test('should returns word with uppercased first letter', () => {
        expect(uppercaseFirstLetter(lowercasedWord)).toBe('Lowercasedword');
      });
    });
  });

  describe('#toLowerCase', () => {
    context('when word is empty string', () => {
      test('should returns empty string', () => {
        expect(lowercaseFirstLetter(emptyString)).toHaveLength(0);
      });
    });

    context('when word with uppercased first letter', () => {
      test('should returns word with lowercased first letter', () => {
        expect(lowercaseFirstLetter(uppercasedFirstLetterWord)).toBe(
          'uppercasedfirstletterword'
        );
      });
    });

    context('when word with uppercased first two letters', () => {
      test('should returns word with lowercased first letter and lowercased second letter', () => {
        expect(lowercaseFirstLetter(uppercasedFirstTwoLetterWord)).toBe(
          'uPpercasedfirsttwoletterword'
        );
      });
    });

    context('when uppercased word', () => {
      test('should returns word with lowercased first letter', () => {
        expect(lowercaseFirstLetter(uppercasedWord)).toBe('uPPERCASEDWORD');
      });
    });
  });
});
