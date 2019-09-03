import { smaller } from './index';

describe(`toBecome(smaller)`, () => {
    it(`it should work for values that shrink`, () => {
        expect(3133634400000 - Date.now()).toBecome(smaller);
    });

    it(`it should work for values that stay the same size`, () => {
        expect(1000).toBecome(smaller);
    });
});
