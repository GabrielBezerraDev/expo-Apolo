import React, { useCallback } from "react";
import { CameraView } from "expo-camera";
import { Button, Dialog, Text, View } from "tamagui";
import { Alert, StyleSheet } from "react-native";
import { YStackTheme } from "components/Layout/Flexbox/StackTheme";
import { ListItems } from "components/ListItems";
import { ButtonTheme } from "components/Button";
import { CirclePlus, X, Camera as CameraIcon } from "@tamagui/lucide-icons";
import axios from "axios";
import { useCameraScanner } from "hooks/useCameraScanner"; // novo hook
import { DialogComponent } from "components/Dialog";

const fetchPalletInfoWithAxios = async (palletNumber) => {
  const url = "http://172.21.70.100:7070/rest-secure.php";
  const token = "9caf0025-fd18-43ee-9b06-38284c3085cc";

  Alert.alert("Pallet Pego: ", palletNumber);

  const bodyData = {
    class: "GetPalletInfo",
    method: "GetPallet",
    pallet: palletNumber,
  };

  const response = await axios({
    method: "POST",
    url: url,
    headers: {
      Authorization: `Basic ${token}`,
      "Content-Type": "application/json",
    },
    data: bodyData,
    timeout: 15000,
  });

  console.log("Resposta da API (com axios):", response.data);

  Alert.alert("Dados Recebidos", JSON.stringify(response.data, null, 2));
};

export default function Home() {
  const {
    permission,
    requestPermission,
    showCamera,
    setShowCamera,
    cameraRef,
    overlayLayout,
    handleTakePicture,
  } = useCameraScanner(async (text) => {
    const match = text.match(/\d+/);
    let batch: string = (match as RegExpMatchArray)?.[0] as string;
    if (batch) {
      await fetchPalletInfoWithAxios(batch);
    }
  });

  const renderHomeScreen = useCallback(() => {
    if (!permission?.granted) {
      return (
        <YStackTheme flex={1} justify="center" items="center" space>
          <Text>Precisamos da sua permissão para usar a câmera.</Text>
          <Button onPress={requestPermission}>Conceder Permissão</Button>
        </YStackTheme>
      );
    }

    return showCamera ? (
      <View style={styles.container}>
        <CameraView ref={cameraRef} style={styles.camera}>
          <View style={styles.overlay}>
            <View
              style={styles.scannerFrame}
              onLayout={(event) => {
                overlayLayout.current = event.nativeEvent.layout;
              }}
            />
            <Text style={{ color: "white", marginTop: 20 }}>
              Posicione o código aqui
            </Text>
          </View>
          <ButtonTheme
            rounded={"$radius.10"}
            elevation={5}
            onPress={() => setShowCamera(!showCamera)}
            icon={<X />}
            circular
            position="absolute"
            t={"5%"}
            r={"5%"}
          />
          <ButtonTheme
            rounded={"$radius.10"}
            elevation={5}
            onPress={handleTakePicture}
            icon={<CameraIcon />}
            circular
            position="absolute"
            b={"5%"}
            alignSelf="center"
          />
        </CameraView>
      </View>
    ) : (
      <DialogComponent
        props={{
          contentDialog: (
            <YStackTheme>
              <Text>Teste</Text>
              <Dialog.Close asChild>
                <ButtonTheme circular icon={<X />} />
              </Dialog.Close>
            </YStackTheme>
          ),
          genericComponentWithDialog: [
            <Dialog.Trigger asChild key="trigger">
              <Button>
                <Button.Text>teste</Button.Text>
              </Button>
            </Dialog.Trigger>,
            <YStackTheme
              key="stack"
              flex={1}
              justify="center"
              items="center"
              space
            >
              <Text>Bem-vindo ao App!</Text>
              <ButtonTheme
                onPress={() => setShowCamera(true)}
                icon={<CirclePlus />}
                circular
              >
                Abrir Câmera
              </ButtonTheme>
            </YStackTheme>,
          ],
        }}
      />
    );
  }, [
    showCamera,
    permission,
    requestPermission,
    handleTakePicture,
    overlayLayout,
    cameraRef,
    setShowCamera,
  ]);

  return renderHomeScreen();
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center" },
  camera: { flex: 1 },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  scannerFrame: {
    width: "50%",
    height: 80,
    borderColor: "white",
    borderWidth: 2,
    borderRadius: 20,
    borderStyle: "dashed",
  },
});
