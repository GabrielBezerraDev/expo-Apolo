import { Check, ChevronDown, ChevronUp } from "@tamagui/lucide-icons";
import { YStackTheme } from "components/Layout/Flexbox/StackTheme";
import React, { Dispatch, SetStateAction } from "react";
import { Alert } from "react-native";
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


interface SelectItem {
  name: string; 
  id: any;
  callbackItem?: (...args: any[]) => void;
  icon?: Icon;
}

interface SelectComponentProps<T> extends SelectProps {
  trigger?: React.ReactNode;
  selectItems: SelectItem[];
  items: T[];
  setItem: Dispatch<SetStateAction<T>>;
  item: T;
  keyFilter: keyof T;
}

export function SelectComponent<T>(
  props: SelectComponentProps<T> & {
    trigger?: React.ReactNode;
    onItemSelect?: (item: string) => void;
  }
) {

  const handleSelect = (item: string) => {
    props.setItem(props.items.find((data:T) => data[props.keyFilter] === item) as T);
  };

  return (
    <Select
      value={props.item[props.keyFilter] as string}
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
            {props.selectItems.map((item, i) => (
              <Select.Item
                index={i}
                key={item.name}
                value={item.name}
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
