import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom'; 

interface Props {
  departAt: string;
}

const ReadyLockedBox = ({ departAt }: Props) => {
  const navigate = useNavigate();
  const departDate = useMemo(() => new Date(departAt), [departAt]);

  const [remainingSec, setRemainingSec] = useState(() =>
    Math.max(Math.floor((departDate.getTime() - Date.now()) / 1000), 0)
  );

  useEffect(() => {
    if (remainingSec === 0) {
      navigate('/home');
    }
  }, [remainingSec, navigate]);

  useEffect(() => {
    if (remainingSec > 60) return;

    const timer = setInterval(() => {
      setRemainingSec((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [remainingSec]);

  const { formattedTime, remainText, isUrgent } = useMemo(() => {
    const hour = departDate.getHours().toString().padStart(2, '0');
    const minute = departDate.getMinutes().toString().padStart(2, '0');
    const formatted = `${hour}시 ${minute}분 출발`;

    const remainMin = Math.floor(remainingSec / 60);
    const remainText = remainingSec <= 60
      ? `${remainingSec}초`
      : `${remainMin}분`;

    const isUrgent = remainingSec <= 600;

    return {
      formattedTime: formatted,
      remainText,
      isUrgent,
    };
  }, [departDate, remainingSec]);

  return (
    <div className="w-full bg-[#7424F5] px-[1.625rem] py-[0.875rem] flex justify-between items-center mb-5">
      <div>
        <p className="text-[1.25rem] font-semibold text-[#FAFAFA]">{formattedTime}</p>
        <p className="text-[0.875rem] font-medium text-[#E6D8FF]">위 시간까지 장소로 모여주세요!</p>
      </div>
      <div className="px-4 py-2 text-center">
        <p className="text-[0.75rem] font-regular text-[#F5F5F5]">남은 시간</p>
        <p
          className="text-[1.25rem] font-medium"
          style={{ color: isUrgent ? '#FF5252' : '#FAFAFA' }}
        >
          {remainText}
        </p>
      </div>
    </div>
  );
};

export default ReadyLockedBox;
