import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { CameraView } from "expo-camera";
import { Button, Dialog, Text, View } from "tamagui";
import { Alert, StyleSheet } from "react-native";
import { YStackTheme } from "components/Layout/Flexbox/StackTheme";
import { ButtonTheme } from "components/Button";
import { CirclePlus, X, Camera as CameraIcon } from "@tamagui/lucide-icons";
import axios from "axios";
import { useCameraScanner } from "hooks/useCameraScanner";
import { DialogComponent } from "components/Dialog";
import { SelectComponent } from "components/Select";
import { useFirebase } from "hooks/useFirebase";
import { IModelData, IModelDataItem } from "protocol/interfaces/IModelData";
import { ECollections } from "protocol/Enum/ECollections";

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

  const [modelsData, setModelsData] = useState<IModelData[]>([]);
  const [modelData, setModelData] = useState<IModelData>();
  const [promptDataIA, setPromptDataIA] = useState<string>();

  const { getAll, setCurrentCollection, currentCollection } = useFirebase();

  useEffect(() => {
    setCurrentCollection(ECollections["ModelData"]);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getAll<IModelData>();
      setModelsData(data);
      setModelData(data[0]);
    };
    fetchData();
  }, [currentCollection]);

  useEffect(() => {
    let promptIA: string = `I will give you a document for you to OCR and I will describe to you what data I want you to capture from that document:\n\n ${modelData?.modelDataList
      .map(
        (modelItem: IModelDataItem) =>
          `Search by: ${modelItem.keyData}\n data description: ${
            modelItem.description
              ? modelItem.description
              : "No details for this data"
          }\n The key for this data must be exactly this: ${modelItem.keyData}`
      )
      .join(
        "\n\n"
      )}\n\nI want you to return this data to me in an object without nesting, just key value in the data.`;
    console.log(promptIA);
    setPromptDataIA(promptIA);
  }, [modelData]);

  const lastScanned = useRef<string | null>(null);
  const [scannedValue, setScannedValue] = useState<string>("");

  const handleBarcodeScanned = ({ data, type, bounds }) => {
    const { x, y, width, height } = overlayLayout.current;
    const centerX = bounds.origin.x + bounds.size.width / 2;
    const centerY = bounds.origin.y + bounds.size.height / 2;
    setScannedValue(data); // Mostra em tempo real
  };

  const renderSelect = useCallback(() => {
    if (modelsData.length > 0) {
      return (
        <SelectComponent<IModelData>
          keyFilter="modelName"
          item={modelData as IModelData}
          setItem={setModelData as Dispatch<SetStateAction<IModelData>>}
          items={modelsData as IModelData[]}
          selectItems={modelsData.map(
            (modelData: IModelData, index: number) => ({
              id: index,
              name: modelData.modelName,
            })
          )}
        />
      );
    }
    return null;
  }, [modelsData, modelData]);

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
        <CameraView
          onBarcodeScanned={handleBarcodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: [
              "qr",
              "code128",
              "code39",
              "ean13",
              "ean8",
              "upc_a",
              "upc_e",
              "itf14",
              "codabar",
            ],
          }}
          ref={cameraRef}
          style={styles.camera}
        >
          {/* Caixa de texto no topo mostrando o dado em tempo real */}
          <View style={styles.topBox}>
            <Text style={styles.topBoxText}>
              {scannedValue
                ? `Lendo: ${scannedValue}`
                : "Aguardando leitura..."}
            </Text>
          </View>
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
            onPress={() => handleTakePicture(promptDataIA as string)}
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
            <YStackTheme rowGap={"$5"}>
              <Text fontSize={"$5"}>Selecione o modelo dos dados:</Text>
              {renderSelect()}
              <ButtonTheme onPress={() => setShowCamera(!showCamera)}>
                Acessar Câmera
              </ButtonTheme>
            </YStackTheme>
          ),
          titleModal: "Cadastro IA",
          genericComponentWithDialog: (
            <>
              <YStackTheme
                width={"100%"}
                key="stack"
                flex={1}
                justify="center"
                items="center"
              >
                <Text>Bem-vindo ao App!</Text>
              </YStackTheme>
              <Dialog.Trigger asChild key="trigger">
                <ButtonTheme icon={<CirclePlus />} width={"100%"}>
                  Abrir Câmera
                </ButtonTheme>
              </Dialog.Trigger>
            </>
          ),
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
    scannedValue,
    modelsData,
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
    width: "80%",
    height: 200,
    borderColor: "white",
    borderWidth: 2,
    borderRadius: 20,
    borderStyle: "dashed",
  },
  topBox: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.7)",
    padding: 12,
    alignItems: "center",
    zIndex: 10,
  },
  topBoxText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
