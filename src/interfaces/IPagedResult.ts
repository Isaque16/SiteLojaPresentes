export default interface IPagedResult<T> {
  items: T[];
  pagination: {
    size: number;
    page: number;
    totalPages: number;
    totalCount: number;
  };
}
