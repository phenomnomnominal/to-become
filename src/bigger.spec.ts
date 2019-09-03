import { bigger } from './index';

describe(`toBecome(bigger)`, () => {
    it(`it should work for values that grow`, () => {
        expect(Date.now()).toBecome(bigger);
    });

    it(`it should work for values that stay the same size`, () => {
        expect(1000).toBecome(bigger);
    });

    it('should not break existing snapshots', () => {
        expect(1000).toMatchSnapshot();
    });
});
