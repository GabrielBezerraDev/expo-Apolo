import { XStackTheme } from "components/Layout/Flexbox/StackTheme";
import { ComponentProps, ComponentType } from "react";
import { Card, Text } from "tamagui";

type CallbackData = (data:any) => any;

interface IDataCard{
    label: string;
    value: (any | CallbackData);
}

interface CardComponentProps extends ComponentProps<typeof Card>{
    data: IDataCard[];
}

export default function CardComponent(props:CardComponentProps) {
  return (
    <Card>
      <Card.Header />
      <Card.Footer />
        <XStackTheme>
            {/* {props.data.map(data) => } */}
            <Text></Text>  
        </XStackTheme>
      <Card.Background />
    </Card>
  );
}
