import React from 'react';
import { FigmaPrimitive, type CommonProps } from './design-system/FigmaPrimitive';
export type BrandMotifProps = CommonProps & { Motif?: "Steps" | "Rhythm" | "Speech"; };
export function BrandMotif({ Motif = "Steps", ...rest }: BrandMotifProps) {
  return <FigmaPrimitive {...rest} name="Orate / Brand motif" variant={{ Motif }} />;
}
