import type { Config } from 'tailwindcss'

/**
 * Tailwind theme — wired to CSS custom properties in src/design-system/tokens.css
 * Do not add raw hex values here; update tokens.css instead.
 */
export default {
  theme: {
    extend: {
      colors: {
        brand: {
          navy: 'var(--color-brand-navy)',
          teal: 'var(--color-brand-teal)',
          tealHover: 'var(--color-brand-teal-hover)',
          tealLight: 'var(--color-brand-teal-muted)',
          tealSubtle: 'var(--color-brand-teal-subtle)',
        },
        status: {
          success: 'var(--color-success)',
          successMuted: 'var(--color-success-muted)',
          warning: 'var(--color-warning)',
          warningMuted: 'var(--color-warning-muted)',
          danger: 'var(--color-danger)',
          dangerMuted: 'var(--color-danger-muted)',
          info: 'var(--color-info)',
          infoMuted: 'var(--color-info-muted)',
        },
        coral: {
          DEFAULT: 'var(--accent-coral)',
          muted: 'var(--accent-coral-muted)',
        },
        neutral: {
          bg: 'var(--surface-canvas)',
          border: 'var(--border-default)',
          muted: 'var(--text-tertiary)',
          text: 'var(--text-primary)',
          inverse: 'var(--text-inverse)',
        },
        surface: {
          canvas: 'var(--surface-canvas)',
          DEFAULT: 'var(--surface-default)',
          raised: 'var(--surface-raised)',
          sunken: 'var(--surface-sunken)',
          accent: 'var(--surface-accent)',
        },
      },
      spacing: {
        0.5: 'var(--space-0-5)',
        1.5: 'var(--space-1-5)',
        2.5: 'var(--space-2-5)',
      },
      fontSize: {
        micro: ['var(--font-size-micro)', { lineHeight: 'var(--line-height-normal)' }],
        small: ['var(--font-size-small)', { lineHeight: 'var(--line-height-normal)' }],
        caption: ['var(--font-size-caption)', { lineHeight: 'var(--line-height-normal)' }],
        body: ['var(--font-size-body)', { lineHeight: 'var(--line-height-normal)' }],
        'body-lg': ['var(--font-size-body-lg)', { lineHeight: 'var(--line-height-normal)' }],
        'heading-sm': ['var(--font-size-heading-sm)', { lineHeight: 'var(--line-height-snug)' }],
        'heading-md': ['var(--font-size-heading-md)', { lineHeight: 'var(--line-height-snug)' }],
        'heading-lg': ['var(--font-size-heading-lg)', { lineHeight: 'var(--line-height-tight)' }],
        'display-sm': ['var(--font-size-display-sm)', { lineHeight: 'var(--line-height-tight)' }],
        'display-md': ['var(--font-size-display-md)', { lineHeight: 'var(--line-height-tight)' }],
        /* Legacy aliases — migrate to display/heading scale */
        'card-title': ['var(--font-size-heading-sm)', { lineHeight: 'var(--line-height-snug)' }],
        section: ['var(--font-size-heading-lg)', { lineHeight: 'var(--line-height-tight)' }],
        'topbar-title': ['var(--font-size-heading-md)', { lineHeight: 'var(--line-height-snug)' }],
        'page-title': ['var(--font-size-display-md)', { lineHeight: 'var(--line-height-tight)' }],
        stat: ['var(--font-size-display-sm)', { lineHeight: 'var(--line-height-tight)' }],
        meta: ['var(--font-size-caption)', { lineHeight: 'var(--line-height-normal)' }],
        base: ['var(--font-size-body-lg)', { lineHeight: 'var(--line-height-normal)' }],
      },
      fontFamily: {
        sans: ['var(--font-family-sans)'],
        display: ['var(--font-family-display)'],
        mono: ['var(--font-family-mono)'],
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
      },
      boxShadow: {
        xs: 'var(--shadow-xs)',
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        'elevation-1': 'var(--elevation-1)',
        'elevation-2': 'var(--elevation-2)',
        'elevation-3': 'var(--elevation-3)',
        focus: 'var(--shadow-focus)',
      },
      height: {
        'control-xs': 'var(--control-height-xs)',
        'control-sm': 'var(--control-height-sm)',
        'control-md': 'var(--control-height-md)',
        'control-lg': 'var(--control-height-lg)',
        'control-xl': 'var(--control-height-xl)',
      },
      width: {
        'icon-xs': 'var(--icon-xs)',
        'icon-sm': 'var(--icon-sm)',
        'icon-md': 'var(--icon-md)',
        'icon-lg': 'var(--icon-lg)',
        'icon-xl': 'var(--icon-xl)',
      },
      transitionDuration: {
        fast: 'var(--duration-fast)',
        DEFAULT: 'var(--duration-normal)',
        slow: 'var(--duration-slow)',
        slower: 'var(--duration-slower)',
      },
      transitionTimingFunction: {
        DEFAULT: 'var(--ease-default)',
        out: 'var(--ease-out)',
        'in-out': 'var(--ease-in-out)',
        spring: 'var(--ease-spring)',
      },
      fontWeight: {
        medium: '400',
        semibold: '400',
        bold: '400',
        extrabold: '400',
        black: '400',
      },
      zIndex: {
        raised: 'var(--z-raised)',
        dropdown: 'var(--z-dropdown)',
        sticky: 'var(--z-sticky)',
        overlay: 'var(--z-overlay)',
        modal: 'var(--z-modal)',
        toast: 'var(--z-toast)',
      },
    },
  },
} satisfies Config
