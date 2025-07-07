import { FormComponent } from "components/Form";
import { YStackTheme } from "components/Layout/Flexbox/StackTheme";
import { ListItems } from "components/ListItems";
import { Text } from "tamagui";

export default function Home() {
  return (
    <YStackTheme flex={1}>
      <ListItems></ListItems>
    </YStackTheme>
  );
}
