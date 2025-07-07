import React from "react";
import type { SizeTokens } from "tamagui";
import { Button, Form, H4, Spinner, View, YStack } from "tamagui";
import { FormProvider, useForm } from "react-hook-form";
import { YStackTheme } from "components/Layout/Flexbox/StackTheme";

export function FormComponent({
  size,
  textHeaderForm,
  children,
  callbackSubmit
}: {
  size: SizeTokens;
  textHeaderForm?: string;
  children: React.ReactNode;
  callbackSubmit: (data: any) => void;
}) {
  const [status, setStatus] = React.useState<"off" | "submitting" | "submitted">("off");

  const methods = useForm();

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
      <YStackTheme width={"80%"}>
        <Form
          width={"100%"}
          justify={"center"}
          alignItems={"center"}
          minWidth={300}
          gap="$2"
          borderWidth={1}
          borderRadius="$4"
          backgroundColor="$background"
          borderColor="$borderColor"
          padding="$8"
        >
          <H4>{textHeaderForm}</H4>
          <YStack width={"100%"} gap={"$12"}>
            {children}
            <Form.Trigger asChild disabled={status !== "off"}>
              <Button
                onPress={methods.handleSubmit(onSubmit)}
                icon={status === "submitting" ? () => <Spinner /> : undefined}
              >
                Submit
              </Button>
            </Form.Trigger>
          </YStack>
        </Form>
      </YStackTheme>
    </FormProvider>
  );
}
