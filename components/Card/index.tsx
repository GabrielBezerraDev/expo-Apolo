import { Card, Text, View, CardProps } from "tamagui";

interface CardComponentProps extends CardProps {
  data: { label: string; value: any }[];
}

export default function CardComponent({ data, ...cardProps }: CardComponentProps) {
  return (
    <Card elevation={5} bordered  {...cardProps}>
      <Card.Header>
        <Text>Teste</Text>
      </Card.Header>
      <Card.Footer />
      <View style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", padding:10 }}>
        {data.map((item, index) => (
          <View key={index}>
            <Text>{`${item.label}: ${item.value}`}</Text>
          </View>
        ))}
      </View>
      <Card.Background />
    </Card>
  );
}