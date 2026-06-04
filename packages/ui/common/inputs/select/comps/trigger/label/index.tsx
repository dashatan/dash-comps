import { SimpleLabel } from "@/components/common/inputs/select/comps/trigger/label/simple-label";
import { FloatLabel } from "@/components/common/inputs/select/comps/trigger/label/float-label";
import { LabelType } from "@/components/common/inputs/select/comps/trigger/label/label-type";
import { CountType } from "@/components/common/inputs/select/comps/trigger/label/count-type";
import {
  LabelProps,
  LabelType as LabelTypeKey,
} from "@/components/common/inputs/select/comps/trigger/label/types";

export function Label(props: LabelProps) {
  const { labelType, ...rest } = props;

  const labels: Record<LabelTypeKey, React.ReactElement> = {
    simple: <SimpleLabel {...rest} />,
    float: <FloatLabel {...props} />,
    count: <CountType {...rest} />,
    label: <LabelType {...rest} />,
  };

  return labels[labelType as LabelTypeKey] ?? <SimpleLabel {...rest} />;
}
