import { agreeDisagreeDifferences } from './fn_agree';

describe('agreeDisagreeDifferences', () => {
	it('should return correct differences when agreeBefore is positive', () => {
		const result = agreeDisagreeDifferences(5, 3);
		expect(result).toEqual({
			diffInAgree: -2,
			diffInDisagree: 0,
		});
	});

	it('should return correct differences when agreeBefore is negative', () => {
		const result = agreeDisagreeDifferences(-5, -3);
		expect(result).toEqual({
			diffInAgree: 0,
			diffInDisagree: -2,
		});
	});

	it('should return zero differences when agreeBefore and agreeAfter are the same', () => {
		const result = agreeDisagreeDifferences(5, 5);
		expect(result).toEqual({
			diffInAgree: 0,
			diffInDisagree: 0,
		});
	});

	it('should return correct differences when agreeAfter is zero', () => {
		const result = agreeDisagreeDifferences(5, 0);
		expect(result).toEqual({
			diffInAgree: -5,
			diffInDisagree: 0,
		});
	});

	it('should return correct differences when agreeBefore is zero', () => {
		const result = agreeDisagreeDifferences(0, 5);
		expect(result).toEqual({
			diffInAgree: 5,
			diffInDisagree: 0,
		});
	});
});
