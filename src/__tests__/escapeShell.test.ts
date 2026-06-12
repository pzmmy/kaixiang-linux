import { describe, it, expect } from 'vitest';
import { escapeShellString } from '@/lib/scripts/shared';

describe('escapeShellString', () => {
    it('应转义双引号', () => {
        expect(escapeShellString('Hello "World"')).toBe('Hello \\"World\\"');
    });

    it('应转义美元符号', () => {
        expect(escapeShellString('$HOME')).toBe('\\$HOME');
        expect(escapeShellString('Price: $100')).toBe('Price: \\$100');
    });

    it('应转义反引号', () => {
        expect(escapeShellString('`command`')).toBe('\\`command\\`');
    });

    it('应转义反斜杠', () => {
        expect(escapeShellString('a\\b')).toBe('a\\\\b');
    });

    it('应保留安全字符串', () => {
        expect(escapeShellString('Firefox')).toBe('Firefox');
        expect(escapeShellString('VS Code')).toBe('VS Code');
        expect(escapeShellString('GIMP 2.10')).toBe('GIMP 2.10');
    });
});
