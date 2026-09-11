import React, { useEffect, useState, useRef } from 'react';
import { ChevronRight, ShieldCheck, AlertTriangle, HelpCircle, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { AnalysisStockResult } from '../types';
import { formatStockPrice, formatPreviousClose } from '../utils/formatters';

interface StockRowProps {
  stock: AnalysisStockResult;
  onClick: () => void;
}

export const StockRow: React.FC<StockRowProps> = ({ stock, onClick }) => {
  const isSurge = stock.movementType === 'SURGE';
  const isNoIssue = stock.coreReason === '특이사항 없음';
  
  // Flash animation state when price ticks
  const [isFlashing, setIsFlashing] = useState<boolean>(false);
  const prevPriceRef = useRef<number>(stock.currentPrice);

  useEffect(() => {
    if (prevPriceRef.current !== stock.currentPrice) {
      prevPriceRef.current = stock.currentPrice;
      setIsFlashing(true);
      const timer = setTimeout(() => setIsFlashing(false), 700);
      return () => clearTimeout(timer);
    }
  }, [stock.currentPrice]);

  const isTickUp = stock.direction === 'UP';
  const isTickDown = stock.direction === 'DOWN';

  return (
    <button
      id={`stock-row-${stock.code}`}
      onClick={onClick}
      className={`w-full text-left p-3.5 bg-slate-900/60 hover:bg-slate-800/80 border rounded-lg transition-all duration-200 flex items-center justify-between group cursor-pointer focus:outline-none focus:ring-1 focus:ring-indigo-500/50 ${
        isFlashing
          ? isTickUp
            ? 'border-emerald-500/50 bg-emerald-950/20'
            : isTickDown
            ? 'border-blue-500/50 bg-blue-950/20'
            : 'border-slate-700'
          : 'border-slate-800/90 hover:border-slate-700'
      }`}
    >
      {/* Left: Stock Name and Code */}
      <div className="flex items-center gap-3 min-w-0 pr-2">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-100 text-base tracking-tight truncate max-w-[130px] sm:max-w-[180px]">
              {stock.name}
            </span>
            <span className="text-xs font-mono text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
              {stock.code}
            </span>
          </div>
          <div className="text-xs mt-0.5 font-mono flex items-center gap-1.5">
            <span
              className={`font-semibold tabular-nums transition-colors duration-200 flex items-center gap-0.5 ${
                isFlashing
                  ? isTickUp
                    ? 'text-emerald-400'
                    : isTickDown
                    ? 'text-cyan-400'
                    : 'text-slate-200'
                  : 'text-slate-300'
              }`}
            >
              {formatStockPrice(stock.currentPrice, stock.currency)}
              {isTickUp && <ArrowUpRight className="w-3 h-3 text-emerald-400 shrink-0 inline" />}
              {isTickDown && <ArrowDownRight className="w-3 h-3 text-cyan-400 shrink-0 inline" />}
            </span>
            <span className="text-slate-500">
              ({formatPreviousClose(stock.previousClose, stock.currency)})
            </span>
          </div>
        </div>
      </div>

      {/* Middle & Right: Change Rate & 3-Word Core Reason */}
      <div className="flex items-center gap-3 sm:gap-4 shrink-0">
        {/* Change Rate */}
        <div
          className={`font-mono font-bold text-base sm:text-lg tabular-nums px-2.5 py-1 rounded transition-colors duration-200 ${
            isSurge
              ? 'text-rose-400 bg-rose-950/40 border border-rose-900/40'
              : 'text-blue-400 bg-blue-950/40 border border-blue-900/40'
          }`}
        >
          {stock.changeRate > 0 ? `+${stock.changeRate.toFixed(1)}%` : `${stock.changeRate.toFixed(1)}%`}
        </div>

        {/* 3-Word Core Reason Badge */}
        <div className="flex items-center gap-1.5 min-w-[110px] sm:min-w-[130px] justify-end">
          <div
            className={`text-xs sm:text-sm font-medium px-2.5 py-1 rounded-md border flex items-center gap-1 text-center ${
              isNoIssue
                ? 'bg-slate-800 text-slate-400 border-slate-700'
                : isSurge
                ? 'bg-rose-500/10 text-rose-300 border-rose-500/20'
                : 'bg-blue-500/10 text-blue-300 border-blue-500/20'
            }`}
          >
            {stock.reliability === '높음' && (
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            )}
            {stock.reliability === '낮음' && (
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            )}
            {stock.reliability === '보통' && (
              <HelpCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            )}
            <span className="truncate max-w-[100px] sm:max-w-[120px] font-medium">
              {stock.coreReason}
            </span>
          </div>

          <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-slate-200 group-hover:translate-x-0.5 transition-all" />
        </div>
      </div>
    </button>
  );
};
