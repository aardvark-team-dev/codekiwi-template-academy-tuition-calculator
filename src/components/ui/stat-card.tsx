'use client'

import { GlassCard } from "./glass-card"
import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"

interface StatCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  iconColor?: string
  iconBgColor?: string
  trend?: {
    value: string
    isPositive: boolean
  }
  className?: string
}

export function StatCard({
  title,
  value,
  icon: Icon,
  iconColor = "text-emerald-600",
  iconBgColor = "bg-emerald-100",
  trend,
  className
}: StatCardProps) {
  return (
    <GlassCard className={cn("relative overflow-hidden group", className)}>
      {/* Animated gradient background on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={cn(
            "p-3 rounded-xl transition-transform duration-300 group-hover:scale-110",
            iconBgColor
          )}>
            <Icon className={cn("w-6 h-6", iconColor)} />
          </div>
          {trend && (
            <div className={cn(
              "text-sm font-semibold px-2 py-1 rounded-full",
              trend.isPositive ? "text-emerald-600 bg-emerald-100" : "text-red-600 bg-red-100"
            )}>
              {trend.isPositive ? "↗" : "↘"} {trend.value}
            </div>
          )}
        </div>
        
        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            {value}
          </p>
        </div>
      </div>
    </GlassCard>
  )
}


