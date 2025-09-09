import { useModal } from "../../../contexts/ModalContext";

interface Props {
  onConfirm: () => void;
}

const DeleteUserConfirmModal = ({ onConfirm }: Props) => {
  const { closeModal } = useModal();

  return (
    <div className="z-[1000]">
      <h2 className="text-xl font-bold">회원 탈퇴</h2>
      <p className="text-md mt-2 text-red-600">
        회원탈퇴를 하실 경우 더 이상 CATXI를 사용하실 수 없습니다.
      </p>
      <div className="flex w-full gap-[1.25rem] mt-4">
        <button
          onClick={closeModal}
          className="flex-1 px-[2rem] py-2 text-white bg-[#424242] rounded-lg"
        >
          아니오
        </button>
        <button
          onClick={() => {
            onConfirm();
            closeModal();
          }}
          className="flex-1 bg-red-600 text-white py-2 rounded-lg"
        >
          예
        </button>
      </div>
    </div>
  );
};

export default DeleteUserConfirmModal;
