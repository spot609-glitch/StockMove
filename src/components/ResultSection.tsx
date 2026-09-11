import React from 'react';
import { TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
import { AnalysisStockResult } from '../types';
import { StockRow } from './StockRow';

interface ResultSectionProps {
  surgingStocks: AnalysisStockResult[];
  plungingStocks: AnalysisStockResult[];
  threshold: number;
  totalAnalyzed: number;
  unmovedCount: number;
  onSelectStock: (stock: AnalysisStockResult) => void;
  hasAnalyzed: boolean;
}

export const ResultSection: React.FC<ResultSectionProps> = ({
  surgingStocks,
  plungingStocks,
  threshold,
  totalAnalyzed,
  unmovedCount,
  onSelectStock,
  hasAnalyzed,
}) => {
  if (!hasAnalyzed) {
    return (
      <div className="max-w-4xl mx-auto my-12 p-8 border border-slate-800 bg-slate-900/50 rounded-xl text-center">
        <div className="w-12 h-12 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto mb-4">
          <TrendingUp className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-slate-100 mb-1">
          상단의 “관심종목 분석” 버튼을 눌러주세요
        </h3>
        <p className="text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
          등록된 관심종목의 현재가 및 전일 종가를 실시간 분석하여 전일 대비 ±{threshold}% 이상 급변동한 종목과 그 핵심 원인을 3초 안에 보여드립니다.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Quick Summary Pill Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/60 border border-slate-800 p-3 rounded-lg text-xs font-mono">
        <div className="flex items-center gap-4 text-slate-300">
          <span>
            총 분석 대상: <strong className="text-white font-bold">{totalAnalyzed}</strong>개 종목
          </span>
          <span>·</span>
          <span>
            급등 탐지: <strong className="text-rose-400 font-bold">{surgingStocks.length}</strong>개
          </span>
          <span>·</span>
          <span>
            급락 탐지: <strong className="text-blue-400 font-bold">{plungingStocks.length}</strong>개
          </span>
          <span>·</span>
          <span>
            기준 미만 정상: <strong className="text-slate-400 font-bold">{unmovedCount}</strong>개
          </span>
        </div>
        <div className="text-slate-500 text-[11px]">
          *종목 행을 클릭하면 공시·뉴스 근거 상세 화면이 열립니다.
        </div>
      </div>

      {/* Two Column Layout for Surging & Plunging Stocks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Left: 🔺 급등 종목 (Surging Stocks) */}
        <div
          id="section-surging-stocks"
          className="bg-slate-900/40 border border-rose-950/50 rounded-xl overflow-hidden shadow-lg"
        >
          {/* Section Header */}
          <div className="p-4 bg-rose-950/30 border-b border-rose-900/30 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-md bg-rose-500/20 text-rose-400">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-rose-200 tracking-tight flex items-center gap-1.5">
                  <span>🔺 급등 종목</span>
                  <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300">
                    +{threshold}% 이상
                  </span>
                </h2>
                <div className="text-[11px] text-rose-300/70">
                  전일 종가 대비 급등한 {surgingStocks.length}개 종목
                </div>
              </div>
            </div>

            <span className="font-mono text-xs font-bold text-rose-400 bg-rose-950/60 px-2.5 py-1 rounded-md border border-rose-900/50">
              {surgingStocks.length} 종목
            </span>
          </div>

          {/* Table Header Labels */}
          <div className="px-4 py-2 bg-slate-950/60 border-b border-slate-800/80 text-[11px] font-semibold text-slate-400 flex items-center justify-between">
            <span>종목명 / 코드</span>
            <div className="flex items-center gap-8 pr-5">
              <span>등락률</span>
              <span>핵심 원인 (3단어 이내)</span>
            </div>
          </div>

          {/* List Content */}
          <div className="p-3 space-y-2">
            {surgingStocks.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs">
                <AlertCircle className="w-6 h-6 mx-auto mb-2 text-slate-600" />
                <p className="font-semibold text-slate-400">
                  +{threshold}% 이상 급등한 종목이 없습니다.
                </p>
                <p className="mt-0.5 text-slate-500">
                  설정된 기준 변동률(±{threshold}%)보다 적게 움직인 종목은 제외되었습니다.
                </p>
              </div>
            ) : (
              surgingStocks.map((stock) => (
                <StockRow
                  key={stock.id || stock.code}
                  stock={stock}
                  onClick={() => onSelectStock(stock)}
                />
              ))
            )}
          </div>
        </div>

        {/* Right: 🔻 급락 종목 (Plunging Stocks) */}
        <div
          id="section-plunging-stocks"
          className="bg-slate-900/40 border border-blue-950/50 rounded-xl overflow-hidden shadow-lg"
        >
          {/* Section Header */}
          <div className="p-4 bg-blue-950/30 border-b border-blue-900/30 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-md bg-blue-500/20 text-blue-400">
                <TrendingDown className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-blue-200 tracking-tight flex items-center gap-1.5">
                  <span>🔻 급락 종목</span>
                  <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300">
                    -{threshold}% 이하
                  </span>
                </h2>
                <div className="text-[11px] text-blue-300/70">
                  전일 종가 대비 급락한 {plungingStocks.length}개 종목
                </div>
              </div>
            </div>

            <span className="font-mono text-xs font-bold text-blue-400 bg-blue-950/60 px-2.5 py-1 rounded-md border border-blue-900/50">
              {plungingStocks.length} 종목
            </span>
          </div>

          {/* Table Header Labels */}
          <div className="px-4 py-2 bg-slate-950/60 border-b border-slate-800/80 text-[11px] font-semibold text-slate-400 flex items-center justify-between">
            <span>종목명 / 코드</span>
            <div className="flex items-center gap-8 pr-5">
              <span>등락률</span>
              <span>핵심 원인 (3단어 이내)</span>
            </div>
          </div>

          {/* List Content */}
          <div className="p-3 space-y-2">
            {plungingStocks.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs">
                <AlertCircle className="w-6 h-6 mx-auto mb-2 text-slate-600" />
                <p className="font-semibold text-slate-400">
                  -{threshold}% 이하 급락한 종목이 없습니다.
                </p>
                <p className="mt-0.5 text-slate-500">
                  설정된 기준 변동률(±{threshold}%)보다 적게 움직인 종목은 제외되었습니다.
                </p>
              </div>
            ) : (
              plungingStocks.map((stock) => (
                <StockRow
                  key={stock.id || stock.code}
                  stock={stock}
                  onClick={() => onSelectStock(stock)}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
