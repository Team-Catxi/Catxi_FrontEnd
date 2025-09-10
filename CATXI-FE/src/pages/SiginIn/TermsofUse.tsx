import React, { useEffect, useMemo, useState } from "react";

type TermKey = "tos" | "privacy" | "location" | "minor";

interface TermItem {
  key: TermKey;
  title: string;
  required: boolean;
}

interface TermsofUseProps {
  onValidityChange?: (allRequiredChecked: boolean) => void;
  className?: string;
}

const TermsofUse: React.FC<TermsofUseProps> = ({
  onValidityChange,
  className = "",
}) => {
  const terms: TermItem[] = useMemo(
    () => [
      { key: "tos", title: "[필수] 이용약관 동의", required: true },
      {
        key: "privacy",
        title: "[필수] 개인정보 처리방침 동의",
        required: true,
      },
      {
        key: "location",
        title: "[필수] 실시간 위치정보 수집·이용 동의",
        required: true,
      },
      {
        key: "minor",
        title: "[필수(해당자)] 만 14세 미만 법정대리인 동의",
        required: true,
      },
    ],
    []
  );

  const [agree, setAgree] = useState<Record<TermKey, boolean>>({
    tos: false,
    privacy: false,
    location: false,
    minor: false,
  });

  const [expanded, setExpanded] = useState<Record<TermKey, boolean>>({
    tos: false,
    privacy: false,
    location: false,
    minor: false,
  });

  const allRequiredChecked = terms
    .filter((t) => t.required)
    .every((t) => agree[t.key]);

  useEffect(() => {
    onValidityChange?.(allRequiredChecked);
  }, [allRequiredChecked, onValidityChange]);

  const toggleAgree = (k: TermKey) =>
    setAgree((prev) => ({ ...prev, [k]: !prev[k] }));
  const toggleExpanded = (k: TermKey) =>
    setExpanded((prev) => ({ ...prev, [k]: !prev[k] }));

  const renderContent = (key: TermKey) => {
    switch (key) {
      case "tos":
        return (
          <article className="text-sm text-[#424242] space-y-2">
            <h3 className="font-semibold">1. 이용약관(요지)</h3>
            <p>
              <strong>목적</strong>: 본 약관은 ‘캣시(Catxi)’(이하 “서비스”)
              이용에 관한 조건과 권리·의무를 규정합니다.
            </p>
            <p>
              <strong>주요 기능</strong>: 캠퍼스 택시 동승 매칭, 실시간 위치
              공유, 채팅.
            </p>
            <p>
              <strong>계정</strong>: 카카오 등 외부 계정 연동으로 가입하며,
              타인의 정보를 도용할 수 없습니다.
            </p>
            <p>
              <strong>이용자의 의무</strong>
            </p>
            <ul className="list-disc pl-5">
              <li>
                불법행위, 타인의 권리 침해, 허위정보 등록, 시스템 부정사용 금지
              </li>
              <li>위치 공유 시 안전에 유의하고, 교통법규 준수</li>
            </ul>
            <p>
              <strong>서비스의 성격 및 면책</strong>
            </p>
            <ul className="list-disc pl-5">
              <li>
                본 서비스는 <strong>이용자 간 매칭/의사소통을 중개</strong>하는
                플랫폼이며, 탑승/이동 과정의 행위 및 결과에 대해서는{" "}
                <strong>직접적 책임을 지지 않습니다</strong>.
              </li>
              <li>
                통신/서버 점검 등으로 <strong>서비스가 일시 중단</strong>될 수
                있습니다.
              </li>
            </ul>
            <p>
              <strong>분쟁 해결</strong>: 분쟁은 서비스의 소재지를 관할하는
              법원에 제기할 수 있습니다.
            </p>
            <p>
              <strong>약관 변경</strong>: 변경 시 7일 전 고지(이용자에게 불리한
              경우 30일).
            </p>
            <p>
              <strong>문의</strong>: 운영자 이메일/연락처 기재.
            </p>
            <p className="text-xs text-[#9E9E9E]">
              버전/시행일: v1.0 / 2025-09-10
            </p>
          </article>
        );
      case "privacy":
        return (
          <article className="text-sm text-[#424242] space-y-2">
            <h3 className="font-semibold">2. 개인정보 처리방침(요지)</h3>
            <p>
              <strong>수집 항목</strong>
            </p>
            <ul className="list-disc pl-5">
              <li>
                가입/로그인: 카카오 프로필 식별자, 닉네임/프로필 이미지(선택),
                이메일(선택)
              </li>
              <li>이용 과정: 채팅 메타, 매칭 이력, 알림 수신 내역</li>
              <li>기기 정보: 앱 버전, OS, 접속 IP, 로그(오류/보안)</li>
              <li>
                위치 기능 사용 시: <strong>실시간 위치정보</strong>
              </li>
            </ul>
            <p>
              <strong>이용 목적</strong>: 회원 식별/인증, 매칭/채팅 제공,
              부정이용 방지, 안정화, 고객지원
            </p>
            <p>
              <strong>보유·파기</strong>
            </p>
            <ul className="list-disc pl-5">
              <li>계정: 탈퇴 시 파기(법령 예외 제외)</li>
              <li>로그/보안기록: 최대 ○일 보관 후 파기</li>
              <li>백업: 주기적 순환 삭제</li>
            </ul>
            <p>
              <strong>처리위탁/제3자 제공</strong>: (해당 시) 위탁사·업무·이전
              국가 명시
            </p>
            <p>
              <strong>이용자 권리</strong>: 열람·정정·삭제·처리정지, 동의 철회 /
              문의처 기재
            </p>
            <p className="text-xs text-[#9E9E9E]">
              버전/시행일: v1.0 / 2025-09-10
            </p>
          </article>
        );
      case "location":
        return (
          <article className="text-sm text-[#424242] space-y-2">
            <h3 className="font-semibold">
              3. 실시간 위치정보 수집·이용 동의(요지)
            </h3>
            <p>
              <strong>목적</strong>: 매칭 정확도 향상, 이동 중 안전 확인, 경로
              기반 기능 제공
            </p>
            <p>
              <strong>수집 항목</strong>: 위치좌표(위/경도), 수집 시각,
              정밀도(가능 시)
            </p>
            <p>
              <strong>제공 범위</strong>: 동일 매칭/채팅방 참여자에게만 실시간
              공유(법령/긴급 구조 예외)
            </p>
            <p>
              <strong>보관·파기</strong>: 목적 달성 시 즉시 또는 단시간(예: 최대
              ○분) 보관 후 파기 / 보안 로그 최소 보관
            </p>
            <p>
              <strong>동의 철회</strong>: 설정 위치 공유 끄기(일부 기능 제한
              가능)
            </p>
            <p className="text-xs text-[#9E9E9E]">
              버전/시행일: v1.0 / 2025-09-10
            </p>
          </article>
        );
      case "minor":
        return (
          <article className="text-sm text-[#424242] space-y-2">
            <h3 className="font-semibold">
              4. 만 14세 미만 법정대리인 동의(요지)
            </h3>
            <p>
              <strong>대상</strong>: 가입자가 만 14세 미만인 경우
            </p>
            <p>
              <strong>내용</strong>: 법정대리인은 아동의 서비스 이용 및
              개인정보(필수 항목·위치정보 등) 수집·이용에 <strong>동의</strong>
              합니다.
            </p>
            <p>
              <strong>확인 절차</strong>: 본인확인/동의서 인증 등으로 대리인
              확인
            </p>
            <p>
              <strong>보관</strong>: 동의 이력·식별정보는 법령 허용 최소
              범위에서 ○년 보관 후 파기
            </p>
            <p>
              <strong>철회</strong>: 대리인은 언제든지 동의를 철회할 수 있으며,
              철회 즉시 위치 기능은 중단됩니다.
            </p>
            <p className="text-xs text-[#9E9E9E]">
              버전/시행일: v1.0 / 2025-09-10
            </p>
          </article>
        );
    }
  };

  return (
    <section className={className}>
      <h2 className="text-lg font-semibold text-[#424242] mb-3">이용약관</h2>

      <ol className="space-y-4">
        {/* 1~4 요약 + 전문 보기 + 동의 체크 */}
        {terms.map((t, idx) => {
          const isOpen = expanded[t.key];
          return (
            <li
              key={t.key}
              className="rounded-lg border border-[#E0E0E0] bg-white p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm text-[#9E9E9E]">{idx + 1}.</p>
                  <p className="text-base font-medium text-[#424242] mt-1">
                    {t.title}
                  </p>
                  <ul className="text-sm text-[#616161] list-disc pl-5 mt-2">
                    {t.key === "tos" && (
                      <>
                        <li>
                          서비스 이용조건, 금지행위, 면책 및 분쟁 처리에
                          동의합니다.
                        </li>
                        <li>전문 보기</li>
                      </>
                    )}
                    {t.key === "privacy" && (
                      <>
                        <li>
                          수집항목, 이용목적, 보유기간, 파기 및 이용자 권리에
                          대해 확인·동의합니다.
                        </li>
                        <li>전문 보기</li>
                      </>
                    )}
                    {t.key === "location" && (
                      <>
                        <li>
                          매칭/탑승 안전을 위해 위치정보를 수집·이용·저장하는
                          것에 동의합니다.
                        </li>
                        <li>전문 보기</li>
                      </>
                    )}
                    {t.key === "minor" && (
                      <>
                        <li>
                          이용자는 만 14세 미만이며, 법정대리인의 동의를
                          받았습니다.
                        </li>
                        <li>전문 보기</li>
                      </>
                    )}
                  </ul>
                </div>

                <div className="flex flex-col items-end gap-2 shrink-0">
                  <button
                    type="button"
                    className="text-sm underline text-[#8C46F6] hover:opacity-80"
                    aria-expanded={isOpen}
                    onClick={() => toggleExpanded(t.key)}
                  >
                    {isOpen ? "접기" : "전문 보기"}
                  </button>
                  <label className="inline-flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-[#8C46F6] focus:ring-[#8C46F6]"
                      checked={agree[t.key]}
                      onChange={() => toggleAgree(t.key)}
                    />
                    <span>동의</span>
                  </label>
                </div>
              </div>

              {isOpen && (
                <div className="mt-3 rounded-md bg-[#FAFAFA] border border-[#EEEEEE] p-3">
                  {renderContent(t.key)}
                </div>
              )}
            </li>
          );
        })}
      </ol>

      {/* 전체 동의/해제 */}
      <div className="mt-3">
        <button
          type="button"
          className="text-sm underline text-[#8C46F6] hover:opacity-80"
          onClick={() => {
            const allOn = terms.every((t) => agree[t.key]);
            const next: Record<TermKey, boolean> = { ...agree };
            terms.forEach((t) => (next[t.key] = !allOn));
            setAgree(next);
          }}
        >
          {terms.every((t) => agree[t.key]) ? "전체 해제" : "전체 동의"}
        </button>
      </div>
    </section>
  );
};

export default TermsofUse;
