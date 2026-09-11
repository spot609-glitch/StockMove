import React from 'react';
import {
  X,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  FileText,
  Newspaper,
  Globe,
  Share2,
  Users,
  Building2,
  TrendingUp,
  TrendingDown,
  Info
} from 'lucide-react';
import { AnalysisStockResult, SourceType } from '../types';
import {
  formatStockPrice,
  formatPreviousClose,
  formatChangeAmount,
  formatChangeRate,
} from '../utils/formatters';

interface StockDetailModalProps {
  stock: AnalysisStockResult | null;
  onClose: () => void;
}

export const StockDetailModal: React.FC<StockDetailModalProps> = ({ stock, onClose }) => {
  if (!stock) return null;

  const isSurge = stock.movementType === 'SURGE';
  const isNoIssue = stock.coreReason === '특이사항 없음';

  const getSourceIcon = (type: SourceType) => {
    switch (type) {
      case '공시':
        return <FileText className="w-4 h-4 text-emerald-400" />;
      case '회사 발표':
        return <Building2 className="w-4 h-4 text-cyan-400" />;
      case '국내 뉴스':
      case '산업 뉴스':
        return <Newspaper className="w-4 h-4 text-sky-400" />;
      case '해외 뉴스':
        return <Globe className="w-4 h-4 text-indigo-400" />;
      case '커뮤니티':
        return <Users className="w-4 h-4 text-amber-400" />;
      case 'SNS':
        return <Share2 className="w-4 h-4 text-pink-400" />;
      default:
        return <Newspaper className="w-4 h-4 text-slate-400" />;
    }
  };

  const getReliabilityBadge = () => {
    if (stock.reliability === '높음') {
      return (
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold rounded-md">
          <ShieldCheck className="w-4 h-4" />
          <span>신뢰도: 높음 (공식 공시 / 회사 발표 확인)</span>
        </div>
      );
    }
    if (stock.reliability === '낮음') {
      return (
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold rounded-md">
          <AlertTriangle className="w-4 h-4" />
          <span>신뢰도: 낮음 ({stock.reliabilityNote || '시장 추정 / 미확인 정보'})</span>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold rounded-md">
        <Info className="w-4 h-4 text-slate-400" />
        <span>신뢰도: 보통 (복수 언론 / 산업 뉴스 확인)</span>
      </div>
    );
  };

  return (
    <div
      id="stock-detail-backdrop"
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6"
      onClick={onClose}
    >
      <div
        id="stock-detail-container"
        className="bg-slate-900 border border-slate-750 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-start justify-between gap-4 sticky top-0 bg-slate-900/95 backdrop-blur-xs z-10">
          <div>
            <div className="flex items-center gap-2.5">
              <h3 className="text-xl font-bold text-white tracking-tight">{stock.name}</h3>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                {stock.code}
              </span>
              {stock.market && (
                <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                  {stock.market}
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3 mt-2">
              <div
                className={`flex items-center gap-1 font-mono font-bold text-lg ${
                  isSurge ? 'text-rose-400' : 'text-blue-400'
                }`}
              >
                {isSurge ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                {formatChangeRate(stock.changeRate)}
              </div>
              <div className="text-xs text-slate-400 font-mono flex items-center gap-2 flex-wrap">
                <span>
                  현재가 <strong className="text-slate-100 font-semibold">{formatStockPrice(stock.currentPrice, stock.currency)}</strong>
                </span>
                <span className="text-slate-500">·</span>
                <span className="text-slate-400">
                  {formatPreviousClose(stock.previousClose, stock.currency)}
                </span>
                <span className="text-slate-500">·</span>
                <span className={stock.changeAmount >= 0 ? 'text-rose-400 font-medium' : 'text-blue-400 font-medium'}>
                  전일비 {formatChangeAmount(stock.changeAmount, stock.currency)}
                </span>
              </div>
            </div>
          </div>

          <button
            id="btn-close-detail-modal"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-6">
          {/* Core Reason Hero Box */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-4">
            <div className="text-xs font-medium text-slate-400 mb-1">핵심 원인 (3단어 이내)</div>
            <div className="flex items-center justify-between flex-wrap gap-2 mt-1">
              <div
                className={`text-2xl font-bold tracking-tight ${
                  isNoIssue
                    ? 'text-slate-400'
                    : isSurge
                    ? 'text-rose-300'
                    : 'text-blue-300'
                }`}
              >
                “{stock.coreReason}”
              </div>
              <div>{getReliabilityBadge()}</div>
            </div>
            {isNoIssue && (
              <p className="text-xs text-slate-400 mt-2 bg-slate-900/80 p-2 rounded border border-slate-800">
                관련 DART 공시, 주요 경제 뉴스, 커뮤니티에서 명확한 특이 이슈가 확인되지 않았습니다. AI 추측 없이 객관적 사실만을 전달합니다.
              </p>
            )}
          </div>

          {/* Detailed Analysis Section (2~4 sentences) */}
          <div>
            <h4 className="text-xs uppercase tracking-wider font-bold text-slate-400 mb-2 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-indigo-400" />
              상세 분석
            </h4>
            <div className="text-slate-200 text-sm leading-relaxed bg-slate-800/40 p-3.5 rounded-lg border border-slate-800">
              {stock.detailedAnalysis}
            </div>
          </div>

          {/* Evidence Sources */}
          <div>
            <h4 className="text-xs uppercase tracking-wider font-bold text-slate-400 mb-2.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Newspaper className="w-4 h-4 text-sky-400" />
                원인 근거 및 출처 ({stock.evidenceSources.length})
              </span>
              <span className="text-[11px] text-slate-500 font-normal">
                공시 · 언론보도 · 산업뉴스 · 시장정보
              </span>
            </h4>

            <div className="space-y-2">
              {stock.evidenceSources.map((evidence, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-slate-950/40 rounded-lg border border-slate-800/80 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                        {getSourceIcon(evidence.type)}
                        {evidence.type}
                      </span>
                      {evidence.sourceName && (
                        <span className="text-xs text-slate-400">{evidence.sourceName}</span>
                      )}
                    </div>

                    {evidence.url && (
                      <a
                        href={evidence.url}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 hover:underline"
                      >
                        <span>원문 보기</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>

                  <div className="text-sm font-medium text-slate-100 mt-1">
                    {evidence.title}
                  </div>
                  {evidence.snippet && (
                    <div className="text-xs text-slate-400 mt-1 line-clamp-2">
                      {evidence.snippet}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Quick Portal Search Links */}
          <div className="pt-2 border-t border-slate-800/80 flex flex-wrap gap-2">
            <a
              id="link-dart-search"
              href={`https://dart.fss.or.kr/dsab007/main.do?textCrpNm=${encodeURIComponent(stock.name)}`}
              target="_blank"
              rel="noreferrer noopener"
              className="text-xs px-3 py-1.5 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5 text-emerald-400" />
              <span>DART 전자공시 확인</span>
              <ExternalLink className="w-3 h-3 text-slate-500" />
            </a>
            <a
              id="link-naver-finance"
              href={`https://finance.naver.com/item/main.naver?code=${stock.code}`}
              target="_blank"
              rel="noreferrer noopener"
              className="text-xs px-3 py-1.5 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors flex items-center gap-1.5"
            >
              <Globe className="w-3.5 h-3.5 text-sky-400" />
              <span>네이버 증권 종목홈</span>
              <ExternalLink className="w-3 h-3 text-slate-500" />
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/90 flex justify-end">
          <button
            id="btn-close-modal-bottom"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium transition-colors cursor-pointer"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
