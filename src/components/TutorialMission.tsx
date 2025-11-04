  'use client';

  import { useState, useEffect } from 'react';
  import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
  import { Button } from '@/components/ui/button';
  import { X, Minimize2 } from 'lucide-react';

  /**
   * 튜토리얼 미션 타입
   */
  interface Mission {
    title: string;
    steps: string[];
    question: string | null;
  }

  /**
   * 튜토리얼 미션 설정
   * 
   * 프로젝트의 핵심 User Journey를 3-4단계 미션으로 구성하세요.
   * 각 미션은 친절한 단계별 지시사항으로 작성합니다.
   */
const missions: Mission[] = [
  {
    title: "1단계: 반 생성하기",
    steps: [
      "상단 메뉴에서 '반 관리' 버튼을 찾아주세요.",
      "우측 상단의 '반 추가' 버튼을 눌러주세요.",
      "반 이름을 입력해주세요. (예: 중등부 A반)",
      "월 수강료를 입력해주세요. (예: 300000)",
      "모든 정보를 입력하셨나요? 하단의 '추가' 버튼을 눌러주세요.",
      "반이 목록에 추가되었는지 확인해주세요.",
      "방금 생성한 반을 클릭하여 상세 페이지로 이동해주세요."
    ],
    question: "반 생성을 완료하셨나요?"
  },
  {
    title: "2단계: 학생 등록 및 반 배정하기",
    steps: [
      "상단 메뉴에서 '학생 관리' 버튼을 눌러주세요.",
      "우측 상단의 '학생 추가' 버튼을 눌러주세요.",
      "학생 이름을 입력해주세요. (예: 홍길동)",
      "연락처를 입력해주세요. 형식: 010-XXXX-XXXX (예: 010-1234-5678)",
      "소속 반을 선택해주세요. 방금 생성한 반을 체크해주세요.",
      "한 학생은 여러 반에 동시에 소속될 수 있어요!",
      "하단의 '추가' 버튼을 눌러주세요.",
      "학생이 목록에 추가되고 소속 반이 표시되는지 확인해주세요."
    ],
    question: "학생 등록 및 반 배정을 완료하셨나요?"
  },
  {
    title: "3단계: 월별 수업일수 설정하기",
    steps: [
      "상단 메뉴에서 '반 관리'로 돌아가주세요.",
      "방금 생성한 반을 클릭하여 상세 페이지로 이동해주세요.",
      "'월별 수업일수' 카드에서 연도와 월을 선택해주세요.",
      "해당 월의 총 수업일수를 입력해주세요. (예: 20)",
      "'저장' 버튼을 눌러주세요.",
      "이 정보는 유계결석 차감액을 자동 계산하는 데 사용됩니다!",
      "저장된 수업일수가 하단 목록에 표시되는지 확인해주세요."
    ],
    question: "월별 수업일수 설정을 완료하셨나요?"
  },
  {
    title: "4단계: 출결 입력하기",
    steps: [
      "상단 메뉴에서 '출결 입력' 버튼을 눌러주세요.",
      "날짜를 선택해주세요. 방금 수업일수를 설정한 월의 날짜를 선택하세요.",
      "선택한 날짜에 수업이 있는 반들이 아코디언으로 표시됩니다.",
      "반을 펼치면 해당 반에 소속된 학생들이 나타납니다.",
      "학생별로 출석, 결석, 유계결석 중 하나를 선택해주세요.",
      "유계결석을 선택하면 '반 수강료 ÷ 월 수업일수'로 차감액이 자동 계산됩니다!",
      "자동 계산된 차감액을 직접 수정할 수도 있어요.",
      "모든 출결 상태를 입력한 후 '저장' 버튼을 눌러주세요."
    ],
    question: "출결 입력을 체험해보셨나요?"
  },
  {
    title: "5단계: 청구서 확인 및 발행하기",
    steps: [
      "상단 메뉴에서 '청구 관리' 버튼을 눌러주세요.",
      "연도와 월을 선택하면 해당 월의 모든 학생 청구 내역이 계산됩니다.",
      "각 학생의 소속 반, 출석/결석/유계결석 일수를 확인해주세요.",
      "정액 수강료(모든 반 수강료 합계)와 유계결석 차감액을 확인하세요.",
      "최종 청구액 = 정액 수강료 - 총 차감액으로 자동 계산됩니다!",
      "학생 행의 우측에 있는 '상세보기' 버튼을 눌러보세요.",
      "유계결석 상세 내역에서 날짜, 반, 차감 금액을 확인할 수 있어요.",
      "다이얼로그를 닫고, '청구서 발행' 버튼을 눌러주세요.",
      "청구서 텍스트가 미리보기로 표시되고, '복사하기' 버튼으로 복사할 수 있어요!",
      "청구서 발행 후 '발행완료' 상태가 표시되는지 확인하세요."
    ],
    question: "청구서까지 확인하고 발행해보셨나요?"
  },
  {
    title: "🎉 튜토리얼 완료!",
    steps: [
      "축하합니다! 학원 수강료 계산 시스템의 모든 핵심 기능을 체험하셨어요.",
      "이제 실제 반과 학생들을 등록하고 관리해보세요.",
      "한 학생이 여러 반에 소속될 수 있고, 수강료는 자동으로 합산됩니다.",
      "월별로 각 반의 수업일수를 설정하면 유계결석 차감액이 자동 계산됩니다.",
      "출결을 입력하면 실시간으로 청구 금액이 계산되어 청구 관리에서 확인할 수 있어요.",
      "매달 청구서를 발행해서 학부모님께 문자나 카카오톡으로 보내실 수 있습니다!",
      "궁금한 점이 있으면 언제든 우측 하단의 🥝 키위 버튼을 눌러주세요!"
    ],
    question: null
  }
];

  export function TutorialMission() {
    const [currentMission, setCurrentMission] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);

    useEffect(() => {
      const completed = localStorage.getItem('tutorial-completed');
      // missions가 비어있으면 튜토리얼을 표시하지 않음
      if (!completed && missions.length > 0) {
        setIsVisible(true);
      }
    }, []);

    // Production 환경에서는 표시하지 않음
    if (process.env.NODE_ENV === 'production') {
      return null;
    }

    const handleYes = () => {
      if (currentMission < missions.length - 1) {
        setCurrentMission(currentMission + 1);
      } else {
        localStorage.setItem('tutorial-completed', 'true');
        setIsVisible(false);
      }
    };

    const handleNo = () => {
      // 같은 미션 반복 (사용자가 다시 읽을 수 있도록)
    };

    const handleSkip = () => {
      localStorage.setItem('tutorial-completed', 'true');
      setIsVisible(false);
    };

    // missions가 비어있거나 표시하지 않을 때 null 반환
    if (!isVisible || missions.length === 0) return null;

    const mission = missions[currentMission];
    const isLastMission = currentMission === missions.length - 1;

    // 최소화된 상태
    if (isMinimized) {
      return (
        <button
          onClick={() => setIsMinimized(false)}
          className="fixed bottom-6 left-6 z-50 bg-gradient-to-r from-blue-600 to-violet-600 text-white px-5 py-3 rounded-full shadow-2xl hover:shadow-blue-500/50 transition-all hover:scale-105 flex items-center gap-2 font-semibold"
        >
          📖 튜토리얼 진행중 ({currentMission + 1}/{missions.length})
        </button>
      );
    }

    // 전체 카드
    return (
      <div className="fixed bottom-6 left-6 z-50 max-w-md animate-in slide-in-from-bottom-4 duration-300">
        <Card className="shadow-2xl border-2 border-blue-500 bg-white">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-bold text-gray-900">
                {mission.title}
              </CardTitle>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMinimized(true)}
                  className="h-6 w-6 hover:bg-gray-100"
                  title="최소화"
                >
                  <Minimize2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleSkip}
                  className="h-6 w-6 hover:bg-gray-100"
                  title="튜토리얼 건너뛰기"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {mission.steps.map((step, index) => (
                <div key={index} className="flex gap-3">
                  <span className="text-blue-600 font-bold text-sm flex-shrink-0 mt-0.5">
                    {index + 1}.
                  </span>
                  <p className="text-sm text-gray-700 leading-relaxed">{step}</p>
                </div>
              ))}
            </div>

            {mission.question && (
              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm font-semibold text-gray-900 mb-3">
                  {mission.question}
                </p>
                <div className="flex gap-2">
                  <Button 
                    onClick={handleYes} 
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    네, 완료했어요! ✓
                  </Button>
                  <Button 
                    onClick={handleNo} 
                    variant="outline" 
                    className="flex-1 border-gray-300"
                  >
                    아니요, 다시 볼게요
                  </Button>
                </div>
              </div>
            )}

            {isLastMission && (
              <Button 
                onClick={handleYes} 
                className="w-full bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700" 
                size="lg"
              >
                튜토리얼 종료하기 🎓
              </Button>
            )}

            <div className="flex items-center justify-between text-xs text-gray-500 pt-2">
              <span className="font-medium">
                {currentMission + 1} / {missions.length}
              </span>
              <Button 
                variant="link" 
                size="sm" 
                onClick={handleSkip}
                className="text-gray-500 hover:text-gray-700"
              >
                건너뛰기
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

