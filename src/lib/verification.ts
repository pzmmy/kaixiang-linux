// ============================================================
// Flatpak/Snap verification — 显示已验证发布者徽章
// 数据在构建时获取，避免跨域问题
// ============================================================

import verifiedFlatpaks from './verified-flatpaks.json';
import verifiedSnaps from './verified-snaps.json';

/** 构建时加载的已验证 Flatpak 应用 ID 集合 */
const VERIFIED_FLATPAK_APPS = new Set(verifiedFlatpaks.apps);
/** 构建时加载的已验证 Snap 包名集合 */
const VERIFIED_SNAP_PACKAGES = new Set(verifiedSnaps.apps);

/**
 * 检查 Flatpak 应用是否已通过 Flathub 验证
 * @param appId - Flatpak 应用 ID（如 org.mozilla.firefox）
 * @returns 是否在已验证列表内
 */
export function isFlathubVerified(appId: string): boolean {
    return VERIFIED_FLATPAK_APPS.has(appId);
}

/**
 * 检查 Snap 包是否来自已验证的发布者
 * @param snapName - Snap 包名称（可能含 --classic 后缀）
 * @returns 是否在已验证列表内
 */
export function isSnapVerified(snapName: string): boolean {
    const cleanName = snapName.split(' ')[0];
    return VERIFIED_SNAP_PACKAGES.has(cleanName);
}

