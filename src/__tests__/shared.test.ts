import { describe, it, expect } from 'vitest';
import { escapeShellString, getSelectedPackages, getUniversalPackages, generateUniversalScript, generateAsciiHeader } from '@/lib/scripts/shared';
import { apps } from '@/lib/data';

describe('shared.ts', () => {
    describe('escapeShellString', () => {
        it('应转义双引号', () => expect(escapeShellString('Hello "World"')).toBe('Hello \\"World\\"'));
        it('应转义美元符号', () => expect(escapeShellString('$HOME')).toBe('\\$HOME'));
        it('应转义反引号', () => expect(escapeShellString('`ls`')).toBe('\\`ls\\`'));
        it('应转义反斜杠', () => expect(escapeShellString('a\\b')).toBe('a\\\\b'));
        it('应转义感叹号', () => expect(escapeShellString('Hello!')).toBe('Hello\\!'));
        it('安全字符串保持不变', () => expect(escapeShellString('Firefox')).toBe('Firefox'));
    });

    describe('getSelectedPackages', () => {
        it('空选集返回空数组', () => {
            expect(getSelectedPackages(new Set(), 'ubuntu')).toEqual([]);
        });

        it('返回有效软件的目标包名', () => {
            const firefox = apps.find(a => a.id === 'firefox')!;
            const result = getSelectedPackages(new Set(['firefox']), 'ubuntu');
            expect(result).toHaveLength(1);
            expect(result[0].app.id).toBe('firefox');
            expect(result[0].pkg).toBeTruthy();
        });

        it('跳过目标发行版不可用的软件', () => {
            // wechat is flatpak-only on ubuntu, firefox is in repo
            const result = getSelectedPackages(new Set(['wechat', 'firefox']), 'ubuntu');
            expect(result).toHaveLength(1);
            expect(result[0].app.id).toBe('firefox');
        });

        it('过滤不存在的 ID', () => {
            const result = getSelectedPackages(new Set(['firefox', 'nonexistent-app']), 'ubuntu');
            expect(result).toHaveLength(1);
            expect(result[0].app.id).toBe('firefox');
        });
    });

    describe('getUniversalPackages（npm / script）', () => {
        it('空选集返回空数组', () => {
            expect(getUniversalPackages(new Set(), 'npm')).toEqual([]);
        });

        it('过滤已包含在当前发行版目标中的软件', () => {
            const result = getUniversalPackages(new Set(['firefox']), 'npm', 'ubuntu');
            expect(result).toHaveLength(0);
        });

        it('对 npm 目标的软件返回对应包', () => {
            // codex has npm target
            const result = getUniversalPackages(new Set(['codex']), 'npm', 'ubuntu');
            expect(result.length).toBeGreaterThan(0);
            expect(result[0].pkg).toBe('@openai/codex');
        });

        it('对 script 目标的软件返回安装命令', () => {
            // opencode has script target
            const result = getUniversalPackages(new Set(['opencode']), 'script', 'ubuntu');
            expect(result.length).toBeGreaterThan(0);
            expect(result[0].pkg).toContain('curl');
        });
    });

    describe('generateUniversalScript', () => {
        it('空选集返回空字符串', () => {
            expect(generateUniversalScript(new Set())).toBe('');
        });

        it('不包含 npm/script 目标的软件返回空', () => {
            const result = generateUniversalScript(new Set(['code']), 'ubuntu');
            expect(result).toBe('');
        });

        it('包含 npm 目标软件时生成 npm 安装脚本', () => {
            const result = generateUniversalScript(new Set(['codex']), 'ubuntu');
            expect(result).toContain('npm');
            expect(result).toContain('@openai/codex');
        });

        it('包含 script 目标软件时生成自定义安装脚本', () => {
            const result = generateUniversalScript(new Set(['opencode']), 'ubuntu');
            expect(result).toContain('Running script');
            expect(result).toContain('curl');
        });

        it('同时包含 npm 和 script 目标', () => {
            const result = generateUniversalScript(new Set(['codex', 'opencode']), 'ubuntu');
            expect(result).toContain('npm');
            expect(result).toContain('@openai/codex');
            expect(result).toContain('Running script');
            expect(result).toContain('curl');
        });
    });

    describe('generateAsciiHeader', () => {
        it('应输出有效 shebang', () => {
            expect(generateAsciiHeader('Ubuntu', 5).startsWith('#!/bin/bash')).toBe(true);
        });

        it('应包含发行版名称和包数量', () => {
            const header = generateAsciiHeader('Arch Linux', 10);
            expect(header).toContain('Arch Linux');
            expect(header).toContain('10');
        });

        it('应包含 set -euo pipefail', () => {
            expect(generateAsciiHeader('Debian', 3)).toContain('set -euo pipefail');
        });
    });
});
