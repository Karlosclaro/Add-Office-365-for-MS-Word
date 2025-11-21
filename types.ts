export interface TableData {
  title: string;
  headers: string[];
  rows: string[][];
  summary?: string;
}

export enum AppState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}
