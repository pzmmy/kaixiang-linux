'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { Search, X, Cpu, Printer, Scan, Wifi, Fingerprint, CreditCard, Monitor, ChevronDown, ExternalLink } from 'lucide-react';

interface DistroCompatibility {
  [distro: string]: 'full' | 'partial' | 'manual' | 'unsupported';
}

interface HardwareItem {
  id: string;
  name: string;
  type: 'printer' | 'scanner' | 'wifi' | 'fingerprint' | 'gpu' | 'ukey' | 'laptop' | 'other';
  vendor: string;
  distros: DistroCompatibility;
  status: 'full' | 'partial' | 'manual' | 'unsupported';
  driverInstructions: string;
  source: string;
}

const STATUS_CONFIG: Record<string, { label: string; icon: string; color: string; className: string }> = {
  full: {
    label: '完全支持',
    icon: '🟢',
    color: '#22c55e',
    className: 'bg-green-500/10 text-green-400 border-green-500/20',
  },
  partial: {
    label: '部分支持',
    icon: '🟡',
    color: '#eab308',
    className: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  },
  manual: {
    label: '需手动配置',
    icon: '🔴',
    color: '#ef4444',
    className: 'bg-red-500/10 text-red-400 border-red-500/20',
  },
  unsupported: {
    label: '不支持',
    icon: '⚫',
    color: '#6b7280',
    className: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
  },
};

const TYPE_CONFIG: Record<string, { label: string; icon: React.ReactNode }> = {
  printer: { label: '打印机', icon: <Printer className="w-3.5 h-3.5" /> },
  scanner: { label: '扫描仪', icon: <Scan className="w-3.5 h-3.5" /> },
  wifi: { label: '无线网卡', icon: <Wifi className="w-3.5 h-3.5" /> },
  fingerprint: { label: '指纹', icon: <Fingerprint className="w-3.5 h-3.5" /> },
  gpu: { label: '显卡 (GPU)', icon: <Cpu className="w-3.5 h-3.5" /> },
  ukey: { label: '税务UKey', icon: <CreditCard className="w-3.5 h-3.5" /> },
  laptop: { label: '笔记本', icon: <Monitor className="w-3.5 h-3.5" /> },
  other: { label: '其他', icon: <Cpu className="w-3.5 h-3.5" /> },
};

const DISTRO_LABELS: Record<string, string> = {
  deepin: 'Deepin',
  ubuntu: 'Ubuntu',
  kylin: '麒麟',
  arch: 'Arch',
  fedora: 'Fedora',
  opensuse: 'openSUSE',
  'deepin-loongarch': 'Deepin(龙架构)',
  'kylin-loongarch': '麒麟(龙架构)',
  'ubuntu-loongarch': 'Ubuntu(龙架构)',
  'arch-loongarch': 'Arch(龙架构)',
};

const DISTRO_FILTER_OPTIONS = [
  { id: 'all', label: '全部发行版' },
  { id: 'ubuntu', label: 'Ubuntu' },
  { id: 'deepin', label: 'Deepin' },
  { id: 'kylin', label: '麒麟' },
  { id: 'arch', label: 'Arch Linux' },
  { id: 'fedora', label: 'Fedora' },
];

type DistroFilter = 'all' | 'ubuntu' | 'deepin' | 'kylin' | 'arch' | 'fedora';

interface HardwareCheckProps {
  onClose?: () => void;
}

export function HardwareCheck({ onClose }: HardwareCheckProps) {
  const [hardwareList, setHardwareList] = useState<HardwareItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedDistroFilter, setSelectedDistroFilter] = useState<DistroFilter>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/kaixiang-linux/hardware-compatibility.json')
      .then(r => r.json())
      .then((data: HardwareItem[]) => {
        setHardwareList(data);
        setLoading(false);
      })
      .catch(() => {
        // Fallback: try direct import
        import('@/lib/hardware-compatibility.json').then((mod) => {
          setHardwareList(mod.default as HardwareItem[]);
          setLoading(false);
        }).catch(() => setLoading(false));
      });
  }, []);

  const filteredList = useMemo(() => {
    let list = hardwareList;

    if (selectedType) {
      list = list.filter(h => h.type === selectedType);
    }

    if (selectedDistroFilter !== 'all') {
      list = list.filter(h => {
        const distroStatus = h.distros[selectedDistroFilter];
        return distroStatus !== undefined && distroStatus !== 'unsupported';
      });
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        h =>
          h.name.toLowerCase().includes(q) ||
          h.vendor.toLowerCase().includes(q) ||
          h.type.toLowerCase().includes(q) ||
          h.driverInstructions.toLowerCase().includes(q)
      );
    }

    return list;
  }, [hardwareList, searchQuery, selectedType, selectedDistroFilter]);

  const typeCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    hardwareList.forEach(h => {
      counts[h.type] = (counts[h.type] || 0) + 1;
    });
    return counts;
  }, [hardwareList]);

  const expandedItem = expandedId ? hardwareList.find(h => h.id === expandedId) : null;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-[var(--text-muted)]">加载硬件兼容数据库...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="hardware-check">
      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-6 pb-2">
        <div>
          <h2 className="text-lg font-bold text-[var(--text-primary)]">硬件兼容性查询</h2>
          <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
            查询国产硬件在 Linux 下的支持情况
          </p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-[var(--bg-hover)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Search */}
      <div className="px-6 pb-3 pt-3">
        <div className="relative">
          <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-lg border border-[var(--border-primary)] bg-transparent">
            <Search className="w-3.5 h-3.5 text-[var(--text-muted)] shrink-0 opacity-40" />
            <input
              ref={searchRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索硬件名称或品牌..."
              className="flex-1 bg-transparent text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)]/40 outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Type filter */}
      <div className="px-6 pb-3">
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setSelectedType(null)}
            className={`px-2.5 py-1.5 text-[11px] font-medium rounded-lg border transition-all ${
              !selectedType
                ? 'bg-[var(--accent)]/20 text-[var(--accent)] border-[var(--accent)]/40'
                : 'bg-[var(--bg-tertiary)] text-[var(--text-muted)] border-[var(--border-primary)]/30 hover:bg-[var(--bg-hover)]'
            }`}
          >
            全部 ({hardwareList.length})
          </button>
          {Object.entries(TYPE_CONFIG).map(([key, cfg]) => (
            <button
              key={key}
              onClick={() => setSelectedType(selectedType === key ? null : key)}
              className={`flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-medium rounded-lg border transition-all ${
                selectedType === key
                  ? 'bg-[var(--accent)]/20 text-[var(--accent)] border-[var(--accent)]/40'
                  : 'bg-[var(--bg-tertiary)] text-[var(--text-muted)] border-[var(--border-primary)]/30 hover:bg-[var(--bg-hover)]'
              }`}
            >
              {cfg.icon}
              <span>{cfg.label}</span>
              <span className="opacity-50">({typeCounts[key] || 0})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Distro filter */}
      <div className="px-6 pb-3">
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] font-semibold shrink-0">发行版筛选:</span>
          <div className="flex flex-wrap gap-1">
            {DISTRO_FILTER_OPTIONS.map(opt => (
              <button
                key={opt.id}
                onClick={() => setSelectedDistroFilter(opt.id as DistroFilter)}
                className={`px-2 py-1 text-[10px] font-medium rounded-md border transition-all ${
                  selectedDistroFilter === opt.id
                    ? 'bg-[var(--accent)]/20 text-[var(--accent)] border-[var(--accent)]/40'
                    : 'bg-[var(--bg-tertiary)] text-[var(--text-muted)] border-[var(--border-primary)]/30 hover:bg-[var(--bg-hover)]'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results count */}
      <div className="px-6 pb-2">
        <p className="text-[11px] text-[var(--text-muted)]">
          共 {filteredList.length} 个硬件 {searchQuery && `（搜索: "${searchQuery}"）`}
        </p>
      </div>

      {/* Hardware list */}
      <div className="px-6 pb-6 space-y-2">
        {filteredList.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-3xl mb-3">🔍</div>
            <p className="text-sm text-[var(--text-muted)]">没有找到匹配的硬件</p>
            <p className="text-xs text-[var(--text-muted)] opacity-60 mt-1">试试其他关键词或筛选条件</p>
          </div>
        ) : (
          filteredList.map((item) => {
            const statusCfg = STATUS_CONFIG[item.status];
            const typeCfg = TYPE_CONFIG[item.type];
            const isExpanded = expandedId === item.id;

            return (
              <div
                key={item.id}
                className={`rounded-xl border transition-all ${
                  isExpanded
                    ? 'border-[var(--accent)]/30 bg-[var(--bg-secondary)]/60'
                    : 'border-[var(--border-primary)] bg-[var(--bg-secondary)]/30 hover:border-[var(--border-primary)]/60'
                }`}
              >
                <button
                  onClick={() => setExpandedId(isExpanded ? null : item.id)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left"
                >
                  <div className="w-7 h-7 flex items-center justify-center rounded-lg bg-[var(--bg-tertiary)] shrink-0">
                    {typeCfg?.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-[var(--text-primary)] truncate">
                        {item.name}
                      </span>
                      <span className="text-[10px] text-[var(--text-muted)] whitespace-nowrap opacity-60">
                        {item.vendor}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-[10px] text-[var(--text-muted)]">{typeCfg?.label || item.type}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold rounded-full border ${statusCfg.className}`}
                    >
                      <span>{statusCfg.icon}</span>
                      <span>{statusCfg.label}</span>
                    </span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-[var(--text-muted)] transition-transform ${
                        isExpanded ? 'rotate-180' : ''
                      }`}
                    />
                  </div>
                </button>

                {/* Expanded detail */}
                {isExpanded && (
                  <div className="px-4 pb-4 pt-1 border-t border-[var(--border-primary)]/50">
                    {/* Distro compatibility table */}
                    <div className="mb-3">
                      <p className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] font-semibold mb-1.5">
                        发行版兼容性
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {Object.entries(item.distros).map(([distro, dStatus]) => {
                          const dCfg = STATUS_CONFIG[dStatus];
                          return (
                            <span
                              key={distro}
                              className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] rounded-md border ${dCfg.className}`}
                            >
                              <span>{dCfg.icon}</span>
                              <span>{DISTRO_LABELS[distro] || distro}</span>
                            </span>
                          );
                        })}
                      </div>
                    </div>

                    {/* Driver instructions */}
                    <div className="mb-3">
                      <p className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] font-semibold mb-1">
                        驱动安装指引
                      </p>
                      <p className="text-[12px] text-[var(--text-secondary)] leading-relaxed">
                        {item.driverInstructions}
                      </p>
                    </div>

                    {/* Source link */}
                    {item.source && (
                      <a
                        href={item.source}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] text-[var(--accent)] hover:underline"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>查看来源</span>
                      </a>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
