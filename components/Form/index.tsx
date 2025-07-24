import React from "react";
import type { SizeTokens } from "tamagui";
import { Button, Form, H4, ScrollView, Spinner, View, YStack } from "tamagui";
import {
  FieldValues,
  FormProvider,
  useForm,
  UseFormReturn,
} from "react-hook-form";
import { XStackTheme, YStackTheme } from "components/Layout/Flexbox/StackTheme";
import { ButtonTheme } from "components/Button";

export function FormComponent({
  size,
  textHeaderForm,
  children,
  callbackSubmit,
  occupyAllSpace = true,
  headerForm,
  footerForm,
  methods,
  disabledButton = false,
}: {
  methods: UseFormReturn<FieldValues, any, FieldValues>;
  size?: SizeTokens;
  textHeaderForm?: string;
  children: React.ReactNode;
  callbackSubmit: (data: any) => void;
  occupyAllSpace: boolean;
  headerForm?: React.ReactNode;
  footerForm?: React.ReactNode;
  disabledButton: boolean;
}) {
  const [status, setStatus] = React.useState<
    "off" | "submitting" | "submitted"
  >("off");

  const onSubmit = (data: any) => {
    setStatus("submitting");
    callbackSubmit(data);
  };

  React.useEffect(() => {
    if (status === "submitting") {
      const timer = setTimeout(() => setStatus("off"), 2000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  return (
    <FormProvider {...methods}>
      <YStackTheme flex={occupyAllSpace ? 1 : 0}>
        <Form
          flex={occupyAllSpace ? 1 : 0}
          width={"100%"}
          justify={"space-between"}
          items={"center"}
          minW={300}
          gap="$2"
          borderWidth={1}
          rounded="$4"
          bg="$background"
          borderColor="$borderColor"
          p="$8"
        >
          <XStackTheme width={"100%"} justify={"flex-start"}>
            <H4>{textHeaderForm}</H4>
          </XStackTheme>
          {headerForm ?? <></>}
          <ScrollView width={"100%"}>
            <YStack width={"100%"} gap={"$3"}>
              {children}
            </YStack>
          </ScrollView>
          {footerForm ?? <></>}
          <Form.Trigger asChild disabled={status !== "off"}>
            <ButtonTheme
              width={"100%"}
              onPress={methods.handleSubmit(onSubmit)}
              icon={status === "submitting" ? () => <Spinner /> : undefined}
              disabled={disabledButton}
              isDisabled={disabledButton}
            >
              Confirmar Dados
            </ButtonTheme>
          </Form.Trigger>
        </Form>
      </YStackTheme>
    </FormProvider>
  );
}
