import { Check, ChevronDown, ChevronUp } from "@tamagui/lucide-icons";
import { YStackTheme } from "components/Layout/Flexbox/StackTheme";
import React from "react";
import { LinearGradient } from "react-native-svg";
import {
  Adapt,
  FontSizeTokens,
  getFontSize,
  ScrollView,
  Select,
  SelectProps,
  Sheet,
} from "tamagui";

const items = [
  { name: "Apple" },
  { name: "Pear" },
  { name: "Blackberry" },
  { name: "Peach" },
  { name: "Apricot" },
  { name: "Melon" },
  { name: "Honeydew" },
  { name: "Starfruit" },
  { name: "Blueberry" },
  { name: "Raspberry" },
  { name: "Strawberry" },
  { name: "Mango" },
  { name: "Pineapple" },
  { name: "Lime" },
  { name: "Lemon" },
  { name: "Coconut" },
  { name: "Guava" },
  { name: "Papaya" },
  { name: "Orange" },
  { name: "Grape" },
  { name: "Jackfruit" },
  { name: "Durian" },
];

export function SelectComponent(
  props: SelectProps & { trigger?: React.ReactNode; onItemSelect?: (item: string) => void }
) {
  const [val, setVal] = React.useState(items[0].name.toLowerCase());

  const handleSelect = (item: string) => {
    setVal(item);
    if (props.onItemSelect) {
      props.onItemSelect(item);
    }
  };

  return (
    <Select
      value={val}
      onValueChange={handleSelect}
      disablePreventBodyScroll
      {...props}
    >
      {props?.trigger || (
        <Select.Trigger maxWidth={"100%"} iconAfter={ChevronDown}>
          <Select.Value placeholder="Something" />
        </Select.Trigger>
      )}

      <Adapt when="maxMd" platform="touch">
        <Sheet
          native={!!props.native}
          modal
          dismissOnSnapToBottom
          animation="100ms"
        >
          <Sheet.Frame>
            <ScrollView>
              <Adapt.Contents />
            </ScrollView>
          </Sheet.Frame>
          <Sheet.Overlay
            bg="$shadowColor"
            animation="lazy"
            enterStyle={{ opacity: 0 }}
            exitStyle={{ opacity: 0 }}
          />
        </Sheet>
      </Adapt>

      <Select.Content z={200000}>
        <Select.ScrollUpButton
          items="center"
          justify="center"
          position="relative"
          width="100%"
          height="$3"
        >
          <YStackTheme z={10}>
            <ChevronUp size={20} />
          </YStackTheme>
          <LinearGradient
            start={[0, 0]}
            end={[0, 1]}
            fullscreen
            colors={["$background", "transparent"]}
            borderRadius="$4"
          />
        </Select.ScrollUpButton>

        <Select.Viewport>
          <Select.Group>
            <Select.Label>Fruits</Select.Label>
            {items.map((item, i) => (
              <Select.Item
                index={i}
                key={item.name}
                value={item.name.toLowerCase()}
              >
                <Select.ItemText>{item.name}</Select.ItemText>
                <Select.ItemIndicator>
                  <Check size={16} />
                </Select.ItemIndicator>
              </Select.Item>
            ))}
          </Select.Group>
          {props.native && (
            <YStackTheme
              position="absolute"
              r={0}
              t={0}
              b={0}
              items="center"
              justify="center"
              width={"$4"}
              pointerEvents="none"
            >
              <ChevronDown
                size={getFontSize((props.size as FontSizeTokens) ?? "$true")}
              />
            </YStackTheme>
          )}
        </Select.Viewport>

        <Select.ScrollDownButton
          justify="center"
          position="relative"
          width="100%"
          height="$3"
        >
          <YStackTheme z={10}>
            <ChevronDown size={20} />
          </YStackTheme>
          <LinearGradient
            start={[0, 0]}
            end={[0, 1]}
            fullscreen
            colors={["transparent", "$background"]}
            borderRadius="$4"
          />
        </Select.ScrollDownButton>
      </Select.Content>
    </Select>
  );
}
