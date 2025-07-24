import { ButtonTheme } from "components/Button";
import { FormComponent } from "components/Form";
import InputComponent from "components/Input";
import InputDialog from "components/InputDialog";
import { XStackTheme, YStackTheme } from "components/Layout/Flexbox/StackTheme";
import { useState } from "react";
import { ButtonText, Text } from "tamagui";

export default function FormIa() {
  const [quantityInput, setQuantityInput] = useState<number>(0);
  const increaseInputData = () => setQuantityInput((prev) => prev + 1);
  const decreaseInputData = () =>
    setQuantityInput((prev) => (prev > 0 ? prev - 1 : prev));
  return (
    <FormComponent
      callbackSubmit={() => console.log("Teste")}
      textHeaderForm="Cadastro de dados para IA"
      headerForm={
        <YStackTheme rowGap={"$12"} width={"100%"}>
          <InputComponent textLabel="Nome do Campo" nameInput="Nome"></InputComponent>
          <XStackTheme columnGap={"$3"}>
            <ButtonTheme flex={1} onPress={() => increaseInputData()}>
              Adicionar Input Data
            </ButtonTheme>
            <ButtonTheme flex={1} onPress={() => decreaseInputData()}>
              Remover Input Data
            </ButtonTheme>
          </XStackTheme>
        </YStackTheme>
      }
    >
      {Array.from({ length: quantityInput }, (_, index) => (
        <InputDialog
          key={index}
          textLabel={`Campo IA nº ${index + 1}`}
          nameInput={`IA_${index}`}
        />
      ))}
    </FormComponent>
  );
}
