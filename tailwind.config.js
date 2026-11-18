const plugin = require('tailwindcss/plugin');
const components = require('./docs/design-system/figma-components.json');
const foundations = require('./docs/design-system/foundations.json');
const id = (value) => `ds-${value.replace(/[^a-zA-Z0-9]/g, '-')}`;
const noUnit = new Set(['opacity', 'zIndex', 'fontWeight', 'flexGrow', 'flexShrink']);
module.exports = {
  darkMode: 'class',
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  safelist: [...components.flatMap(c => c.variants.flatMap(v => v.nodes.map(n => id(n.id)))), ...components.map(c => `gallery-${c.id.replace(':', '-')}`)],
  theme: {
    extend: {
      colors: foundations.colors,
      fontFamily: { heading: ['Outfit-Bold'], body: ['Roboto-Regular'], medium: ['Roboto-Medium'], bold: ['Roboto-Bold'] },
      spacing: { screen: '24px', section: '24px', bottom: '28px' },
    },
  },
  plugins: [plugin(({ addUtilities }) => {
    const utilities = {};
    for (const c of components) utilities[`.gallery-${c.id.replace(':', '-')}`] = { width: `${c.variants[0].nodes[0].style.width + 32}px` };
    for (const c of components) for (const v of c.variants) for (const n of v.nodes) {
      const s = {};
      for (const [key, value] of Object.entries(n.style)) {
        if (value === undefined || key.startsWith('shadow') || key === 'elevation' || key === 'includeFontPadding') continue;
        s[key] = typeof value === 'number' && !noUnit.has(key) ? `${value}px` : value;
      }
      if (n.style.shadowRadius && n.type !== 'ASSET') {
        const o = n.style.shadowOffset;
        s.boxShadow = `${o.x}px ${o.y}px ${n.style.shadowRadius}px ${n.style.shadowColor.replace(/,1\)$/, `,${n.style.shadowOpacity})`)}`;
      }
      utilities[`.${id(n.id)}`] = s;
    }
    utilities['.ds-button-label'] = { left: `${foundations.spacing.card}px`, top: `${(foundations.size.button - foundations.typography.Button.lineHeight) / 2}px`, width: `${foundations.size.content - foundations.spacing.card * 2}px`, height: `${foundations.typography.Button.lineHeight}px`, textAlign: 'center' };
    addUtilities(utilities);
  })],
};
