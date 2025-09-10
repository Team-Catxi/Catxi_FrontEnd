import ArrowUpLight from "../../../../../assets/icons/arrow-up-light.svg?react";

interface BackBtnProps {
  onClose: () => void;
}

export default function BackBtn({ onClose }: BackBtnProps) {
  return (
    <div
      className={` pointer-events-auto w-[2.625rem] h-[2.625rem] shadow-2xs flex justify-center items-center bg-white rounded-full`}
      onClick={onClose}
    >
      <ArrowUpLight className="w-[1.875rem] h-[1.875rem] " />
    </div>
  );
}
