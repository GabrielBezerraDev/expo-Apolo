// components/ListItems.js

import React, { useEffect, useState } from "react";
import { FlashList } from "@shopify/flash-list";
import { getAxios } from "services/axios-api";
import CardComponent from "components/Card";
import { View } from "tamagui";
import { Alert, ActivityIndicator } from "react-native"; // Importe ActivityIndicator

const fieldDefinitions = [
  { label: "Nome", value: "firstname" },
  { label: "Email", value: (user) => user.email.toUpperCase() },
];

export const ListItems = () => {
  const [data, setData] = useState<any[]>([]);
  // NOVO: Adicione estados para loading e erro
  const [loading, setLoading] = useState(true);



  useEffect(() => {
    const getUsers = async () => {};
  }, []);

  // Enquanto estiver carregando, mostre um indicador
  if (loading) {
    return <ActivityIndicator size="large" style={{ flex:1 }} />;
  }

  // O useCallback não é estritamente necessário aqui, mas mantendo a estrutura
  const renderFlashList = () => {
    return (
      <FlashList
        data={data}
        estimatedItemSize={200}
        style={{flex:1}}
        contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 40 }}
        ItemSeparatorComponent={() => <View height="$2" />}
        renderItem={({ item }) => {
          const formattedData = fieldDefinitions.map((field) => ({
            label: field.label,
            value:
              typeof field.value === "function"
                ? field.value(item)
                : item[field.value],
          }));
          return <CardComponent data={formattedData} />;
        }}
      />
    );
  };

  return renderFlashList();
};
