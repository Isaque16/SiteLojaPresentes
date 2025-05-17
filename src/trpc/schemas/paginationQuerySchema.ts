import { z } from 'zod';

export default z.object({
  page: z.number().default(1),
  size: z.number().default(10),
  sort: z.string().optional(),
  search: z.string().optional()
});
