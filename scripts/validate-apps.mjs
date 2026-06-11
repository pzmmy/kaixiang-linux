/**
 * 构建前校验所有 App JSON 数据完整性
 * 确保必填字段存在，防止运行时崩
 */
import fs from 'fs';
import path from 'path';

const appsDir = path.resolve('src/lib/apps');
const requiredFields = ['id', 'name', 'description', 'category', 'targets', 'icon'];
const validCategories = [
    'Web Browsers', 'Communication', 'Dev: Languages', 'Dev: Editors', 'Dev: Tools',
    'Terminal', 'CLI Tools', 'Media', 'Creative', 'Gaming', 'Office',
    'VPN & Network', 'Security', 'File Sharing', 'System', 'AI Tools'
];

let errors = 0;

fs.readdirSync(appsDir)
    .filter(f => f.endsWith('.json'))
    .forEach(file => {
        const filePath = path.join(appsDir, file);
        const content = fs.readFileSync(filePath, 'utf-8');
        let apps;
        try {
            apps = JSON.parse(content);
        } catch (e) {
            console.error(`❌ ${file}: JSON 格式错误`);
            errors++;
            return;
        }
        if (!Array.isArray(apps)) {
            console.error(`❌ ${file}: 不是数组`);
            errors++;
            return;
        }
        apps.forEach((app, i) => {
            const missing = requiredFields.filter(f => app[f] === undefined);
            if (missing.length > 0) {
                console.error(`❌ ${file}[${i}] ${app.id || '(no id)'}: 缺少字段 ${missing.join(', ')}`);
                errors++;
            }
            if (app.category && !validCategories.includes(app.category)) {
                console.error(`❌ ${file}[${i}] ${app.id}: 未知分类 "${app.category}"`);
                errors++;
            }
        });
        console.log(`  ✓ ${file}: ${apps.length} 个软件`);
    });

if (errors > 0) {
    console.error(`\n❌ 共 ${errors} 个错误，构建终止`);
    process.exit(1);
}
console.log(`\n✅ 全部校验通过`);
