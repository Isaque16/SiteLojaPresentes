export default interface IPagedQuery {
  page: number;
  size: number;
  sort?: string;
  search?: string;
}
