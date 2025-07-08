import React, { useEffect, useRef, useState } from "react";
import { CirclePlus } from "@tamagui/lucide-icons";
import { ButtonTheme } from "components/Button";
import { YStackTheme } from "components/Layout/Flexbox/StackTheme";
import { ListItems } from "components/ListItems";
import {
  Camera,
  CameraType,
  CameraView,
  useCameraPermissions,
} from "expo-camera";
import { View, StyleSheet } from "react-native";
import TextRecognition from "@react-native-ml-kit/text-recognition";
import { Button } from "tamagui";

export default function Home() {
  const [showCamera, setShowCamera] = useState(false);
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  // if (!permission.granted) {
  //   // Camera permissions are not granted yet.
  //   return (
  //     <View style={styles.container}>
  //       <Text style={styles.message}>
  //         We need your permission to show the camera
  //       </Text>
  //       <Button onPress={requestPermission} title="grant permission" />
  //     </View>
  //   );
  // }

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  return (
    <YStackTheme flex={1}>
      <>
        <ListItems />
        <ButtonTheme
          iconAfter={<CirclePlus />}
          onPress={() => setShowCamera(true)}
        >
          Nova Saída De Material
        </ButtonTheme>
      </>
    </YStackTheme>
  );
}
