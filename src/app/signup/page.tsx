'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { requestStorageAccessIfNeeded, getStorageAccessStatus } from '@/lib/storage-access'
import { AnimatedBackground } from '@/components/ui/animated-background'
import { GlassCard, GlassCardHeader, GlassCardTitle, GlassCardDescription, GlassCardContent, GlassCardFooter } from '@/components/ui/glass-card'

function SignUpForm() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showIframeNotice, setShowIframeNotice] = useState(false)

  useEffect(() => {
    getStorageAccessStatus().then((status) => {
      if (status.isInIframe && !status.hasAccess) {
        setShowIframeNotice(true)
      }
    })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const hasAccess = await requestStorageAccessIfNeeded()
      
      if (!hasAccess) {
        setError('쿠키 접근 권한이 필요합니다. 브라우저 설정을 확인해주세요.')
        setIsLoading(false)
        return
      }

      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.message || '회원가입 중 오류가 발생했습니다.')
      } else {
        router.push('/login?message=signup-success')
      }
    } catch (error) {
      setError('네트워크 오류가 발생했습니다.')
      console.error('Sign up error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AnimatedBackground
      imageUrl="https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=1920"
      overlay
      gradient
    >
      <div className="min-h-screen flex items-center justify-center px-4">
        <GlassCard className="w-full max-w-md">
          <GlassCardHeader className="text-center">
            <GlassCardTitle className="text-3xl">계정 생성</GlassCardTitle>
            <GlassCardDescription className="text-lg mt-2">
              시작하기 위해 아래 정보를 입력해주세요.
            </GlassCardDescription>
          </GlassCardHeader>
          <GlassCardContent>
            {showIframeNotice && (
              <div className="mb-4 rounded-md border border-blue-500/20 bg-blue-500/10 px-3 py-2 text-sm text-blue-600">
                ℹ️ 처음 가입 시 브라우저가 쿠키 사용 권한을 요청할 수 있습니다.
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">이름</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="홍길동"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={isLoading}
                  className="bg-white/50 backdrop-blur-sm"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">이메일 주소</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  className="bg-white/50 backdrop-blur-sm"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">비밀번호</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  className="bg-white/50 backdrop-blur-sm"
                />
                <p className="text-xs text-gray-600">최소 8자 이상</p>
              </div>
              {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white shadow-lg"
                disabled={isLoading}
              >
                {isLoading ? '생성 중...' : '계정 생성'}
              </Button>
            </form>
          </GlassCardContent>
          <GlassCardFooter className="flex justify-center text-sm">
            <p className="text-gray-600">이미 계정이 있으신가요?&nbsp;</p>
            <Link href="/login" className="font-semibold text-emerald-600 hover:text-emerald-700">
              로그인
            </Link>
          </GlassCardFooter>
        </GlassCard>
      </div>
    </AnimatedBackground>
  )
}

export default function SignUpPage() {
  return (
    <Suspense fallback={
      <AnimatedBackground
        imageUrl="https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=1920"
        overlay
        gradient
      >
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-white text-lg">로딩 중...</p>
          </div>
        </div>
      </AnimatedBackground>
    }>
      <SignUpForm />
    </Suspense>
  )
}
