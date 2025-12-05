
const config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}', // 如果使用 src 目录
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      screens: {
        h5: { max: '640px' }, // 适配小屏（max-width: 640px）
        md: {min: '640px', max: '1000px'}, // 适配中屏（min-width: 640px and max-width: 1000px）
        web: { min: '1000px' }, // 适配大于小屏（min-width: 1000px)
        lg: {min: '1920px' }, // 适配大屏（min-width: 1920px）
      },
      fontFamily: {
        digit: ['DS-DIGIT']
      },
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        normal: 'red',
      },
      keyframes: {
        wave: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        scaleUp: {
          '0%': { 
            transform: 'scale(0)',
            opacity: '0'
          },
          '100%': { 
            transform: 'scale(1)',
            opacity: '1'
          },
        },
      },
      animation: {
        wave: 'wave 1s ease-in-out infinite',
        'scale-up': 'scaleUp 1s ease-in forwards',
      },
    },
  },
  plugins: [],
}
module.exports = config
