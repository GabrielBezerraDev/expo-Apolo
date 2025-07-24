import { Controller, useFormContext } from "react-hook-form";
import { Input, XStack, YStack, styled, Button, Dialog, Text } from "tamagui";
import { CircleX, List, X } from "@tamagui/lucide-icons";
import LabelComponent from "components/Label";
import { XStackTheme, YStackTheme } from "components/Layout/Flexbox/StackTheme";
import { ButtonTheme } from "components/Button";
import { DialogComponent } from "components/Dialog";

export const InputCustom = styled(Input, {});

interface IInputDialogProps {
  textPlaceHolder?: string;
  textLabel?: string;
  clearInput?: boolean;
  size?: any;
  callbackTreatment?: (data: any) => void;
  nameInput: string;
}

export default function InputDialog(props: IInputDialogProps) {
  const { control, setValue } = useFormContext();

  return (
    <DialogComponent
      props={{
        genericComponentWithDialog: (
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
                    <Dialog.Trigger asChild>
                      <ButtonTheme height={props.size ?? "$6"} icon={<List size="$1" />}></ButtonTheme>
                    </Dialog.Trigger>
                  </XStackTheme>
                )}
              />
            </XStackTheme>
          </YStackTheme>
        ),
        contentDialog: (
          <YStackTheme>
            <Text>Meu OVO</Text>
            <Dialog.Close asChild>
              <ButtonTheme circular icon={<X />} />
            </Dialog.Close>
          </YStackTheme>
        ),
      }}
    ></DialogComponent>
  );
}
