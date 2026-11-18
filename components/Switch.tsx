import React from 'react';
import { FigmaPrimitive, type CommonProps } from './design-system/FigmaPrimitive';
export type SwitchProps = CommonProps & { State?: "Off" | "On"; onChange?: (state: "Off" | "On") => void; };
export function Switch({ State = "Off", onChange, ...rest }: SwitchProps) {
  return <FigmaPrimitive {...rest} name="Orate / Switch" variant={{ State }} role={"switch"} selected={State === "On"} onPress={() => onChange?.(State === "On" ? "Off" : "On")} />;
}
