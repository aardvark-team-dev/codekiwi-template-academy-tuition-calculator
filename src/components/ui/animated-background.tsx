'use client'

import { cn } from "@/lib/utils"

interface AnimatedBackgroundProps {
  children: React.ReactNode
  imageUrl?: string
  overlay?: boolean
  gradient?: boolean
  className?: string
}

export function AnimatedBackground({
  children,
  imageUrl,
  overlay = true,
  gradient = true,
  className
}: AnimatedBackgroundProps) {
  return (
    <div className={cn("relative min-h-screen overflow-hidden", className)}>
      {/* Background Image */}
      {imageUrl && (
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url(${imageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        />
      )}

      {/* Animated Gradient Overlay */}
      {gradient && (
        <div className="absolute inset-0 z-[1] bg-gradient-to-br from-emerald-500/20 via-blue-500/20 to-purple-500/20 animate-gradient" />
      )}

      {/* Dark Overlay for better text readability */}
      {overlay && (
        <div className="absolute inset-0 z-[2] bg-black/20" />
      )}

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>

      <style jsx>{`
        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 15s ease infinite;
        }
      `}</style>
    </div>
  )
}


