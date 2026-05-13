export const getToday = (): string => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

export const formatDate = (dateString: string): string => {
  const d = new Date(dateString);
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  return `${d.getMonth() + 1}월 ${d.getDate()}일 ${days[d.getDay()]}요일`;
};

export const getPreviousMonth = (year: number, month: number) => {
  if (month === 1) return { year: year - 1, month: 12 };
  return { year, month: month + 1 };
};

export const getNextMonth = (year: number, month: number) => {
  if (month === 12) return { year: year + 1, month: 1 };
  return { year, month: month + 1 };
};

export const getMonthStartEnd = (year: number, month: number) => {
  const end = new Date(year, month, 0);
  const pad = (n: number) => String(n).padStart(2, '0');

  return {
    start: `${year}-${pad(month)}-01`,
    end: `${year}-${pad(month)}-${pad(end.getDate())}`,
  };
};
