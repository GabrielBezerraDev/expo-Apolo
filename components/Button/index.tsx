import { Button, styled, ButtonProps } from "tamagui";

type ButtonThemeProps = ButtonProps & {
  isDisabled?: boolean;
};

export const ButtonTheme = styled(Button, {
  color: "white",
  bg: "#f0052c",
  rounded: "$0",
  animation: "bouncy",
  transition: "all 0.4s ease-out", 
  variants: {
    isDisabled: {
      true: {
        bg: "$black10",
      },
    },
  },
}) as React.FC<ButtonThemeProps>;
