import { useRef, useState, useCallback, useEffect } from "react";
import { Alert } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as FileSystem from "expo-file-system";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { router } from "expo-router";
import { useModal } from "./useModal";
import { FormComponent } from "components/Form";
import InputComponent from "components/Input";
import { useForm } from "react-hook-form";
import { useFirebase } from "./useFirebase";
import { ECollections } from "protocol/Enum/ECollections";

export function useCameraScanner(onTextExtracted?: (text: string) => void) {
  const [permission, requestPermission] = useCameraPermissions();
  const [showCamera, setShowCamera] = useState(false);
  const cameraRef = useRef<CameraView | null>(null);
  const overlayLayout = useRef(null);
  const { setContentModal } = useModal();
  const { createPost, setCurrentCollection, currentCollection } = useFirebase();
  const methods = useForm();
  const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

  const [data, setData] = useState<any>({});

  useEffect(() => {
    createPost(data);
  }, [data])

  const handleTakePicture = useCallback(
    async (prompt: string) => {
      if (!cameraRef.current) {
        Alert.alert("Erro", "Aguarde a câmera inicializar.");
        return;
      }

      if (!GEMINI_API_KEY) {
        Alert.alert(
          "Erro de Configuração",
          "A chave da API do Gemini não foi encontrada."
        );
        return;
      }

      try {
        // 1. Tira a foto
        const photo = await cameraRef.current.takePictureAsync();
        if (!photo?.uri) {
          Alert.alert("Erro", "Não foi possível capturar a foto.");
          return;
        }

        // 2. Converte a imagem para base64 usando expo-file-system
        const base64Image = await FileSystem.readAsStringAsync(photo.uri, {
          encoding: FileSystem.EncodingType.Base64,
        });

        // 3. Configura a API do Gemini
        const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        // 4. Cria um prompt específico pedindo um JSON
        // 5. Envia a imagem e o prompt para a API
        const result = await model.generateContent([
          prompt,
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: base64Image,
            },
          },
        ]);
        console.log("Objeto Resultado: ", result);
        const responseText = result.response.text();

        // 6. Limpa e processa a resposta JSON
        // Remove possíveis blocos de código markdown que a API pode adicionar
        const cleanedJsonText = responseText.replace(/```json\n?|\n?```/g, "");
        const extractedData = JSON.parse(cleanedJsonText);

        // Exibir no Alert com JSON formatado
        console.log("DADOS: ",Object.entries(extractedData));
        setContentModal(
          <FormComponent callbackSubmit={(data:any) => {
            setCurrentCollection(ECollections["Product"]);
            setData(data);
          }} methods={methods}>
            {Object.entries(extractedData).map((data: [string,any]) => (
              <InputComponent textLabel={data[0]} nameInput={data[0]} value={data[1]}></InputComponent>
            ))}
          </FormComponent>
        );

        router.push("/modal");

        console.log("Dados Extraídos (JSON):", extractedData);
      } catch (error) {
        console.error("Erro ao processar imagem com Gemini:", error);
        Alert.alert(
          "Erro na API",
          "Não foi possível processar a imagem. Verifique o console."
        );
      }
    },
    [
      /* onTextExtracted */
    ]
  );

  return {
    permission,
    requestPermission,
    showCamera,
    setShowCamera,
    cameraRef,
    overlayLayout,
    handleTakePicture,
  };
}
