import { Controller, useFormContext, RegisterOptions } from "react-hook-form";
import { Input, styled } from "tamagui";
import { CircleX, Eraser } from "@tamagui/lucide-icons";
import LabelComponent from "components/Label";
import { XStackTheme, YStackTheme } from "components/Layout/Flexbox/StackTheme";
import { ButtonTheme } from "components/Button";

export const InputCustom = styled(Input, {});

export interface IInputComponentProps {
  textPlaceHolder?: string;
  textLabel?: string;
  clearInput?: boolean;
  size?: any;
  readonly?: boolean;
  value?: string;
  rules?: RegisterOptions;
  callbackTreatment?: (data: any) => void;
  nameInput: string;
}

export default function InputComponent(props: IInputComponentProps) {
  const { control, setValue, trigger } = useFormContext();
  
  const handleClearInput = async () => {
    // Define o valor como string vazia
    setValue(props.nameInput, "", {
      shouldValidate: true,    
      shouldDirty: true,       
      shouldTouch: true,       
    });
    
    // Força a revalidação do formulário inteiro (opcional, mas garante consistência)
    await trigger();
    
    // Chama o callback se existir
    props.callbackTreatment?.("");
  };

  return (
    <YStackTheme gap="$1">
      {props.textLabel && <LabelComponent textLabel={props.textLabel} />}
      <XStackTheme flex={1}>
        <Controller
          name={props.nameInput}
          control={control}
          defaultValue={props.value ?? ""} 
          rules={props.rules ?? {}}
          render={({ field }) => (
            <InputCustom
              placeholder={props.textPlaceHolder}
              size={props.size ?? "$6"}
              flex={15}
              rounded="$0"
              onChangeText={(text) => {
                field.onChange(text);
                props.callbackTreatment?.(text);
              }}
              readOnly={props.readonly ?? false}
              value={field.value}
            />
          )}
        />
        <ButtonTheme
          height={props.size ?? "$6"}
          icon={<Eraser size="$1" />}
          onPress={handleClearInput}
        />
      </XStackTheme>
    </YStackTheme>
  );
}