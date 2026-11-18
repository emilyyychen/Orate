import React from 'react';
import { FigmaPrimitive, type CommonProps } from './design-system/FigmaPrimitive';
export type ProgressProps = CommonProps & { State?: "Start" | "Middle" | "Complete"; };
export function Progress({ State = "Start", ...rest }: ProgressProps) {
  return <FigmaPrimitive {...rest} name="Orate / Progress" variant={{ State }} />;
}
