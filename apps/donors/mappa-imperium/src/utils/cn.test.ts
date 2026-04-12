import { cn } from './cn';

describe('cn utility', () => {
    it('should return empty string if no arguments passed', () => {
        expect(cn()).toBe('');
    });

    it('should join string arguments with space', () => {
        expect(cn('foo', 'bar')).toBe('foo bar');
    });

    it('should ignore falsey values', () => {
        expect(cn('foo', false, 'bar', undefined, null, '')).toBe('foo bar');
    });

    it('should handle boolean expressions', () => {
        const isTrue = true;
        const isFalse = false;
        expect(cn('foo', isTrue && 'bar', isFalse && 'baz')).toBe('foo bar');
    });

    it('should handle array destructuring if used (though implementation uses rest args)', () => {
        // The current implementation takes ...args.
        // If we passed an array, it might not work unless we spread it.
        // Let's verify behavior if someone passes mixed types that are technically allowed by signature (string | boolean | undefined | null)
        expect(cn('a', 'b', null, 'c')).toBe('a b c');
    });
});
