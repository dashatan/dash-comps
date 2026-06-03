import { Alert } from "@/components/common/alert";

export function useDataErrorHandler<T>(props?: {
  data?: T;
  isLoading?: boolean;
  isFetching?: boolean;
  isError?: boolean;
  error?: any;
  permitted?: boolean;
}) {
  if (props?.isLoading || props?.isFetching) return <Alert.Loading />;
  if (props?.isError && props?.error?.status === 403) return <Alert.Forbidden />;
  if (!props?.permitted) return <Alert.Forbidden />;
  if (props?.isError) return <Alert.Error message={props?.error?.message} />;
  if (!props?.data) return <Alert.Empty />;
}
