export default interface IPaginationQuery {
  page: number;
  size: number;
  sort?: string;
  search?: string;
}
