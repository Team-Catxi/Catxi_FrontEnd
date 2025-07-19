export const statusTextMap = {
  WAITING: '모집중',
  READY_LOCKED: '준비 완료',
  MATCHED: '매칭 완료',
  EXPIRED: '만료됨',
} as const;

export const statusColorMap = {
  WAITING: '#7424F5',
  READY_LOCKED: '#08ACFF',
  MATCHED: '#1AD494',
  EXPIRED: '#D1D5DB',
} as const;
