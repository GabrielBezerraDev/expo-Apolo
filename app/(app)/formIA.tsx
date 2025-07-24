import { X } from "@tamagui/lucide-icons";
import { ButtonTheme } from "components/Button";
import { FormComponent } from "components/Form";
import HorizontalRow from "components/HorizontalRow";
import InputComponent from "components/Input";
import { XStackTheme, YStackTheme } from "components/Layout/Flexbox/StackTheme";
import TextAreaComponent from "components/TextArea";
import { useFirebase } from "hooks/useFirebase";
import { IModelDataItem } from "protocol/IModelData";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Alert } from "react-native";
import { Text } from "tamagui";



export default function FormIa() {
  const methods = useForm();
  const [dataToIA, setDataToIA] = useState<IModelDataItem[]>([]);
  const removeDataIA = (keyData: string) => {
    setDataToIA((prevData: IModelDataItem[]) =>
      prevData.filter((data: IModelDataItem) => data.keyData !== keyData)
    );
  };
  const { createPost } = useFirebase();
  return (
    <FormComponent
      methods={methods}
      callbackSubmit={() => {
        createPost({
          modelName: methods.getValues("model"),
          modelDataList: dataToIA
        });
      }}
      textHeaderForm="Cadastro de dados para IA"
      disabledButton={!dataToIA.length}
      headerForm={
        <YStackTheme rowGap={"$3"} width={"100%"}>
          <YStackTheme rowGap={"$10"}>
            <InputComponent
              textLabel="Modelo"
              nameInput="model"
              size={"$4"}
            ></InputComponent>
            <InputComponent
              size={"$4"}
              textLabel="Nome do Campo"
              nameInput="keyData"
            ></InputComponent>
            <TextAreaComponent
              textLabel="Descrição do dado"
              nameInput="description"
            ></TextAreaComponent>
          </YStackTheme>
          <XStackTheme columnGap={"$3"}>
            <ButtonTheme
              flex={1}
              onPress={() => {
                if (
                  dataToIA.some(
                    (data: IModelDataItem) =>
                      data.keyData === methods.getValues("keyData")
                  )
                ) {
                  Alert.alert("Já existe um campo com esse nome!");
                  return;
                }
                setDataToIA((prevData: IModelDataItem[]) => [
                  ...prevData,
                  {
                    keyData: methods.getValues("keyData"),
                    description: methods.getValues("description"),
                  },
                ]);
              }}
            >
              Adicionar informação
            </ButtonTheme>
          </XStackTheme>
        </YStackTheme>
      }
    >
      <YStackTheme py={"$3"} rowGap={"$6"} height={"100%"}>
        {dataToIA.length > 0 ? (
          dataToIA.map((data: IModelDataItem, index: number) => (
            <YStackTheme key={index} rowGap={"$3"}>
              <ButtonTheme
                rounded={"$radius.10"}
                elevation={5}
                icon={<X />}
                circular
                position="absolute"
                onPress={() => removeDataIA(data.keyData)}
                b={"5%"}
                style={{
                  position: "absolute",
                  zIndex: 10,
                  top: "0%",
                  right: "0%",
                }}
                items="center"
              />
              <YStackTheme>
                <Text fontWeight={"bold"}>Chave do Dado:</Text>
                <Text>{data.keyData}</Text>
              </YStackTheme>
              <YStackTheme>
                <Text fontWeight={"bold"}>Descrição para IA:</Text>
                <Text>{data.description}</Text>
              </YStackTheme>
              <HorizontalRow></HorizontalRow>
            </YStackTheme>
          ))
        ) : (
          <YStackTheme items="center" justify="center">
            <Text>Não há nenhum dado cadastrado!</Text>
          </YStackTheme>
        )}
      </YStackTheme>
    </FormComponent>
  );
}
