import React from 'react';
import { FigmaPrimitive, type CommonProps } from './design-system/FigmaPrimitive';
export type ResultTabsProps = CommonProps & { Selected?: "Overview" | "Script" | "Timeline"; onSelect?: (value: NonNullable<ResultTabsProps["Selected"]>) => void; };
export function ResultTabs({ Selected = "Overview", onSelect, ...rest }: ResultTabsProps) {
  return <FigmaPrimitive {...rest} name="Orate / Result tabs" variant={{ Selected }} actions={{ "Overview": () => onSelect?.("Overview"), "Script": () => onSelect?.("Script"), "Timeline": () => onSelect?.("Timeline") }} nodeActions={{ "Overview /": () => onSelect?.("Overview"), "Script /": () => onSelect?.("Script"), "Timeline /": () => onSelect?.("Timeline") }} />;
}
