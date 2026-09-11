/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { StockItem, AnalysisStockResult, AnalysisResponse } from './types';
import { DEFAULT_WATCHLIST } from './data/stockDatabase';
import { HeaderBar } from './components/HeaderBar';
import { ResultSection } from './components/ResultSection';
import { WatchlistModal } from './components/WatchlistModal';
import { StockDetailModal } from './components/StockDetailModal';
import { AlertCircle, RefreshCw } from 'lucide-react';

const STORAGE_KEY = 'stock_move_finder_watchlist_v1';

export default function App() {
  // Watchlist state stored in LocalStorage
  const [watchlist, setWatchlist] = useState<StockItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.slice(0, 50);
        }
      }
    } catch (e) {
      console.error('Failed to load watchlist from localStorage:', e);
    }
    return DEFAULT_WATCHLIST;
  });

  // Threshold default: 4% (±4%)
  const [threshold, setThreshold] = useState<number>(4);

  // Analysis results
  const [surgingStocks, setSurgingStocks] = useState<AnalysisStockResult[]>([]);
  const [plungingStocks, setPlungingStocks] = useState<AnalysisStockResult[]>([]);
  const [unmovedCount, setUnmovedCount] = useState<number>(0);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [hasAnalyzed, setHasAnalyzed] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  // Real-time price updates state
  const [isRealtimeActive, setIsRealtimeActive] = useState<boolean>(true);
  const [realtimeInterval, setRealtimeInterval] = useState<number>(3000);
  const [isLiveUpdating, setIsLiveUpdating] = useState<boolean>(false);
  const isPollingRef = useRef<boolean>(false);

  // Modals state
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [selectedStock, setSelectedStock] = useState<AnalysisStockResult | null>(null);

  // Sync watchlist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(watchlist));
    } catch (e) {
      console.error('Failed to save watchlist to localStorage:', e);
    }
  }, [watchlist]);

  // Add stock handler
  const handleAddStock = useCallback(
    (stockData: Omit<StockItem, 'id'>): boolean => {
      if (watchlist.length >= 50) return false;
      const newStock: StockItem = {
        id: `stock_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        ...stockData,
      };
      setWatchlist((prev) => [...prev, newStock]);
      return true;
    },
    [watchlist.length]
  );

  // Remove stock handler
  const handleRemoveStock = useCallback((id: string) => {
    setWatchlist((prev) => prev.filter((item) => item.id !== id));
  }, []);

  // Reset/Replace watchlist
  const handleResetWatchlist = useCallback((stocks: StockItem[]) => {
    setWatchlist(stocks.slice(0, 50));
  }, []);

  // Core execution: "관심종목 분석"
  const handleAnalyze = useCallback(
    async (overrideThreshold?: number) => {
      if (watchlist.length === 0) return;

      const targetThreshold = overrideThreshold !== undefined ? overrideThreshold : threshold;
      setIsAnalyzing(true);
      setAnalysisError(null);

      try {
        const response = await fetch('/api/analyze-watchlist', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            watchlist,
            threshold: targetThreshold,
          }),
        });

        if (!response.ok) {
          let errMsg = `관심종목 분석에 실패했습니다. (상태 코드: ${response.status})`;
          try {
            const contentType = response.headers.get('content-type') || '';
            if (contentType.includes('application/json')) {
              const errData = await response.json();
              if (errData.error) errMsg = errData.error;
            }
          } catch {
            // non-json response body ignore
          }
          throw new Error(errMsg);
        }

        const contentType = response.headers.get('content-type') || '';
        if (!contentType.includes('application/json')) {
          throw new Error('서버가 준비 중이거나 응답 형식(JSON)이 올바르지 않습니다. 잠시 후 다시 시도해주세요.');
        }

        const data: AnalysisResponse = await response.json();
        setSurgingStocks(data.surgingStocks);
        setPlungingStocks(data.plungingStocks);
        setUnmovedCount(data.unmovedCount);
        setLastUpdated(data.timestamp);
        setHasAnalyzed(true);
      } catch (err: any) {
        console.error('Analysis error:', err);
        setAnalysisError(err.message || '분석 중 네트워크 또는 서버 오류가 발생했습니다.');
      } finally {
        setIsAnalyzing(false);
      }
    },
    [watchlist, threshold]
  );

  // Run initial analysis once on mount
  useEffect(() => {
    handleAnalyze();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Lightweight real-time polling loop
  useEffect(() => {
    if (!isRealtimeActive || watchlist.length === 0 || !hasAnalyzed) {
      return;
    }

    let isSubscribed = true;

    const pollRealtimePrices = async () => {
      // Don't poll if tab is in background, or initial full analysis is in flight, or another poll is active
      if (
        document.visibilityState !== 'visible' ||
        isAnalyzing ||
        isPollingRef.current
      ) {
        return;
      }

      isPollingRef.current = true;
      setIsLiveUpdating(true);

      try {
        const response = await fetch('/api/realtime-prices', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            watchlist,
            threshold,
          }),
        });

        if (response.ok && isSubscribed) {
          const contentType = response.headers.get('content-type') || '';
          if (contentType.includes('application/json')) {
            const data: AnalysisResponse = await response.json();
            setSurgingStocks(data.surgingStocks);
            setPlungingStocks(data.plungingStocks);
            setUnmovedCount(data.unmovedCount);
            setLastUpdated(data.timestamp);

            // If a detail modal is open, keep its numbers in sync
            setSelectedStock((current) => {
              if (!current) return null;
              const updated =
                data.surgingStocks.find((s) => s.code === current.code) ||
                data.plungingStocks.find((s) => s.code === current.code);
              return updated || current;
            });
          }
        }
      } catch {
        // Silently skip transient network glitches to preserve UI smoothness
      } finally {
        isPollingRef.current = false;
        if (isSubscribed) {
          setIsLiveUpdating(false);
        }
      }
    };

    const intervalId = setInterval(pollRealtimePrices, realtimeInterval);

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        pollRealtimePrices();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      isSubscribed = false;
      clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isRealtimeActive, realtimeInterval, watchlist, threshold, hasAnalyzed, isAnalyzing]);

  // Handle threshold change
  const handleChangeThreshold = (val: number) => {
    setThreshold(val);
    if (hasAnalyzed) {
      handleAnalyze(val);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-600 selection:text-white">
      {/* Top Header Bar */}
      <HeaderBar
        stockCount={watchlist.length}
        maxStocks={50}
        onOpenEditModal={() => setIsEditModalOpen(true)}
        threshold={threshold}
        onChangeThreshold={handleChangeThreshold}
        onAnalyze={() => handleAnalyze()}
        isAnalyzing={isAnalyzing}
        lastUpdated={lastUpdated}
        isRealtimeActive={isRealtimeActive}
        onToggleRealtime={() => setIsRealtimeActive((prev) => !prev)}
        realtimeInterval={realtimeInterval}
        onChangeInterval={(val) => setRealtimeInterval(val)}
        isLiveUpdating={isLiveUpdating}
      />

      {/* Main Monitoring Screen */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {analysisError && (
          <div className="mb-6 p-4 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-200 text-sm flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
              <span>{analysisError}</span>
            </div>
            <button
              onClick={() => handleAnalyze()}
              className="px-3 py-1 bg-rose-900/60 hover:bg-rose-800 text-xs rounded font-semibold transition-colors cursor-pointer"
            >
              다시 시도
            </button>
          </div>
        )}

        {isAnalyzing && !hasAnalyzed ? (
          <div className="py-24 flex flex-col items-center justify-center text-center">
            <div className="relative mb-4">
              <div className="w-12 h-12 rounded-full border-2 border-indigo-500/20 border-t-indigo-500 animate-spin" />
              <RefreshCw className="w-5 h-5 text-indigo-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">관심종목 {watchlist.length}개 분석 중</h3>
            <p className="text-xs text-slate-400 max-w-sm">
              전일 종가 대비 ±{threshold}% 이상 급변동한 종목을 필터링하고 DART 공시와 경제 뉴스를 조사하고 있습니다...
            </p>
          </div>
        ) : (
          <ResultSection
            surgingStocks={surgingStocks}
            plungingStocks={plungingStocks}
            threshold={threshold}
            totalAnalyzed={watchlist.length}
            unmovedCount={unmovedCount}
            onSelectStock={(stock) => setSelectedStock(stock)}
            hasAnalyzed={hasAnalyzed}
          />
        )}
      </main>

      {/* Watchlist Manager Modal ("관심종목 편집") */}
      <WatchlistModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        watchlist={watchlist}
        onAddStock={handleAddStock}
        onRemoveStock={handleRemoveStock}
        onResetWatchlist={handleResetWatchlist}
      />

      {/* Stock Detail Modal */}
      <StockDetailModal
        stock={selectedStock}
        onClose={() => setSelectedStock(null)}
      />
    </div>
  );
}
