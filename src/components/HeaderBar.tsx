import React from 'react';
import { Settings, Play, RefreshCw, BarChart2, Check, Radio, Pause } from 'lucide-react';

interface HeaderBarProps {
  stockCount: number;
  maxStocks?: number;
  onOpenEditModal: () => void;
  threshold: number;
  onChangeThreshold: (val: number) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
  lastUpdated?: string | null;
  isRealtimeActive: boolean;
  onToggleRealtime: () => void;
  realtimeInterval: number;
  onChangeInterval: (val: number) => void;
  isLiveUpdating: boolean;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  stockCount,
  maxStocks = 50,
  onOpenEditModal,
  threshold,
  onChangeThreshold,
  onAnalyze,
  isAnalyzing,
  lastUpdated,
  isRealtimeActive,
  onToggleRealtime,
  realtimeInterval,
  onChangeInterval,
  isLiveUpdating,
}) => {
  const quickThresholds = [3, 4, 5, 7];
  const intervalSeconds = Math.round(realtimeInterval / 1000);

  return (
    <header className="bg-slate-900/90 border-b border-slate-800 sticky top-0 z-30 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Left: Brand and Watchlist Status */}
        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-black shadow-md shadow-indigo-600/30">
              <BarChart2 className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
                Stock Move Finder
              </h1>
              <div className="text-[11px] text-slate-400 font-medium hidden sm:block">
                급등·급락 탐지 및 3단어 핵심 원인 팩트체커
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Watchlist Counter */}
            <span
              id="badge-watchlist-count"
              className="text-xs sm:text-sm font-semibold font-mono px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-200"
            >
              관심종목 {stockCount} / {maxStocks}
            </span>

            {/* Watchlist Edit Button */}
            <button
              id="btn-edit-watchlist"
              onClick={onOpenEditModal}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 border border-slate-700 hover:border-slate-600 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Settings className="w-3.5 h-3.5 text-slate-400" />
              <span>관심종목 편집</span>
            </button>
          </div>
        </div>

        {/* Right: Real-time Toggle, Threshold Selector & Primary Action */}
        <div className="flex items-center gap-2.5 w-full md:w-auto justify-end flex-wrap sm:flex-nowrap">
          {/* Real-time Toggle & Frequency Pill */}
          <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-lg border border-slate-800 text-xs">
            <button
              id="btn-toggle-realtime"
              onClick={onToggleRealtime}
              title={isRealtimeActive ? '실시간 갱신 일시정지' : '실시간 갱신 재개'}
              className={`px-2.5 py-1 rounded flex items-center gap-1.5 font-semibold transition-all cursor-pointer ${
                isRealtimeActive
                  ? 'bg-emerald-950/70 border border-emerald-800/80 text-emerald-300 shadow-xs'
                  : 'bg-slate-800/60 text-slate-400 hover:text-slate-200'
              }`}
            >
              {isRealtimeActive ? (
                <>
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="font-mono">실시간 ON</span>
                  {isLiveUpdating && (
                    <RefreshCw className="w-3 h-3 animate-spin text-emerald-400 shrink-0 ml-0.5" />
                  )}
                </>
              ) : (
                <>
                  <Pause className="w-3 h-3 text-slate-400" />
                  <span>일시정지</span>
                </>
              )}
            </button>

            {/* Cycle Interval Button */}
            {isRealtimeActive && (
              <button
                id="btn-cycle-interval"
                onClick={() => {
                  const nextInterval =
                    realtimeInterval === 3000 ? 5000 : realtimeInterval === 5000 ? 10000 : 3000;
                  onChangeInterval(nextInterval);
                }}
                title="갱신 주기 변경 (3초 / 5초 / 10초)"
                className="px-2 py-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 font-mono text-[11px] transition-colors cursor-pointer"
              >
                {intervalSeconds}초마다
              </button>
            )}
          </div>

          {/* Threshold Selector: 기준 변동률 ±4% */}
          <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-lg border border-slate-800">
            <span className="text-xs font-semibold text-slate-400 pl-2 pr-1 hidden sm:inline">
              기준:
            </span>
            <div className="flex items-center gap-1">
              {quickThresholds.map((val) => {
                const isSelected = threshold === val;
                return (
                  <button
                    key={val}
                    id={`btn-threshold-${val}`}
                    onClick={() => onChangeThreshold(val)}
                    disabled={isAnalyzing}
                    className={`px-2 py-1 rounded text-xs font-mono font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                    }`}
                  >
                    ±{val}%
                  </button>
                );
              })}
            </div>
          </div>

          {/* Primary Action Button: "관심종목 분석" */}
          <button
            id="btn-analyze-watchlist"
            onClick={onAnalyze}
            disabled={isAnalyzing || stockCount === 0}
            className="w-full sm:w-auto px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:cursor-not-allowed disabled:shadow-none shrink-0"
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-indigo-300" />
                <span>분석 중...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                <span>관심종목 분석</span>
              </>
            )}
          </button>
        </div>
      </div>

      {lastUpdated && (
        <div className="bg-slate-950/50 border-t border-slate-800/60 px-4 sm:px-6 py-1 text-[11px] text-slate-400 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-emerald-400" />
            <span>분석 기준: 전일 종가 대비 ±{threshold}% 이상 급등락 종목 필터링</span>
            <span className="text-slate-600 hidden md:inline">|</span>
            <span className="text-slate-400 hidden md:inline">
              캐시 기반 API 호출 최적화 (Gemini Rate Limit 안전 보호)
            </span>
          </div>
          <div className="flex items-center gap-2 font-mono text-slate-400">
            {isRealtimeActive && (
              <span className="flex items-center gap-1 text-emerald-400">
                <Radio className="w-3 h-3 animate-pulse" />
                <span>실시간 수신 중 ({intervalSeconds}s)</span>
              </span>
            )}
            <span>최근 시세 갱신: {lastUpdated}</span>
          </div>
        </div>
      )}
    </header>
  );
};
