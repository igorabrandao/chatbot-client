import {PhpTimeToJsDatePipe} from './php-time-to-js-date.pipe';

describe('PhpTimeToJsDatePipe', () => {
    it('correctly transform "1510688296" into "Nov 14, 2017"', () => {
        const pipe = new PhpTimeToJsDatePipe('en-US');
        expect(pipe.transform(1510688296)).toBe('Nov 14, 2017');
    });
});
