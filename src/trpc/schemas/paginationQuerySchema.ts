import { object, number, string, optional } from 'valibot';

export default object({
  page: number(),
  size: number(),
  sort: optional(string()),
  search: optional(string())
});
