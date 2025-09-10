import arrowUpLight from "../../../../assets/icons/arrow-up-light.svg";

interface BackBtnProps {
  onClose: () => void;
}

export default function BackBtn({ onClose }: BackBtnProps) {
  return (
    <div
      className={` pointer-events-auto w-[2.625rem] h-[2.625rem] shadow-2xs flex justify-center items-center bg-white rounded-full`}
      onClick={onClose}
    >
      <img
        src={arrowUpLight}
        alt="뒤로가기 아이콘"
        className="w-[1.875rem] h-[1.875rem]"
      />
    </div>
  );
}
