import {
  VuxTemplateComponentEmits,
  VuxTemplateComponentProps,
} from "~/mm_ui_kit/src/vux/types/vuxTemplateComponent";
import { VuxModel } from "~/mm_ui_kit/src/vux/types/useVuxModelType";
import { ModelRef, Ref } from "vue";
import { asVuxMetadata } from "~/mm_ui_kit/src/vux/types/useVuxMetadataType";
import { copyToClipboard } from "~/mm_ui_kit/src/helpers/copyToClipboard";

export function useVuxInputActions(
  props: VuxTemplateComponentProps,
  emit: VuxTemplateComponentEmits,
  model: ModelRef<VuxModel>,
) {
  const dataFieldMetadata = asVuxMetadata(props.metaData, props.dataFieldName);

  const onHandleActionCopy = () => {
    copyToClipboard(model.value[props.dataFieldName] as string);
    dataFieldMetadata.actions.copy.status.pressed = true;
    setTimeout(() => {
      dataFieldMetadata.actions.copy.status.pressed = false;
    }, 1000);
  };

  const onHandleActionReveal = (isSecretValueRevealed: Ref<boolean>) => {
    dataFieldMetadata.actions.reveal.status.pressed =
      !dataFieldMetadata.actions.reveal.status.pressed;

    isSecretValueRevealed.value = !isSecretValueRevealed.value;

    dataFieldMetadata.actions.reveal.style = dataFieldMetadata.actions.reveal
      .status.pressed
      ? "hide"
      : "reveal";
  };

  return {
    onHandleActionCopy,
    onHandleActionReveal,
  };
}
