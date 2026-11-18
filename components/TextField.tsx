import React, { useState } from 'react';
import { tokens } from '@/tokens';
import { FigmaPrimitive, type CommonProps } from './design-system/FigmaPrimitive';
export type TextFieldProps = CommonProps & { State?: 'Empty' | 'Filled' | 'Focused' | 'Error' | 'Disabled'; value?: string; onChangeText?: (value: string) => void };
export function TextField({ State = 'Empty', value, onChangeText, ...rest }: TextFieldProps) {
  const [draft, setDraft] = useState(State === 'Empty' ? '' : 'Series B pitch');
  const [focused, setFocused] = useState(false);
  const state = State === 'Error' || State === 'Disabled' ? State : focused ? 'Focused' : State;
  const variant = tokens.components.find(c => c.name === 'Orate / Text field')!.variants.find(v => (v.props as Record<string, string>).State === state)!;
  const node = variant.nodes.filter(n => n.type === 'TEXT')[1];
  return <FigmaPrimitive {...rest} name="Orate / Text field" variant={{ State: state }} input={{ nodeId: node.id, value: value ?? draft,
    placeholder: 'Enter a name', disabled: State === 'Disabled', onFocus: () => setFocused(true), onBlur: () => setFocused(false),
    onChangeText: next => { setDraft(next); onChangeText?.(next); } }} />;
}
