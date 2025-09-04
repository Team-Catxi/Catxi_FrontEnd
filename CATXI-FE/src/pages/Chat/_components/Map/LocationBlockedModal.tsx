import NoLocationIcon from "../../../../assets/icons/NoLocationIcon.svg?react";

interface LocationBlockedModalProps {
  onConfirm: () => void;
}

const LocationBlockedModal = ({ onConfirm }: LocationBlockedModalProps) => {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-500">
      <div className="bg-white rounded-[10px] p-5 flex flex-col items-center w-[min(100%,220px)]">
        <div className="mb-1">
          <NoLocationIcon />
        </div>

        <h2 className="text-[1.125rem] font-medium text-[#424242]">
          위치보기 불가
        </h2>

        <div className="w-full border-t border-[#E0E0E0] my-3" />

        <p className="text-[0.875rem] text-[#424242] mb-1 text-center">
          <span className="font-semibold">준비완료된 상태</span>에서만
        </p>
        <p className="text-[0.875rem] text-[#424242] mb-3.5 text-center">
          멤버의 위치보기가 가능합니다.
        </p>

        <button
          onClick={onConfirm}
          className="w-full py-2 bg-[#424242] text-white rounded-[5px] font-medium text-[0.875rem]"
        >
          확인
        </button>
      </div>
    </div>
  );
};

export default LocationBlockedModal;
