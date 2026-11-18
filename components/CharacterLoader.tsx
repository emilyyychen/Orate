import React, { useEffect, useState } from 'react';
import { AccessibilityInfo } from 'react-native';
import { FigmaPrimitive, type CommonProps } from './design-system/FigmaPrimitive';
export type CharacterLoaderProps = CommonProps & { Frame?: '1' | '2' | '3'; autoPlay?: boolean };
export function CharacterLoader({ Frame = '1', autoPlay = false, ...rest }: CharacterLoaderProps) {
  const [frame, setFrame] = useState(Frame);
  useEffect(() => { setFrame(Frame); }, [Frame]);
  useEffect(() => {
    if (!autoPlay) return;
    let timer: ReturnType<typeof setInterval> | undefined;
    let alive = true;
    AccessibilityInfo.isReduceMotionEnabled().then(reduced => {
      if (alive && !reduced) timer = setInterval(() => setFrame(v => v === '1' ? '2' : v === '2' ? '3' : '1'), 560);
    });
    return () => { alive = false; if (timer) clearInterval(timer); };
  }, [autoPlay]);
  return <FigmaPrimitive {...rest} name="Orate / Character loader" variant={{ Frame: autoPlay ? frame : Frame }} />;
}
