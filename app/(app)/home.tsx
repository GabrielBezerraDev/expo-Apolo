import React, { useCallback, useRef, useState } from "react";
// ... outras importações
import * as ImageManipulator from "expo-image-manipulator";
import { CameraView, useCameraPermissions } from "expo-camera";
import TextRecognition from "@react-native-ml-kit/text-recognition";
import { Button, Text, View } from "tamagui";
import { Alert, StyleSheet, Dimensions } from "react-native";
import { YStackTheme } from "components/Layout/Flexbox/StackTheme";
import { ListItems } from "components/ListItems";
import { ButtonTheme } from "components/Button";
import { CirclePlus, X, Camera as CameraIcon } from "@tamagui/lucide-icons";
import axios from "axios";

// ... (seu componente ListItems, ButtonTheme, etc.)
const fetchPalletInfoWithAxios = async (palletNumber) => {
  const url = "http://172.21.70.100:7070/rest-secure.php";
  const token = "9caf0025-fd18-43ee-9b06-38284c3085cc";

  Alert.alert("Pallet Pego: ", palletNumber);

  const bodyData = {
    class: "GetPalletInfo",
    method: "GetPallet",
    pallet: palletNumber b,
  };

  // try {
  // Usamos a forma genérica do axios para poder enviar 'data' (body) com um método 'get'
  const response = await axios({
    method: "POST", // Especificando o método GET
    url: url,
    headers: {
      Authorization: `Basic ${token}`,
      "Content-Type": "application/json",
    },
    data: bodyData, // A propriedade 'data' se torna o corpo (body) da requisição
    timeout: 15000, // Opcional: um timeout para a requisição
  });

  // SUCESSO: axios já converte a resposta para JSON automaticamente
  console.log("Resposta da API (com axios):", response.data);

  // IMPORTANTE: Alert.alert espera uma string. Se 'response.data' for um objeto,
  // ele mostrará "[object Object]". Usamos JSON.stringify para ver os dados.
  Alert.alert(
    "Dados Recebidos",
    JSON.stringify(response.data, null, 2) // O 2º e 3º parâmetros formatam o JSON para ficar legível
  );
  // } catch (error) {
  //   // ERRO: axios lança um erro para status de resposta fora da faixa 2xx
  //   console.error("Erro na requisição com axios:", error);

  //   if (error.response) {
  //     // O servidor respondeu com um status de erro (4xx, 5xx)
  //     Alert.alert(
  //       `Erro do Servidor: ${error.response.status}`,
  //       `Dados: ${JSON.stringify(error.response.data)}`
  //     );
  //   } else if (error.request) {
  //     // A requisição foi feita mas não houve resposta (ex: Network Error, timeout)
  //     Alert.alert(
  //       "Erro de Rede",
  //       "Não foi possível conectar à API. Verifique a rede e o endereço."
  //     );
  //   } else {
  //     // Um erro ocorreu ao configurar a requisição
  //     Alert.alert("Erro de Configuração", error.message);
  //   }
  // }
};

export default function Home() {
  const [permission, requestPermission] = useCameraPermissions();
  const [showCamera, setShowCamera] = useState(false);
  const cameraRef = useRef<CameraView | null>(null);
  const overlayLayout = useRef(null); // Para guardar as medidas do overlay

  // ... (suas funções fetchPalletInfo e processPalletData) ...

  const handleTakePicture = useCallback(async () => {
    console.log("TESTE: ",cameraRef.current, overlayLayout.current);
    if (!cameraRef.current || !overlayLayout.current) {
      console.log("Referência da câmera ou layout do overlay não encontrados.");
      Alert.alert("Erro", "Aguarde a câmera inicializar completamente.");
      return;
    }

    // const handleOpenScanner = async () => {
    //   // Se a permissão já foi concedida, apenas abre a câmera.
    //   if (permission?.granted) {
    //     setShowCamera(true);
    //     return;
    //   }

    //   // Se a permissão pode ser solicitada novamente, solicita.
    //   const permissionResponse = await requestPermission();
    //   if (permissionResponse.granted) {
    //     setShowCamera(true);
    //   } else {
    //     Alert.alert(
    //       "Permissão Negada",
    //       "Você precisa conceder permissão à câmera para usar esta funcionalidade."
    //     );
    //   }
    // };

    // try {
    const photo = await cameraRef.current?.takePictureAsync();
    if (!photo?.uri) return;

    const screen = Dimensions.get("window");
    const frame = overlayLayout.current;

    const scaleX = photo.width / screen.width;
    const scaleY = photo.height / screen.height;

    const cropRegion: any = {
      originX: frame.x * scaleX,
      originY: frame.y * scaleY,
      width: frame.width * scaleX,
      height: frame.height * scaleY,
    };

    const croppedPhoto = await ImageManipulator.manipulateAsync(
      photo.uri,
      [{ crop: cropRegion }],
      { compress: 1, format: ImageManipulator.SaveFormat.JPEG }
    );

    const result = await TextRecognition.recognize(croppedPhoto.uri);

    Alert.alert(
      "Texto Extraído da Área",
      result.text || "Nenhum texto foi encontrado na área.",
      [{ text: "OK", onPress: () => setShowCamera(false) }]
    );

    const match = result.text.match(/\d+/);

    let batch: string = (match as RegExpMatchArray)[0] as string;

    if (batch) {
      await fetchPalletInfoWithAxios(batch);
    }
    // } catch (error) {
    //   console.error("Ocorreu um erro no processo de captura e corte:", error);
    //   Alert.alert("Erro", "Não foi possível processar a imagem.");
    // }
  }, []);

  const renderHomeScreen = useCallback(() => {

    if (!permission?.granted) {
      return (
        <YStackTheme flex={1} justify="center" items="center" space>
          <Text >
            Precisamos da sua permissão para usar a câmera.
          </Text>
          <Button onPress={requestPermission}>Conceder Permissão</Button>
        </YStackTheme>
      );
    }

    return showCamera ? (
      <View style={styles.container}>
        <CameraView ref={cameraRef} style={styles.camera} facing={"back"}>
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
            t={"5%"} // Use porcentagem ou valores fixos para melhor posicionamento
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
      <YStackTheme flex={1} p="$4">
        <ListItems />
        <ButtonTheme
          iconAfter={<CirclePlus />}
          onPress={() => setShowCamera(true)}
        >
          Nova Saída De Material
        </ButtonTheme>
      </YStackTheme>
    );
  }, [showCamera, permission]);

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
    width: "50%", // Usar porcentagem pode ser mais adaptável
    height: 80,
    borderColor: "white",
    borderWidth: 2,
    borderRadius: 20,
    borderStyle: "dashed", // Estilo para ficar mais claro que é um scanner
  },
});
