export type ReliabilityLevel = '높음' | '보통' | '낮음';

export type SourceType =
  | '공시'
  | '회사 발표'
  | '국내 뉴스'
  | '산업 뉴스'
  | '해외 뉴스'
  | '커뮤니티'
  | 'SNS';

export interface EvidenceSource {
  id?: string;
  type: SourceType;
  title: string;
  snippet: string;
  url?: string;
  date?: string;
  sourceName?: string;
}

export interface StockItem {
  id: string;
  name: string;
  code: string;
  market?: string;
}

export interface StockPriceData {
  name: string;
  code: string;
  currentPrice: number;
  previousClose: number;
  changeRate: number; // percentage, e.g. +6.8 or -4.5
  changeAmount: number;
  currency?: string;
}

export interface AnalysisStockResult extends StockPriceData {
  id: string;
  movementType: 'SURGE' | 'PLUNGE';
  direction?: 'UP' | 'DOWN' | 'FLAT';
  coreReason: string; // Strictly 3 Korean words or less, e.g. "HBM 수요증가", "특이사항 없음"
  detailedAnalysis: string; // 2~4 sentences
  reliability: ReliabilityLevel;
  reliabilityNote?: string; // '공식 공시 확인', '시장 추정', '미확인 정보' etc.
  evidenceSources: EvidenceSource[];
}

export interface PriceTickSummary {
  currentPrice: number;
  previousClose: number;
  changeRate: number;
  changeAmount: number;
  direction: 'UP' | 'DOWN' | 'FLAT';
}

export interface RealtimePricesResponse {
  timestamp: string;
  threshold: number;
  totalAnalyzed: number;
  surgingStocks: AnalysisStockResult[];
  plungingStocks: AnalysisStockResult[];
  unmovedCount: number;
  normalStocks?: AnalysisStockResult[];
  prices: Record<string, PriceTickSummary>;
}

export interface AnalysisResponse {
  timestamp: string;
  threshold: number;
  totalAnalyzed: number;
  surgingStocks: AnalysisStockResult[];
  plungingStocks: AnalysisStockResult[];
  unmovedCount: number;
  normalStocks?: AnalysisStockResult[];
}
