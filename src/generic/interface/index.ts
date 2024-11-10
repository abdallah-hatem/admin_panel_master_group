export interface Locales<T = any> {
  /** Chinese */
  pt_PT: T;
  /** English */
  en_US: T;
  /** French */
  fr_FR: T;
}

export type Language = keyof Locales;

export interface PageData<T> {
  pageNum: number;
  pageSize: number;
  total: number;
  data: T[];
}
