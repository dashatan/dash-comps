import type { FieldErrors, Resolver } from "react-hook-form";
import type { z } from "zod";

export function createZodResolver<TFieldValues extends Record<string, unknown>>(
  schema: z.ZodType<TFieldValues>,
): Resolver<TFieldValues> {
  return async (values) => {
    const result = schema.safeParse(values);

    if (!result.success) {
      const errors: FieldErrors<TFieldValues> = {};

      for (const issue of result.error.issues) {
        const key = issue.path[0];
        if (typeof key !== "string") continue;

        const fieldName = key as keyof TFieldValues & string;
        if (errors[fieldName]) continue;

        errors[fieldName] = {
          type: issue.code,
          message: issue.message,
        } as FieldErrors<TFieldValues>[typeof fieldName];
      }

      return { values: {}, errors };
    }

    return { values: result.data, errors: {} };
  };
}
