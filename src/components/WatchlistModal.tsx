import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  X,
  Plus,
  Search,
  Trash2,
  RotateCcw,
  AlertCircle,
  CheckCircle2,
  Building2,
  ArrowRight,
  Check,
  Tag,
  Loader2,
  Sparkles,
} from 'lucide-react';
import { StockItem } from '../types';
import {
  searchStock,
  getBestStockMatch,
  DEFAULT_WATCHLIST,
  StockMasterItem,
} from '../data/stockDatabase';

interface WatchlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  watchlist: StockItem[];
  onAddStock: (stock: Omit<StockItem, 'id'>) => boolean;
  onRemoveStock: (id: string) => void;
  onResetWatchlist: (stocks: StockItem[]) => void;
}

const QUICK_TAGS = [
  { name: '엘앤씨바이오', code: '290650', market: 'KOSDAQ' },
  { name: '산일전기', code: '062040', market: 'KOSPI' },
  { name: '올릭스', code: '226950', market: 'KOSDAQ' },
  { name: '알테오젠', code: '196170', market: 'KOSDAQ' },
  { name: 'HD현대일렉트릭', code: '267260', market: 'KOSPI' },
  { name: '비에이치', code: '090460', market: 'KOSDAQ' },
  { name: 'SK하이닉스', code: '000660', market: 'KOSPI' },
  { name: '삼성전자', code: '005930', market: 'KOSPI' },
  { name: '삼양식품', code: '003230', market: 'KOSPI' },
  { name: '엔비디아', code: 'NVDA', market: 'NASDAQ' },
];

export const WatchlistModal: React.FC<WatchlistModalProps> = ({
  isOpen,
  onClose,
  watchlist,
  onAddStock,
  onRemoveStock,
  onResetWatchlist,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [selectedCustomMarket, setSelectedCustomMarket] = useState<'KOSPI' | 'KOSDAQ' | '기타'>('KOSDAQ');
  const [serverLookup, setServerLookup] = useState<{
    query: string;
    loading: boolean;
    stock: StockMasterItem | null;
  }>({ query: '', loading: false, stock: null });
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 80);
    } else {
      setInputValue('');
      setErrorMessage(null);
      setSuccessToast(null);
      setServerLookup({ query: '', loading: false, stock: null });
    }
  }, [isOpen]);

  const count = watchlist.length;
  const isFull = count >= 50;
  const trimmed = inputValue.trim();

  // Search results & best match for live preview from local database
  const suggestions = useMemo(() => (trimmed ? searchStock(trimmed) : []), [trimmed]);
  const bestMatch = useMemo(() => (trimmed ? getBestStockMatch(trimmed) : null), [trimmed]);

  // Debounced server-side KRX/AI stock lookup if local match is not found
  useEffect(() => {
    if (!trimmed || bestMatch || trimmed.length < 2) {
      setServerLookup({ query: trimmed, loading: false, stock: null });
      return;
    }

    let active = true;
    setServerLookup({ query: trimmed, loading: true, stock: null });

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/lookup-stock?q=${encodeURIComponent(trimmed)}`);
        if (res.ok && active) {
          const data = await res.json();
          if (data.found && data.stock) {
            setServerLookup({
              query: trimmed,
              loading: false,
              stock: {
                name: data.stock.name,
                code: data.stock.code,
                market: data.stock.market,
                sector: data.stock.sector,
              },
            });
            return;
          }
        }
      } catch (err) {
        // silent fail
      }
      if (active) {
        setServerLookup({ query: trimmed, loading: false, stock: null });
      }
    }, 220);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [trimmed, bestMatch]);

  // Combined best match: local exact match first, then server-resolved match
  const activeMatch = useMemo(() => {
    return bestMatch || serverLookup.stock;
  }, [bestMatch, serverLookup.stock]);

  // Check if active match is already added
  const isActiveMatchInWatchlist = useMemo(() => {
    if (!activeMatch) return false;
    return watchlist.some(
      (item) =>
        item.code.toLowerCase() === activeMatch.code.toLowerCase() ||
        item.name.toLowerCase() === activeMatch.name.toLowerCase()
    );
  }, [activeMatch, watchlist]);

  if (!isOpen) return null;

  // Handle adding a verified stock
  const handleAddStockItem = (item: StockMasterItem | Omit<StockItem, 'id'>) => {
    setErrorMessage(null);

    if (isFull) {
      setErrorMessage('최대 50개까지만 등록할 수 있습니다.');
      return;
    }

    const alreadyExists = watchlist.some(
      (w) =>
        w.code.toLowerCase() === item.code.toLowerCase() ||
        w.name.toLowerCase() === item.name.toLowerCase()
    );

    if (alreadyExists) {
      setErrorMessage(`'${item.name}'(${item.code})은(는) 이미 등록되어 있습니다.`);
      return;
    }

    const success = onAddStock({
      name: item.name,
      code: item.code,
      market: item.market,
    });

    if (success) {
      setInputValue('');
      setSuccessToast(`'${item.name}'(${item.code}) 등록 완료!`);
      setTimeout(() => setSuccessToast(null), 2500);
      inputRef.current?.focus();
    } else {
      setErrorMessage('종목 추가에 실패했습니다.');
    }
  };

  // Submit from form (Enter key)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trimmed) return;

    if (activeMatch) {
      handleAddStockItem(activeMatch);
    } else {
      // User entered a custom code or name not immediately matched
      const isKoreanDigits = /^\d{6}$/.test(trimmed);
      const customItem = {
        name: trimmed,
        code: isKoreanDigits ? trimmed : trimmed.toUpperCase(),
        market: isKoreanDigits ? selectedCustomMarket : '기타',
      };
      handleAddStockItem(customItem);
    }
  };

  return (
    <div
      id="watchlist-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="watchlist-modal-container"
        className="bg-slate-900 border border-slate-750 rounded-xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              관심종목 편집
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              종목명이나 종목코드를 입력하면 실시간으로 해당 종목이 미리 보여집니다.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-mono font-bold px-2.5 py-1 rounded-full border ${
                isFull
                  ? 'bg-rose-950/60 text-rose-400 border-rose-800'
                  : 'bg-indigo-950/60 text-indigo-300 border-indigo-800'
              }`}
            >
              관심종목 {count} / 50
            </span>
            <button
              id="btn-close-watchlist-modal"
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Input & Live Preview Section */}
        <div className="p-4 sm:p-5 border-b border-slate-800/80 bg-slate-950/50 space-y-3">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                ref={inputRef}
                id="input-add-stock"
                type="text"
                placeholder="종목명(예: 올릭스, 삼양식품) 또는 코드(226950, 005930)"
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  setErrorMessage(null);
                  setSuccessToast(null);
                }}
                disabled={isFull}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-24 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 disabled:opacity-50"
              />

              {/* Right Inline Indicator inside input */}
              {trimmed && (
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                  {serverLookup.loading ? (
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-indigo-950/80 border border-indigo-800/70 text-indigo-300 flex items-center gap-1">
                      <Loader2 className="w-3 h-3 animate-spin text-indigo-400" />
                      <span>KRX 조회중</span>
                    </span>
                  ) : activeMatch ? (
                    <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-800/70 text-emerald-300 flex items-center gap-1">
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span>{activeMatch.name}</span>
                      <span className="text-[10px] text-emerald-400/80">({activeMatch.market})</span>
                    </span>
                  ) : (
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                      직접 등록
                    </span>
                  )}
                </div>
              )}
            </div>

            <button
              id="btn-add-stock-submit"
              type="submit"
              disabled={isFull || !trimmed}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white rounded-lg text-sm font-bold flex items-center gap-1.5 transition-all shadow-md shadow-indigo-600/20 shrink-0 cursor-pointer disabled:cursor-not-allowed disabled:shadow-none"
            >
              <Plus className="w-4 h-4" />
              <span>추가</span>
            </button>
          </form>

          {/* 🌟 USER REQUEST: PROMINENT LIVE PREVIEW CARD (입력창에 해당 종목을 미리 보여줘서 확인) */}
          {trimmed && (
            <div
              id="live-stock-preview-box"
              className="p-3 bg-slate-900 border border-indigo-500/50 rounded-xl shadow-lg animate-in fade-in duration-150"
            >
              <div className="flex items-center justify-between text-xs text-indigo-400 font-semibold mb-2">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                  <span>실시간 종목 확인 미리보기 (KOSPI·KOSDAQ 자동 감지)</span>
                </span>
                <span className="text-[11px] text-slate-400 font-normal">
                  {activeMatch ? '엔터(Enter)를 누르거나 추가 버튼을 클릭하세요' : '새로운 종목 코드 직접 등록'}
                </span>
              </div>

              {activeMatch ? (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 bg-slate-950/70 p-3 rounded-lg border border-slate-800">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-lg border flex items-center justify-center shrink-0 ${
                        activeMatch.market === 'KOSPI'
                          ? 'bg-blue-950/80 border-blue-800/80 text-blue-300'
                          : activeMatch.market === 'KOSDAQ'
                          ? 'bg-violet-950/80 border-violet-800/80 text-violet-300'
                          : 'bg-emerald-950/80 border-emerald-800/80 text-emerald-300'
                      }`}
                    >
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-base font-bold text-white tracking-tight">
                          {activeMatch.name}
                        </span>
                        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-indigo-300 border border-slate-700">
                          {activeMatch.code}
                        </span>
                        <span
                          className={`text-[11px] font-bold px-1.5 py-0.5 rounded border ${
                            activeMatch.market === 'KOSPI'
                              ? 'bg-blue-950/80 text-blue-300 border-blue-800/80'
                              : activeMatch.market === 'KOSDAQ'
                              ? 'bg-violet-950/80 text-violet-300 border-violet-800/80'
                              : 'bg-emerald-950/80 text-emerald-300 border-emerald-800/80'
                          }`}
                        >
                          {activeMatch.market}
                        </span>
                        {serverLookup.stock && !bestMatch && (
                          <span className="text-[10px] text-amber-300 bg-amber-950/70 border border-amber-800/70 px-1.5 py-0.5 rounded flex items-center gap-1 font-medium">
                            <Sparkles className="w-3 h-3 text-amber-400" />
                            <span>KRX 식별</span>
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
                        {activeMatch.sector && (
                          <span className="text-slate-400 flex items-center gap-1">
                            <Tag className="w-3 h-3 text-slate-500" />
                            {activeMatch.sector}
                          </span>
                        )}
                        <span className="text-slate-600">·</span>
                        <span className="text-slate-400">
                          검색어 '{trimmed}' 일치 종목
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    {isActiveMatchInWatchlist ? (
                      <span className="text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-amber-950/50 text-amber-300 border border-amber-800/60 flex items-center gap-1">
                        <Check className="w-3.5 h-3.5 text-amber-400" />
                        <span>이미 등록된 종목</span>
                      </span>
                    ) : (
                      <button
                        type="button"
                        id="btn-confirm-add-best-match"
                        onClick={() => handleAddStockItem(activeMatch)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm shadow-emerald-900/30"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>이 종목 등록하기 (Enter)</span>
                      </button>
                    )}
                  </div>
                </div>
              ) : serverLookup.loading ? (
                <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-950/70 border border-indigo-500/30 text-xs text-indigo-300">
                  <Loader2 className="w-4 h-4 animate-spin text-indigo-400 shrink-0" />
                  <div>
                    <div className="font-semibold text-slate-200">한국거래소(KOSPI·KOSDAQ) 등록 정보 조회 중...</div>
                    <div className="text-[11px] text-slate-400">'{trimmed}' 종목 코드 및 시장 구분을 자동으로 식별하고 있습니다.</div>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800 space-y-2.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white tracking-tight">{trimmed}</span>
                      <span className="text-xs text-slate-400 font-mono">
                        {/^\d{6}$/.test(trimmed) ? 'KRX 6자리 코드' : '직접 등록'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs">
                      <span className="text-slate-400 text-[11px]">시장 구분:</span>
                      {(['KOSDAQ', 'KOSPI', '기타'] as const).map((m) => (
                        <button
                          key={m}
                          type="button"
                          onClick={() => setSelectedCustomMarket(m)}
                          className={`px-2 py-0.5 rounded text-[11px] font-bold cursor-pointer transition-colors ${
                            selectedCustomMarket === m
                              ? m === 'KOSDAQ'
                                ? 'bg-violet-600 text-white shadow-sm'
                                : m === 'KOSPI'
                                ? 'bg-blue-600 text-white shadow-sm'
                                : 'bg-slate-700 text-white'
                              : 'bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700'
                          }`}
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                    <p className="text-xs text-slate-400">
                      [{selectedCustomMarket}] 시장 종목으로 등록합니다.
                    </p>
                    <button
                      type="button"
                      id="btn-confirm-add-custom"
                      onClick={() => {
                        const isKoreanDigits = /^\d{6}$/.test(trimmed);
                        handleAddStockItem({
                          name: trimmed,
                          code: isKoreanDigits ? trimmed : trimmed.toUpperCase(),
                          market: selectedCustomMarket,
                        });
                      }}
                      className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors shadow-sm"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>[{selectedCustomMarket}] 종목 등록하기 (Enter)</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Sub-results / Autocomplete List if multiple matches */}
              {suggestions.length > 1 && (
                <div className="mt-2.5 pt-2.5 border-t border-slate-800">
                  <div className="text-[11px] text-slate-400 mb-1.5 flex items-center justify-between">
                    <span>기타 관련 검색 결과 ({suggestions.length}개)</span>
                    <span className="text-[10px] text-slate-500">클릭하여 바로 추가</span>
                  </div>
                  <div className="max-h-36 overflow-y-auto divide-y divide-slate-800/60 rounded-lg bg-slate-950/40 border border-slate-800/80">
                    {suggestions.slice(1).map((item) => {
                      const alreadyIn = watchlist.some((w) => w.code === item.code);
                      return (
                        <button
                          key={item.code}
                          type="button"
                          onClick={() => handleAddStockItem(item)}
                          disabled={alreadyIn}
                          className="w-full px-3 py-2 text-left hover:bg-slate-800/70 disabled:opacity-40 disabled:hover:bg-transparent flex items-center justify-between text-xs transition-colors cursor-pointer group"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="font-semibold text-slate-200 group-hover:text-white truncate">
                              {item.name}
                            </span>
                            <span className="text-slate-400 font-mono text-[11px]">
                              {item.code}
                            </span>
                            {item.sector && (
                              <span className="text-[10px] text-slate-500 hidden sm:inline truncate">
                                · {item.sector}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-[10px] text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                              {item.market}
                            </span>
                            {alreadyIn ? (
                              <span className="text-[10px] text-slate-500 font-medium">
                                등록됨
                              </span>
                            ) : (
                              <ArrowRight className="w-3.5 h-3.5 text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Quick Tags (자주 찾는 인기 종목 칩) */}
          {!trimmed && (
            <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
              <span className="text-[11px] text-slate-400 mr-0.5">추천 빠른 추가:</span>
              {QUICK_TAGS.map((tag) => {
                const isAlready = watchlist.some((w) => w.code === tag.code);
                return (
                  <button
                    key={tag.code}
                    type="button"
                    onClick={() => {
                      setInputValue(tag.name);
                      inputRef.current?.focus();
                    }}
                    disabled={isAlready}
                    className={`text-xs px-2 py-1 rounded-md border transition-all cursor-pointer ${
                      isAlready
                        ? 'bg-slate-900 text-slate-600 border-slate-800 cursor-not-allowed'
                        : 'bg-slate-850 hover:bg-slate-800 text-slate-300 hover:text-white border-slate-750 hover:border-indigo-500/50'
                    }`}
                  >
                    <span>{tag.name}</span>
                    <span className="text-[10px] font-mono text-slate-500 ml-1">
                      {tag.code}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div className="flex items-center gap-1.5 text-xs text-rose-400 bg-rose-950/40 p-2 rounded-lg border border-rose-900/50">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Success Toast */}
          {successToast && (
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-950/40 p-2 rounded-lg border border-emerald-900/50 animate-in fade-in duration-150">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successToast}</span>
            </div>
          )}
        </div>

        {/* Watchlist Items Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-2 min-h-[240px]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-300">
              현재 등록된 관심종목 ({watchlist.length}개)
            </span>
            <span className="text-[11px] text-slate-500">
              삭제 버튼(휴지통)을 누르면 즉시 제외됩니다
            </span>
          </div>

          {watchlist.length === 0 ? (
            <div className="h-44 flex flex-col items-center justify-center text-slate-500 text-xs text-center border border-dashed border-slate-800 rounded-xl">
              <AlertCircle className="w-8 h-8 text-slate-600 mb-2" />
              <p className="font-medium text-slate-400">등록된 관심종목이 없습니다.</p>
              <p className="mt-1">
                위 검색창에 '올릭스' 또는 코드를 입력하여 미리보기를 확인하고 등록하세요.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {watchlist.map((item, idx) => (
                <div
                  key={item.id || item.code}
                  className="flex items-center justify-between p-2.5 bg-slate-950/60 hover:bg-slate-800/70 border border-slate-800/90 rounded-lg group transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-xs text-slate-500 font-mono w-5 shrink-0">
                      {(idx + 1).toString().padStart(2, '0')}
                    </span>
                    <div className="truncate">
                      <div className="text-sm font-semibold text-slate-200 truncate group-hover:text-white">
                        {item.name}
                      </div>
                      <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
                        <span>{item.code}</span>
                        {item.market && (
                          <span className="text-[10px] text-slate-500 bg-slate-900 px-1 py-0.2 rounded border border-slate-800">
                            {item.market}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    id={`btn-delete-stock-${item.code}`}
                    onClick={() => onRemoveStock(item.id)}
                    title="관심종목 삭제"
                    className="text-slate-500 hover:text-rose-400 p-1.5 rounded hover:bg-rose-950/40 transition-colors cursor-pointer shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer & Quick Actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/90 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button
              id="btn-load-defaults"
              onClick={() => onResetWatchlist(DEFAULT_WATCHLIST)}
              className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1.5 px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer font-medium"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>기본 15종목 복원 (올릭스 포함)</span>
            </button>
            {watchlist.length > 0 && (
              <button
                id="btn-clear-all"
                onClick={() => onResetWatchlist([])}
                className="text-xs text-slate-400 hover:text-rose-400 px-2.5 py-1.5 rounded hover:bg-slate-800 transition-colors cursor-pointer"
              >
                전체 삭제
              </button>
            )}
          </div>

          <button
            id="btn-save-watchlist"
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/25 cursor-pointer"
          >
            편집 완료
          </button>
        </div>
      </div>
    </div>
  );
};

