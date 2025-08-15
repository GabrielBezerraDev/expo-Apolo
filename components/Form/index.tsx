import React from "react";
import type { SizeTokens } from "tamagui";
import { Form, H4, ScrollView, Spinner, YStack } from "tamagui";
import { FieldValues, FormProvider, UseFormReturn } from "react-hook-form";
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
      <YStackTheme
        flex={occupyAllSpace ? 1 : 0}
        width="100%"
        height="100%"
        maxW="100%"
        maxH="100%"
      >
        <Form
          flex={occupyAllSpace ? 1 : 0}
          width="100%"
          height={occupyAllSpace ? "100%" : "auto"}
          maxW="100%"
          maxH="100%"
          alignSelf="stretch"
          justify="space-between"
          alignItems="center"
          minW={300}
          gap="$2"
          borderWidth={1}
          borderRadius="$4"
          backgroundColor="$background"
          borderColor="$borderColor"
          padding="$8"
        >
          <XStackTheme width="100%" justify="flex-start">
            <H4>{textHeaderForm}</H4>
          </XStackTheme>

          {headerForm && headerForm}

          <ScrollView
            width="100%"
            flex={1}
            maxH="100%"
            contentContainerStyle={{
              flexGrow: 1,
              width: "100%",
            }}
          >
            {children}
          </ScrollView>

          {footerForm && footerForm}

          <Form.Trigger asChild disabled={disabledButton}>
            <ButtonTheme
              width="100%"
              onPress={methods.handleSubmit(onSubmit)}
              icon={status === "submitting" ? () => <Spinner /> : undefined}
              disabled={disabledButton}
              $isDisabled={disabledButton}
            >
              Confirmar Dados
            </ButtonTheme>
          </Form.Trigger>
        </Form>
      </YStackTheme>
    </FormProvider>
  );
}
