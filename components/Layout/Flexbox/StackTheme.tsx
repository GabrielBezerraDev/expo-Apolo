import { StackProps, styled, XStack, YStack } from "tamagui";

function createStackStyle<T extends StackProps>(style: T): T {
  return style;
}

const defaultStyleStack = createStackStyle({
  bg: "$background"
});

export const YStackTheme = styled(YStack, {
  ...defaultStyleStack
});

export const XStackTheme = styled(XStack, {
  ...defaultStyleStack
});
