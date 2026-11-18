import React from 'react';
import { FigmaPrimitive, type CommonProps } from './design-system/FigmaPrimitive';
export type BottomSheetProps = CommonProps & { Style?: "Feedback"; onClose?: () => void; onPractice?: () => void; onExercise?: () => void; };
export function BottomSheet({ Style = "Feedback", onClose, onPractice, onExercise, ...rest }: BottomSheetProps) {
  return <FigmaPrimitive {...rest} name="Orate / Bottom sheet" variant={{ Style }} actions={{ "Practice this line": onPractice, "Try a 20-second exercise": onExercise }} nodeActions={{ "Close /": onClose }} />;
}
