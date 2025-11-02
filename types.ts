
export type ReportItemStatus = 'pass' | 'warn' | 'fail';

export interface ReportItem {
  id: string;
  name: string;
  status: ReportItemStatus;
  value: string;
  description: string;
  guidance: string;
}

export interface ReportCategory {
  title: string;
  score: number;
  items: ReportItem[];
}

export interface AnalysisReport {
  [key: string]: ReportCategory;
}
