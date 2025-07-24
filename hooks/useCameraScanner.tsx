import { useRef, useState, useCallback } from "react";
import { Alert } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as FileSystem from "expo-file-system";
import { GoogleGenerativeAI } from "@google/generative-ai";

export function useCameraScanner(onTextExtracted?: (text: string) => void) {
  const [permission, requestPermission] = useCameraPermissions();
  const [showCamera, setShowCamera] = useState(false);
  const cameraRef = useRef<CameraView | null>(null);
  const overlayLayout = useRef(null);

  const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

  const handleTakePicture = useCallback(
    async () => {
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
        const prompt = `
        Faça o OCR dessa imagem, e transforme os dados da imagem para JSON, sem objeto aninhados, apenas um JSON de chava e valor.
      `;

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

        const responseText = result.response.text();

        // 6. Limpa e processa a resposta JSON
        // Remove possíveis blocos de código markdown que a API pode adicionar
        const cleanedJsonText = responseText.replace(/```json\n?|\n?```/g, "");
        const extractedData = JSON.parse(cleanedJsonText);

        // Exibir no Alert com JSON formatado
        Alert.alert(
          "Dados extraídos",
          JSON.stringify(extractedData, null, 2) // <-- espaçamento 2
        );

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
