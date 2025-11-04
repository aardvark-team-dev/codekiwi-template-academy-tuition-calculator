'use client'

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { SignedIn } from '@/components/auth/SignedIn'
import { SignedOut } from '@/components/auth/SignedOut'
import { SignInButton } from '@/components/auth/SignInButton'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import PexelsImage from '@/components/PexelsImage'
import Link from 'next/link'
import { Calculator, Users, FileText, Calendar, TrendingUp, DollarSign, CheckCircle, Clock } from 'lucide-react'
import { AnimatedBackground } from '@/components/ui/animated-background'
import { GlassCard, GlassCardHeader, GlassCardTitle, GlassCardContent } from '@/components/ui/glass-card'
import { StatCard } from '@/components/ui/stat-card'

export default function LandingPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  // 로그인 되어 있으면 대시보드로 리다이렉트
  useEffect(() => {
    if (status !== 'loading' && session) {
      router.push('/dashboard')
    }
  }, [session, status, router])

  // 로딩 중이거나 로그인되어 있으면 빈 화면
  if (status === 'loading' || session) {
    return null
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <PexelsImage 
          query="classroom students learning"
          className="absolute inset-0 w-full h-full object-cover"
          alt="학원 배경"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
        
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 tracking-tight">
            학원 수강료 계산,
            <br />
            <span className="text-emerald-400">이제 자동으로</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-12 font-light">
            유계결석 차감부터 청구서 발행까지, 한 번에 해결하세요
          </p>
          
          <SignedOut>
            <SignInButton>
              <Button 
                size="lg" 
                className="text-lg px-12 py-7 bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xl hover:scale-105 transition-all duration-300 backdrop-blur-lg border border-white/20"
              >
                무료로 시작하기
              </Button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <Link href="/students">
              <Button 
                size="lg" 
                className="text-lg px-12 py-7 bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xl hover:scale-105 transition-all duration-300"
              >
                대시보드로 이동
              </Button>
            </Link>
          </SignedIn>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-5xl font-bold text-center mb-4 text-gray-900">
            왜 필요한가요?
          </h2>
          <p className="text-xl text-center text-gray-600 mb-16">
            학원 관리자의 시간을 절약하는 핵심 기능
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border-0">
              <div className="relative h-48">
                <PexelsImage 
                  query="students group"
                  className="w-full h-full object-cover"
                  alt="학생 관리"
                />
              </div>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Users className="w-8 h-8 text-emerald-600" />
                  <h3 className="text-xl font-bold text-gray-900">학생 관리</h3>
                </div>
                <p className="text-gray-600">
                  학생 정보와 월 정액 수강료를 간편하게 등록하고 관리하세요
                </p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border-0">
              <div className="relative h-48">
                <PexelsImage 
                  query="calendar schedule"
                  className="w-full h-full object-cover"
                  alt="출결 관리"
                />
              </div>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Calendar className="w-8 h-8 text-blue-600" />
                  <h3 className="text-xl font-bold text-gray-900">출결 입력</h3>
                </div>
                <p className="text-gray-600">
                  출석, 결석, 유계결석을 달력에서 직관적으로 기록하세요
                </p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border-0">
              <div className="relative h-48">
                <PexelsImage 
                  query="calculator finance"
                  className="w-full h-full object-cover"
                  alt="자동 계산"
                />
              </div>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Calculator className="w-8 h-8 text-violet-600" />
                  <h3 className="text-xl font-bold text-gray-900">자동 계산</h3>
                </div>
                <p className="text-gray-600">
                  유계결석 차감 금액이 자동으로 계산되어 정확한 청구액을 확인하세요
                </p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border-0">
              <div className="relative h-48">
                <PexelsImage 
                  query="invoice document"
                  className="w-full h-full object-cover"
                  alt="청구서 발행"
                />
              </div>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <FileText className="w-8 h-8 text-orange-600" />
                  <h3 className="text-xl font-bold text-gray-900">청구서 발행</h3>
                </div>
                <p className="text-gray-600">
                  청구서 텍스트를 자동 생성하여 문자로 바로 발송하세요
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-5xl font-bold text-center mb-4 text-gray-900">
            어떻게 사용하나요?
          </h2>
          <p className="text-xl text-center text-gray-600 mb-16">
            3단계로 끝나는 간단한 프로세스
          </p>

          <div className="space-y-8">
            <div className="flex items-start gap-6 backdrop-blur-lg bg-white/90 p-8 rounded-2xl shadow-xl border border-gray-100">
              <div className="flex-shrink-0 w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center text-xl font-bold">
                1
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2 text-gray-900">학생 등록 및 수강료 설정</h3>
                <p className="text-gray-600 text-lg">
                  학생 이름, 연락처, 월 정액 수강료를 입력하여 등록합니다
                </p>
              </div>
            </div>

            <div className="flex items-start gap-6 backdrop-blur-lg bg-white/90 p-8 rounded-2xl shadow-xl border border-gray-100">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold">
                2
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2 text-gray-900">출결 상태 입력</h3>
                <p className="text-gray-600 text-lg">
                  달력에서 날짜를 선택하고 출석/결석/유계결석을 기록합니다
                </p>
              </div>
            </div>

            <div className="flex items-start gap-6 backdrop-blur-lg bg-white/90 p-8 rounded-2xl shadow-xl border border-gray-100">
              <div className="flex-shrink-0 w-12 h-12 bg-violet-600 text-white rounded-full flex items-center justify-center text-xl font-bold">
                3
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2 text-gray-900">청구서 확인 및 발행</h3>
                <p className="text-gray-600 text-lg">
                  자동 계산된 최종 청구액을 확인하고 청구서를 발행합니다
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 overflow-hidden">
        <PexelsImage 
          query="education success"
          className="absolute inset-0 w-full h-full object-cover"
          alt="시작하기"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/90 to-blue-900/90" />
        
        <div className="relative z-10 text-center px-4">
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
            지금 바로 시작하세요
          </h2>
          <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto">
            복잡한 수강료 계산, 이제 자동으로 해결하세요
          </p>
          
          <SignedOut>
            <SignInButton>
              <Button 
                size="lg" 
                className="text-lg px-12 py-7 bg-white text-emerald-600 hover:bg-gray-100 shadow-2xl hover:scale-105 transition-all duration-300"
              >
                무료로 시작하기
              </Button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <Link href="/students">
              <Button 
                size="lg" 
                className="text-lg px-12 py-7 bg-white text-emerald-600 hover:bg-gray-100 shadow-2xl hover:scale-105 transition-all duration-300"
              >
                대시보드로 이동
              </Button>
            </Link>
          </SignedIn>
        </div>
      </section>
    </div>
  )
}
