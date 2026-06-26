import { z } from "zod";

export const sortOrderSchema = z.union([z.literal(1), z.literal(-1)]);

export const listParamsSchema = z.object({
  page: z.coerce.number().int().min(0).default(0),
  pageSize: z.coerce.number().int().min(1).max(100).default(15),
  sortField: z.string().optional(),
  sortOrder: z.coerce.number().pipe(sortOrderSchema).optional(),
  filters: z.record(z.string(), z.unknown()).optional(),
});

export type ListParams = z.infer<typeof listParamsSchema>;

export const paginatedSchema = <T extends z.ZodType>(itemSchema: T) =>
  z.object({
    items: z.array(itemSchema),
    total: z.number().int(),
    page: z.number().int(),
    pageSize: z.number().int(),
  });

export type Paginated<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
};

export function paginate<T>(rows: T[], params: ListParams): Paginated<T> {
  const start = params.page * params.pageSize;
  return {
    items: rows.slice(start, start + params.pageSize),
    total: rows.length,
    page: params.page,
    pageSize: params.pageSize,
  };
}
