import components from './docs/design-system/figma-components.json';
import foundations from './docs/design-system/foundations.json';

/** Corrected Figma is the source of truth. Geometry lives alongside its source node IDs. */
export const tokens = {
  ...foundations,
  components,
} as const;

export type ComponentName = typeof components[number]['name'];
