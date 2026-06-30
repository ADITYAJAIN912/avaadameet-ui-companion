import type { HTMLAttributes } from 'react'

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  className?: string
}

export function Skeleton({ className = '', ...props }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-neutral-border/70 ${className}`}
      aria-hidden
      {...props}
    />
  )
}

export function HomePageSkeleton() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-2.5 lg:max-h-[calc(100dvh-8.25rem)]">
      <Skeleton className="h-[4rem] w-full rounded-xl" />
      <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-[5rem] rounded-xl" />
        ))}
      </div>
      <div className="grid min-h-[20rem] flex-1 grid-cols-1 gap-2.5 lg:grid-cols-5">
        <Skeleton className="h-full min-h-[16rem] rounded-xl lg:col-span-3" />
        <Skeleton className="h-full min-h-[16rem] rounded-xl lg:col-span-2" />
      </div>
    </div>
  )
}

export function MeetingsPageSkeleton() {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <Skeleton className="h-11 w-full rounded-xl" />
      <Skeleton className="h-12 w-full rounded-xl" />
      <Skeleton className="h-14 w-full rounded-xl" />
      <div className="space-y-3">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-56 w-full rounded-2xl" />
      </div>
    </div>
  )
}

export function ActionItemsPageSkeleton() {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row">
        <Skeleton className="h-11 flex-1 rounded-xl" />
        <Skeleton className="h-11 w-80 rounded-xl" />
        <Skeleton className="h-11 w-36 rounded-xl" />
      </div>
      <Skeleton className="h-10 w-full rounded-xl" />
      <Skeleton className="h-96 w-full rounded-2xl" />
    </div>
  )
}

export function CalendarPageSkeleton() {
  return (
    <div className="mx-auto flex h-[calc(100dvh-7rem)] max-w-7xl flex-col gap-2.5 overflow-hidden lg:h-[calc(100dvh-6.5rem)]">
      <div className="h-20 shrink-0 animate-pulse rounded-xl bg-neutral-border/70" />
      <div className="flex min-h-0 flex-1 gap-2.5">
        <div className="flex-1 animate-pulse rounded-xl bg-neutral-border/70" />
        <div className="w-72 animate-pulse rounded-xl bg-neutral-border/70" />
      </div>
    </div>
  )
}
