/**
 * Gets keys of a nested object including the nested keys
 */
export type NestedKeyOf<ObjectType extends object> = {
  [Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object
    ? `${Key}` | `${Key}.${NestedKeyOf<ObjectType[Key]>}`
    : `${Key}`;
}[keyof ObjectType & (string | number)];

/**
 * Gets only the keys that are not nested
 */
export type LeafKeyOf<ObjectType extends object> = {
  [Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object
    ? `${Key}.${LeafKeyOf<ObjectType[Key]>}`
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

export type TranslationsTypeOf<T extends object> =
  | FlattenedTypeOf<T>
  | NestedTypeOf<T>;

/**
 * Checks if two locales are equal
 */
export type DeepLocaleEqual<T, U> = T extends object
  ? U extends object
    ? {
        [K in keyof T]: K extends keyof U ? DeepLocaleEqual<T[K], U[K]> : never;
      } extends { [K in keyof T]: infer R }
      ? R extends never
        ? false
        : {
              [K in keyof U]: K extends keyof T
                ? DeepLocaleEqual<U[K], T[K]>
                : never;
            } extends { [K in keyof U]: infer R2 }
          ? R2 extends never
            ? false
            : true
          : false
      : false
    : false
  : T extends U
    ? U extends T
      ? true
      : false
    : false;

/**
 * Asserts that two locales are equal
 */
export type AssertLocaleEqual<T extends TranslationsTypeOf<object>, U> =
  DeepLocaleEqual<T, U> extends true ? U : never;
