import { IInputComponentProps } from "components/Input";
import LabelComponent from "components/Label";
import { YStackTheme } from "components/Layout/Flexbox/StackTheme";
import { Controller, useFormContext } from "react-hook-form";
import { TextArea } from "tamagui";

export default function TextAreaComponent(props: IInputComponentProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={props.nameInput}
      control={control}
      render={({ field }) => (
        <YStackTheme>
          {props.textLabel && <LabelComponent textLabel={props.textLabel} />}
          <TextArea
            value={field.value}
            onChangeText={field.onChange}  
            onBlur={field.onBlur}         
            size="$1"
            borderWidth={2}
          />
        </YStackTheme>
      )}
    />
  );
}
