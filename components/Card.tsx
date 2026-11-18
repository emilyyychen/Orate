import React from 'react';
import { FigmaPrimitive, type CommonProps } from './design-system/FigmaPrimitive';
export type CardProps = CommonProps & { Type?: "Score" | "Feedback" | "Metric" | "Recording"; };
export function Card({ Type = "Score", ...rest }: CardProps) {
  return <FigmaPrimitive {...rest} name="Orate / Card" variant={{ Type }} />;
}
