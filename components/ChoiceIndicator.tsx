import React from 'react';
import { FigmaPrimitive, type CommonProps } from './design-system/FigmaPrimitive';
export type ChoiceIndicatorProps = CommonProps & { Type?: "Radio" | "Checkbox"; State?: "Off" | "On"; onChange?: (state: "Off" | "On") => void; };
export function ChoiceIndicator({ Type = "Radio", State = "Off", onChange, ...rest }: ChoiceIndicatorProps) {
  return <FigmaPrimitive {...rest} name="Orate / Choice indicator" variant={{ Type, State }} role={Type === "Radio" ? "radio" : "checkbox"} selected={State === "On"} onPress={() => onChange?.(State === "On" ? "Off" : "On")} />;
}
