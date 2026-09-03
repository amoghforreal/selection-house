export function LoadingSpinner({ label = 'Loading...' }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-6">
      <div className="relative h-24 w-16 flex items-end justify-center">
        <div
          className="h-10 w-10 rounded-full bg-accent relative"
          style={{ animation: 'dribble-bounce 0.9s ease-in-out infinite' }}
        >
          <div className="absolute inset-0 rounded-full border-t border-primary/40" />
          <div className="absolute inset-0 rounded-full border-l border-primary/40 rotate-90" />
          <div className="absolute top-1/2 left-0 right-0 h-px bg-primary/40 -translate-y-1/2" />
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-primary/40 -translate-x-1/2" />
        </div>
        <div
          className="absolute bottom-0 h-2 w-10 rounded-full bg-foreground/20"
          style={{ animation: 'dribble-shadow 0.9s ease-in-out infinite' }}
        />
      </div>
      <p className="text-sm text-muted-foreground animate-pulse">{label}</p>
    </div>
  )
}
