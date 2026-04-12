// @ts-nocheck
import React from 'react';
import { AlertCircle, CheckCircle, AlertTriangle, HelpCircle, Copy, Check } from 'lucide-react';
import { QualityCheck } from '../types';
import { useCityStore } from '../state';

interface QualityPanelProps {
  checks: QualityCheck[];
}

export const QualityPanel: React.FC<QualityPanelProps> = ({ checks }) => {
  const { highlightOffenders, clearHighlights } = useCityStore();

  if (checks.length === 0) {
    return (
      <div className="p-4 bg-stone-50 rounded-lg border border-stone-200 text-center">
        <p className="text-xs text-stone-500">
          Generate a city to see quality checks
        </p>
      </div>
    );
  }

  const passCount = checks.filter((c) => c.status === 'pass').length;
  const failCount = checks.filter((c) => c.status === 'fail').length;
  const warnCount = checks.filter((c) => c.status === 'warn').length;

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-2">
        <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200">
          <p className="text-[10px] font-bold text-emerald-600 uppercase">Pass</p>
          <p className="text-lg font-mono font-bold text-emerald-700">{passCount}</p>
        </div>
        <div className="p-2 rounded-lg bg-amber-50 border border-amber-200">
          <p className="text-[10px] font-bold text-amber-600 uppercase">Warn</p>
          <p className="text-lg font-mono font-bold text-amber-700">{warnCount}</p>
        </div>
        <div className="p-2 rounded-lg bg-red-50 border border-red-200">
          <p className="text-[10px] font-bold text-red-600 uppercase">Fail</p>
          <p className="text-lg font-mono font-bold text-red-700">{failCount}</p>
        </div>
      </div>

      <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
        {checks.map((check) => (
          <QualityCheckItem
            key={check.id}
            check={check}
            onHighlight={() => {
              if (check.offenders?.length) {
                highlightOffenders(
                  check.offenders.map((o) => o.id)
                );
              }
            }}
            onClear={clearHighlights}
          />
        ))}
      </div>
    </div>
  );
};

interface QualityCheckItemProps {
  check: QualityCheck;
  onHighlight: () => void;
  onClear: () => void;
}

const QualityCheckItem: React.FC<QualityCheckItemProps> = ({
  check,
  onHighlight,
  onClear,
}) => {
  const [expanded, setExpanded] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    const errorText = `${check.label}: ${check.message}`;
    navigator.clipboard.writeText(errorText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const statusIcon =
    check.status === 'pass'
      ? CheckCircle
      : check.status === 'fail'
      ? AlertCircle
      : check.status === 'warn'
      ? AlertTriangle
      : HelpCircle;
  const StatusIcon = statusIcon;

  const statusColor =
    check.status === 'pass'
      ? 'text-emerald-600'
      : check.status === 'fail'
      ? 'text-red-600'
      : check.status === 'warn'
      ? 'text-amber-600'
      : 'text-stone-400';

  const bgColor =
    check.status === 'pass'
      ? 'bg-emerald-50 border-emerald-200 hover:bg-emerald-100'
      : check.status === 'fail'
      ? 'bg-red-50 border-red-200 hover:bg-red-100'
      : check.status === 'warn'
      ? 'bg-amber-50 border-amber-200 hover:bg-amber-100'
      : 'bg-stone-50 border-stone-200 hover:bg-stone-100';

  return (
    <div
      className={`p-3 rounded-lg border ${bgColor} transition-colors cursor-pointer`}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-center gap-2 mb-1">
        <StatusIcon className={`w-4 h-4 ${statusColor}`} />
        <p className="text-xs font-medium text-stone-700 flex-1">{check.label}</p>
        {check.offenders && check.offenders.length > 0 && (
          <span className="text-[10px] font-mono px-1.5 py-0.5 bg-white rounded border border-stone-200">
            {check.offenders.length}
          </span>
        )}
        {(check.status === 'warn' || check.status === 'fail') && (
          <button
            onClick={handleCopy}
            className="p-1 hover:bg-white rounded transition-colors"
            title="Copy error message"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <Copy className="w-3.5 h-3.5 text-stone-400 hover:text-stone-600" />
            )}
          </button>
        )}
      </div>
      <p className="text-[11px] text-stone-600 leading-tight">{check.message}</p>

      {expanded && check.offenders && check.offenders.length > 0 && (
        <div className="mt-2 pt-2 border-t border-stone-300 space-y-1">
          {check.offenders.slice(0, 3).map((offender, idx) => (
            <div key={idx} className="text-[10px] text-stone-600 ml-1">
              <strong>{offender.id}</strong>: {offender.reason}
            </div>
          ))}
          {check.offenders.length > 3 && (
            <div className="text-[10px] text-stone-500 italic">
              +{check.offenders.length - 3} more
            </div>
          )}
          <div className="flex gap-2 mt-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                const detailsText = `${check.label}: ${check.message}\n\nOffenders:\n${check.offenders.map(o => `- ${o.id}: ${o.reason}`).join('\n')}`;
                navigator.clipboard.writeText(detailsText);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="flex-1 px-2 py-1 text-[10px] font-medium bg-white border border-stone-300 rounded hover:bg-stone-100 transition-colors flex items-center justify-center gap-1"
            >
              {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onHighlight();
              }}
              className="flex-1 px-2 py-1 text-[10px] font-medium bg-white border border-stone-300 rounded hover:bg-stone-100 transition-colors"
            >
              Highlight
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClear();
              }}
              className="flex-1 px-2 py-1 text-[10px] font-medium bg-white border border-stone-300 rounded hover:bg-stone-100 transition-colors"
            >
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
