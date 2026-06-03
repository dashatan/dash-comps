export type NestedKeyOf<ObjectType extends object> = {
  [Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object
    ? `${Key}` | `${Key}.${NestedKeyOf<ObjectType[Key]>}`
    : `${Key}`;
}[keyof ObjectType & (string | number)];

/**
 * Gets the type of a nested property given its path
 */
export type GetValueType<T, P> = P extends `${infer Key}.${infer Rest}`
  ? Key extends keyof T
    ? T[Key] extends object
      ? GetValueType<T[Key], Rest>
      : never
    : never
  : P extends keyof T
    ? T[P]
    : never;

/**
 * Maps nested keys to their values as string type
 * For example: { "common.home": string, "common.menu": string, ... }
 */
export type FlattenedTypeOf<T extends object> = {
  [P in NestedKeyOf<T>]: GetValueType<T, P>;
};

export type NestedTypeOf<T extends object> = {
  [K in keyof T]: T[K] extends object ? NestedTypeOf<T[K]> : T[K];
};

// Combined type for flexibility in usage
export type TranslationsTypeOf<T extends object> = FlattenedTypeOf<T> | NestedTypeOf<T>;

export type StringObj = Record<string, string>;
export type StringObjArray = Record<string, string[]>;
export type Params = {
  limit?: number;
  offset?: number;
  ordering?: string;
  filters?: Record<string, string | undefined>;
};

export type DivProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;
export type ButtonProps = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;
export type InputProps = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;
export type LabelProps = React.DetailedHTMLProps<
  React.LabelHTMLAttributes<HTMLLabelElement>,
  HTMLLabelElement
>;

export type jwtTokenType = {
  exp: number;
  iat: number;
  jti: string;
  token_type: string;
  user_id: number;
};
