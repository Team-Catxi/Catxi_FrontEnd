import { useModal } from "../../../contexts/ModalContext";

interface Props {
  onConfirm: () => void;
}

const LogoutConfirmModal = ({ onConfirm }: Props) => {
  const { closeModal } = useModal();

  return (
    <div className="z-[1000]">
      <h2 className="text-lg font-bold">로그아웃</h2>
      <p className="text-md mt-2">정말 로그아웃하시겠습니까?</p>
      <div className="flex w-full gap-[1.25rem] mt-4">
        <button
          onClick={closeModal}
          className="flex-1 px-5 py-2 text-[#424242] bg-[#F5F5F5] rounded-lg"
        >
          아니오
        </button>
        <button
          onClick={() => {
            onConfirm();
            closeModal();
          }}
          className="flex-1 bg-[#424242] text-[#FAFAFA] px-5 py-2 rounded-lg"
        >
          예
        </button>
      </div>
    </div>
  );
};

export default LogoutConfirmModal;
