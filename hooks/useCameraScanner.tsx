import { useRef, useState, useCallback } from "react";
import { Alert, Dimensions } from "react-native";
import * as ImageManipulator from "expo-image-manipulator";
import { CameraView, useCameraPermissions } from "expo-camera";
import TextRecognition from "@react-native-ml-kit/text-recognition";

export function useCameraScanner(onTextExtracted?: (text: string) => void) {
  const [permission, requestPermission] = useCameraPermissions();
  const [showCamera, setShowCamera] = useState(false);
  const cameraRef = useRef<CameraView | null>(null);
  const overlayLayout = useRef(null);

  const handleTakePicture = useCallback(async () => {
    if (!cameraRef.current || !overlayLayout.current) {
      Alert.alert("Erro", "Aguarde a câmera inicializar completamente.");
      return;
    }

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

    if (onTextExtracted) {
      onTextExtracted(result.text);
    }
  }, [onTextExtracted]);

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