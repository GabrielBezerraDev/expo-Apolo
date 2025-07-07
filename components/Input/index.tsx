import { Controller, useFormContext } from "react-hook-form";
import { Input, XStack, YStack, styled, Button } from "tamagui";
import { CircleX } from "@tamagui/lucide-icons";
import LabelComponent from "components/Label";
import { XStackTheme, YStackTheme } from "components/Layout/Flexbox/StackTheme";

export const InputCustom = styled(Input, {});
const ButtonICon = styled(Button, {
  color: "white",
  bg: "#f0052c",
  flex: 1,
  rounded: "$0",
});

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
          )}
        />
        <ButtonICon
          height={props.size ?? "$6"}
          icon={<CircleX size="$1" />}
          onPress={() => setValue(props.nameInput,"")}
        />
      </XStackTheme>
    </YStackTheme>
  );
}
