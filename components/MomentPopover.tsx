import React from 'react';
import { FigmaPrimitive, type CommonProps } from './design-system/FigmaPrimitive';
export type MomentPopoverProps = CommonProps & { Style?: "Moment"; onViewFeedback?: () => void; };
export function MomentPopover({ Style = "Moment", onViewFeedback, ...rest }: MomentPopoverProps) {
  return <FigmaPrimitive {...rest} name="Orate / Moment popover" variant={{ Style }} actions={{ "View feedback": onViewFeedback }} />;
}
