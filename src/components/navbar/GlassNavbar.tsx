'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { cn } from '@/lib/utils'
import {
  GraduationCap,
  Users,
  BookOpen,
  CalendarCheck,
  CreditCard,
  Menu,
  X,
  LogOut,
  User
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const navItems = [
  { href: '/dashboard', label: '대시보드', icon: GraduationCap },
  { href: '/students', label: '학생 관리', icon: Users },
  { href: '/classes', label: '반 관리', icon: BookOpen },
  { href: '/attendance', label: '출결 관리', icon: CalendarCheck },
  { href: '/billing', label: '청구 관리', icon: CreditCard },
]

export function GlassNavbar() {
  const { data: session } = useSession()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // 로그인/회원가입 페이지에서는 navbar 숨김
  if (!session || pathname === '/login' || pathname === '/signup') {
    return null
  }

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50">
        <div className="mx-4 mt-4">
          <div className={cn(
            // Glassmorphism
            "bg-white/70 backdrop-blur-xl",
            "border border-white/20",
            "rounded-2xl shadow-xl shadow-black/5",
            // Layout
            "px-6 py-4"
          )}>
            <div className="flex items-center justify-between">
              {/* Logo */}
              <Link href="/dashboard" className="flex items-center space-x-3 group">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
                  <div className="relative bg-gradient-to-br from-emerald-500 to-blue-500 p-2 rounded-xl">
                    <GraduationCap className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                    학원관리
                  </h1>
                  <p className="text-xs text-gray-500">Academy Manager</p>
                </div>
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-2">
                {navItems.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href
                  
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200",
                        isActive
                          ? "bg-gradient-to-r from-emerald-500 to-blue-500 text-white shadow-lg"
                          : "text-gray-700 hover:bg-gray-100/50"
                      )}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-sm font-medium">{item.label}</span>
                    </Link>
                  )
                })}
              </div>

              {/* User Menu */}
              <div className="hidden md:flex items-center space-x-3">
                <div className="flex items-center space-x-2 px-3 py-2 rounded-xl bg-gray-100/50">
                  <User className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">
                    {session?.user?.email}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => signOut({ callbackUrl: '/login' })}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  로그아웃
                </Button>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-xl hover:bg-gray-100/50 transition-colors"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>

            {/* Mobile Navigation */}
            {mobileMenuOpen && (
              <div className="md:hidden mt-4 pt-4 border-t border-gray-200/50 space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href
                  
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200",
                        isActive
                          ? "bg-gradient-to-r from-emerald-500 to-blue-500 text-white shadow-lg"
                          : "text-gray-700 hover:bg-gray-100/50"
                      )}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  )
                })}
                
                <div className="pt-2 mt-2 border-t border-gray-200/50">
                  <div className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-600">
                    <User className="w-4 h-4" />
                    <span>{session?.user?.email}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => signOut({ callbackUrl: '/login' })}
                    className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    로그아웃
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Spacer to prevent content from going under navbar */}
      <div className="h-24" />
    </>
  )
}

