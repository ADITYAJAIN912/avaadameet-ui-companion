import { getAvatarColor, getInitials } from '../../utils/helpers'

interface AvatarProps {
  name: string
  email?: string
  avatarUrl?: string
  size?: 'sm' | 'md'
  className?: string
}

const sizeClasses = {
  sm: 'h-6 w-6 text-[10px]',
  md: 'h-8 w-8 text-caption',
}

const ringClasses =
  'ring-2 ring-surface-raised shadow-sm border border-neutral-border transition-all duration-200 ease-out'

export function Avatar({ name, email, avatarUrl, size = 'sm', className = '' }: AvatarProps) {
  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={name}
        className={`rounded-full object-cover ${ringClasses} ${sizeClasses[size]} ${className}`}
      />
    )
  }

  return (
    <div
      className={`flex items-center justify-center rounded-full font-medium text-white ${ringClasses} ${getAvatarColor(name, email)} ${sizeClasses[size]} ${className}`}
      title={name}
      role="img"
      aria-label={name}
    >
      {getInitials(name)}
    </div>
  )
}
