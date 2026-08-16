// Must match the `html[data-theme='...']` blocks in src/index.css.
// 'default' has no data-theme attribute at all (see ThemeContext.jsx).
export const THEMES = [
  {
    id: 'default',
    label: 'Default',
    swatch: 'linear-gradient(135deg, rgb(41, 219, 21) 0%, #fbff00 100%)',
  },
  {
    id: 'ocean',
    label: 'Ocean',
    swatch: 'linear-gradient(135deg, #0bceff 0%, #4fffb9 100%)',
  },
  {
    id: 'orangie',
    label: 'Orangie',
    swatch: 'linear-gradient(135deg, #ff6e25 0%, #f4f73f 100%)',
  },
  { id: 'paper', label: 'Paper', swatch: '#d6d3d1' },
  { id: 'paper-dark', label: 'Paper Dark', swatch: '#18181b' },
]
