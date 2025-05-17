export default interface IPagedResult<T> {
  items: T[];
  size: number;
  page: number;
  totalPages: number;
  totalCount: number;
}
