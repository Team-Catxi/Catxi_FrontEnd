interface LocationBlockedModalProps {
  onConfirm: () => void;
}

const LocationBlockedModal = ({ onConfirm }: LocationBlockedModalProps) => {
  return (
    <div className="text-center">
      <h2 className="text-[1.125rem] font-semibold mb-2">위치보기 불가</h2>
      <p className="font-medium text-[1.125rem] text-[#424242] mb-1">
        준비완료된 상태에서만 
      </p>
      <p className="text-medium text-[1.125rem] text-[#424242]">
        멤버의 위치보기가 가능합니다.
      </p>
      <button
        onClick={onConfirm}
        className="w-full bg-[#424242] text-white rounded-[0.5rem]"
      >
        확인
      </button>
    </div>
  );
};

export default LocationBlockedModal;
