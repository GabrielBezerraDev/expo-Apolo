import { useColorScheme } from "react-native";
import { TamaguiProvider, type TamaguiProviderProps } from "tamagui";
import { ToastProvider, ToastViewport } from "@tamagui/toast";
import { CurrentToast } from "./CurrentToast";
import { config } from "../tamagui.config";
import { PortalProvider } from "@tamagui/portal";
import { FirebaseProvider } from "hooks/useFirebase";
import ModalProvider from "hooks/useModal";

export function Provider({
  children,
  ...rest
}: Omit<TamaguiProviderProps, "config">) {
  const colorScheme = useColorScheme();

  return (
    <ModalProvider>
      <FirebaseProvider>
        <PortalProvider shouldAddRootHost>
          <TamaguiProvider config={config} defaultTheme="light" {...rest}>
            <PortalProvider shouldAddRootHost>
              <ToastProvider
                swipeDirection="horizontal"
                duration={6000}
                native={[]}
              >
                {children}
                <CurrentToast />
                <ToastViewport top="$8" left={0} right={0} />
              </ToastProvider>
            </PortalProvider>
          </TamaguiProvider>
        </PortalProvider>
      </FirebaseProvider>
    </ModalProvider>
  );
}
