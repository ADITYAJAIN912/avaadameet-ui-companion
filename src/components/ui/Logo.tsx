import type { SVGProps } from 'react'

interface LogoProps extends SVGProps<SVGSVGElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  withText?: boolean
  className?: string
}

export function Logo({ size = 'md', withText = false, className = '', ...props }: LogoProps) {
  const sizeClasses = {
    sm: 'h-6',
    md: 'h-8',
    lg: 'h-16',
    xl: 'h-32',
  }

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <svg
        viewBox="0 0 200 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${sizeClasses[size]} w-auto shrink-0`}
        {...props}
      >
        {/* Top Swoosh (Charcoal / Navy) */}
        <path
          d="M 25,60 C 80,10 150,10 190,65 C 145,25 75,25 25,60 Z"
          className="fill-[var(--color-brand-navy)]"
        />
        {/* Bottom Swoosh (Terracotta / Teal token) */}
        <path
          d="M 10,35 C 50,90 120,90 175,40 C 125,75 55,75 10,35 Z"
          className="fill-[var(--color-brand-teal)]"
        />
      </svg>
      {withText && (
        <span
          className={`font-extrabold tracking-[0.1em] text-[var(--color-brand-navy)] uppercase ${
            size === 'sm' ? 'text-[12px]' : size === 'md' ? 'text-[16px]' : size === 'lg' ? 'text-[32px]' : 'text-[64px]'
          }`}
          style={{ letterSpacing: '0.15em' }}
        >
          Avaada
        </span>
      )}
    </div>
  )
}
