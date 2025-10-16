export type BarDatum = { name: string; value: number };
export type LineDatum = { date: Date; value: number };


export interface ColorScheme {
  color: string
  radialGradient: string
  linearGradient: string
}

// 默认颜色方案
export const DEFAULT_COLOR_SCHEME: ColorScheme = {
  color: '#00FFDD',
  radialGradient:
    'radial-gradient(50% 50% at 50% 50%, rgba(0, 0, 0, 0) 44%, rgba(0,128,111,0.5) 64%, rgba(0, 191, 168, 0.75) 78%, rgba(0,128,111,0.5) 90%, #fff 100%)',
  linearGradient:
    'linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(153, 153, 153, 0.5) 79%, rgba(255, 255, 255, 0.5) 100%)'
}

// 颜色配置常量
export const COLOR_SCHEMES: ColorScheme[] = [
  {
    color: '#00FFDD',
    radialGradient:
      'radial-gradient(50% 50% at 50% 50%, rgba(0, 0, 0, 0) 44%, rgba(0,128,111,0.5) 69%, rgba(0, 191, 168, 0.75) 80%, rgba(0,128,111,0.5) 90%, #fff 100%)',
    linearGradient:
      'linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 255, 221, 1) 100%, rgba(255, 255, 255, 1) 100%)'
  },

  {
    color: '#FF00F6',
    radialGradient:
      'radial-gradient(50% 50% at 50% 50%, rgba(0, 0, 0, 0) 44%, rgba(121,0,128,0.5) 69%, rgba(150,0,191,0.75) 80%, rgba(255,0,246,1) 90%, rgba(236,151,255,1) 100%)',
    linearGradient:
      'linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 128, 255, 0.5) 79%, rgba(255, 255, 255, 0.5) 100%)'
  },
  {
    color: '#FF0000',
    radialGradient:
      'radial-gradient(50% 50% at 50% 50%, rgba(0, 0, 0, 0) 44%, rgba(128,0,0,0.5) 69%, rgba(191,0,0,0.75) 80%, rgba(255,0,0,1) 90%, rgba(255,199,151,1) 100%)',
    linearGradient: 'linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(255,0,0,1) 79%, rgba(255,236,183,1) 100%)'
  },
  {
    color: '#00FF3C',
    radialGradient:
      'radial-gradient(50% 50% at 50% 50%, rgba(0, 0, 0, 0) 44%, rgba(0,128,47,0.5) 69%, rgba(0,191,121,0.75) 80%, rgba(0,255,60,1) 93%, rgba(166,255,198,1) 100%)',
    linearGradient: 'linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0,255,81,1) 79%, rgba(255,255,255,1) 100%)'
  },
  {
    color: '#0055FF',
    radialGradient:
      'radial-gradient(50% 50% at 50% 50%, rgba(0, 0, 0, 0) 44%, rgba(0,15,128,0.5) 69%, rgba(0,41,191,0.75) 80%, rgba(0,85,255,1) 93%,rgba(151,238,255,1) 100%)',
    linearGradient: 'linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0,77,255,1) 79%, rgba(255,255,255,1) 100%)'
  },
  {
    color: '#FFBB00',
    radialGradient:
      'radial-gradient(50% 50% at 50% 50%, rgba(0, 0, 0, 0) 44%, rgba(128,81,0,0.5) 69%, rgba(191,150,0,0.75) 80%,rgba(255,187,0,1) 93%, rgba(255,240,206,1) 100%)',
    linearGradient: 'linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(255,144,0,1) 79%, rgba(255,255,255,1) 100%)'
  },
  {
    color: '#9000FF',
    radialGradient:
      'radial-gradient(50% 50% at 50% 50%, rgba(0, 0, 0, 0) 44%, rgba(77,0,128,0.5) 69%, rgba(99,0,191,0.75) 80%, rgba(144,0,255,1) 93%, rgba(224,168,255,1) 100%)',
    linearGradient: 'linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(166,0,255,1) 79%, rgba(255,255,255,1) 100%)'
  },
  {
    color: '#00FFF6',
    radialGradient:
      'radial-gradient(50% 50% at 50% 50%, rgba(0, 0, 0, 0) 44%, rgba(0,96,128,0.5) 69%, rgba(0,131,191,0.75) 80%, rgba(0,255,246,1) 93%, rgba(166,255,249,1) 100%)',
    linearGradient: 'linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0,174,255,1) 79%, rgba(255,255,255,1) 100%)'
  },
  {
    color: '#BFFF00',
    radialGradient:
      'radial-gradient(50% 50% at 50% 50%, rgba(0, 0, 0, 0) 44%, rgba(45,128,0,0.5) 69%, rgba(108,191,0,0.75) 80%, rgba(191,255,0,1) 93%, rgba(225,255,166,1) 100%)',
    linearGradient: 'linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(128,255,0,1) 79%, rgba(255,255,255,1) 100%)'
  },
  {
    color: '#D1D1D1',
    radialGradient:
      'radial-gradient(50% 50% at 50% 50%, rgba(0, 0, 0, 0) 44%, rgba(77,72,72,0.5) 69%, rgba(113,113,113,0.75) 80%, rgba(209,209,209,1) 93%,rgba(225,255,255,1) 100%)',
    linearGradient: 'linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(187,187,187,1) 79%, rgba(255,255,255,1) 100%)'
  }
]