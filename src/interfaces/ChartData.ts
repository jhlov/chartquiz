/**
 * 차트 데이터
 */
export default interface ChartData {
  name: string;
  code: string;
  date: string[];
  close: number[];
  add_date: string[];
  add_close: number[];
  start_date: string;
  end_date: string;
}
