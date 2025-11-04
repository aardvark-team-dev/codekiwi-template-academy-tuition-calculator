'use client'

import { useState, useEffect, Suspense } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { requestStorageAccessIfNeeded, getStorageAccessStatus } from '@/lib/storage-access'
import { AnimatedBackground } from '@/components/ui/animated-background'
import { GlassCard, GlassCardHeader, GlassCardTitle, GlassCardDescription, GlassCardContent, GlassCardFooter } from '@/components/ui/glass-card'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showIframeNotice, setShowIframeNotice] = useState(false)

  const callbackUrl = searchParams.get('callbackUrl') || '/'

  // iframe 환경 확인
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
      // 🔥 Storage Access API 권한 요청 (iframe 환경에서만)
      const hasAccess = await requestStorageAccessIfNeeded()
      
      if (!hasAccess) {
        setError('쿠키 접근 권한이 필요합니다. 브라우저 설정을 확인해주세요.')
        setIsLoading(false)
        return
      }

      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      })

      if (result?.error) {
        setError('이메일 또는 비밀번호가 올바르지 않습니다.')
      } else {
        router.push(callbackUrl)
      }
    } catch (error) {
      setError('로그인 중 오류가 발생했습니다.')
      console.error('Login error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AnimatedBackground
      imageUrl="https://images.pexels.com/photos/1462630/pexels-photo-1462630.jpeg?auto=compress&cs=tinysrgb&w=1920"
      overlay
      gradient
    >
      <div className="min-h-screen flex items-center justify-center px-4">
        <GlassCard className="w-full max-w-md">
          <GlassCardHeader className="text-center">
            <GlassCardTitle className="text-3xl">로그인</GlassCardTitle>
            <GlassCardDescription className="text-lg mt-2">
              환영합니다! 계속하시려면 로그인해주세요.
            </GlassCardDescription>
          </GlassCardHeader>
          <GlassCardContent>
          {searchParams.get('message') === 'signup-success' && (
            <div className="mb-4 rounded-md border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300">
              회원가입이 완료되었습니다. 로그인해주세요.
            </div>
          )}
          {showIframeNotice && (
            <div className="mb-4 rounded-md border border-blue-500/20 bg-blue-500/10 px-3 py-2 text-sm text-blue-300">
              ℹ️ 처음 로그인 시 브라우저가 쿠키 사용 권한을 요청할 수 있습니다.
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
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
            </div>
            {error && <p className="text-sm text-red-400">{error}</p>}
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white shadow-lg"
              disabled={isLoading}
            >
              {isLoading ? '로그인 중...' : '계속'}
            </Button>
          </form>
          </GlassCardContent>
          <GlassCardFooter className="flex justify-center text-sm">
            <p className="text-gray-600">계정이 없으신가요?&nbsp;</p>
            <Link href="/signup" className="font-semibold text-emerald-600 hover:text-emerald-700">
              가입하기
            </Link>
          </GlassCardFooter>
        </GlassCard>
      </div>
    </AnimatedBackground>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <AnimatedBackground
        imageUrl="https://images.pexels.com/photos/1462630/pexels-photo-1462630.jpeg?auto=compress&cs=tinysrgb&w=1920"
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
      <LoginForm />
    </Suspense>
  )
}
