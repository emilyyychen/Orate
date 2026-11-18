import React from 'react';
import { FigmaPrimitive, type CommonProps } from './design-system/FigmaPrimitive';
export type IssueMarkerProps = CommonProps & { Type?: "Pause" | "Repeat" | "Volume" | "Background" | "Word choice"; onPress?: () => void; };
export function IssueMarker({ Type = "Pause", onPress, ...rest }: IssueMarkerProps) {
  return <FigmaPrimitive {...rest} name="Orate / Issue marker" variant={{ Type }} role="button" onPress={onPress} />;
}
