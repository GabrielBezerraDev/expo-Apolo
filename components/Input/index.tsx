import { Controller, useFormContext } from "react-hook-form";
import { Input, XStack, YStack, styled, Button } from "tamagui";
import { CircleX } from "@tamagui/lucide-icons";
import LabelComponent from "components/Label";
import { XStackTheme, YStackTheme } from "components/Layout/Flexbox/StackTheme";
import { ButtonTheme } from "components/Button";

export const InputCustom = styled(Input, {});

interface IInputComponentProps {
  textPlaceHolder?: string;
  textLabel?: string;
  clearInput?: boolean;
  size?: any;
  callbackTreatment?: (data: any) => void;
  nameInput: string;
}

export default function InputComponent(props: IInputComponentProps) {
  const { control, setValue } = useFormContext();

  return (
    <YStackTheme gap="$1">
      {props.textLabel && <LabelComponent textLabel={props.textLabel} />}
      <XStackTheme flex={1}>
        <Controller
          name={props.nameInput}
          control={control}
          render={({ field }) => (
            <XStackTheme width={"100%"}>
              <InputCustom
                placeholder={props.textPlaceHolder}
                size={props.size ?? "$6"}
                flex={15}
                rounded="$0"
                onChangeText={(text) => {
                  field.onChange(text);
                  props.callbackTreatment?.(text);
                }}
                value={field.value}
              />
              <ButtonTheme
                height={props.size ?? "$6"}
                icon={<CircleX size="$1" />}
                onPress={() => setValue(props.nameInput, "")}
              />
            </XStackTheme>
          )}
        />
      </XStackTheme>
    </YStackTheme>
  );
}
