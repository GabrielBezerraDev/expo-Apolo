import React, { useCallback, useEffect, useState } from "react";
import { FlashList } from "@shopify/flash-list";
import { getAxios } from "services/axios-api";
import CardComponent from "components/Card";
import { Button, View } from "tamagui";

const fieldDefinitions = [
  { label: "Nome", value: "firstname" },
  { label: "Email", value: (user: any) => user.email.toUpperCase() },
];

export const ListItems = () => {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const getUsers = async () => {
      const users = await getAxios(
        "https://fakerapi.it/api/v2/users?_quantity=20&_gender=male"
      );
      setData((users.data as any)["data"]);
    };
    getUsers();
  }, []);

  const renderFlashList = useCallback(() => {
    return (
      <FlashList
        data={data}
        estimatedItemSize={200}
        contentContainerStyle={{ paddingHorizontal: 16, paddingVertical:40 }}
        ItemSeparatorComponent={() => <View height="$2" />}
        renderItem={({ item }: { item: any }) => {
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
  }, [data]);

  return renderFlashList();
};
