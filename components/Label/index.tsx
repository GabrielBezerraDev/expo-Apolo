import { ComponentProps } from "react";
import { Alert } from "react-native";
import { Label } from 'tamagui'

interface ILabelComponent extends ComponentProps<typeof Label>{
  textLabel?: string;
}

export default function LabelComponent(props: ILabelComponent){
    return <Label fontSize={props.fontSize ?? "$5" }  width={props.width ?? "100%"}  htmlFor={props.htmlFor}>{props.textLabel}</Label>
}