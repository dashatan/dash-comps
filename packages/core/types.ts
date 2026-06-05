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
