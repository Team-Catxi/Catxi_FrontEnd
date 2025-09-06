import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createChat } from "../../apis/createChat";
import type { createChatRequest, createChatResponse } from "../../types/createChat";
import { useChatStore } from "../../store/createChatStore";
import { queryClient } from "../../App";

export const useCreateChat = () => {
  const navigate = useNavigate();
  const { clearAnswer } = useChatStore();

  const { mutate: createChatRoom } = useMutation<
    createChatResponse,           
    { message: string },           
    createChatRequest            
  >({
    mutationKey: ["createChat"],
    mutationFn: createChat,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["chatRooms"] });

      const roomId = res.data.roomId;
      console.log("생성된 roomId:", roomId);

      clearAnswer();
      navigate("/home");
    },
    onError: (err) => {
      const confirmed = window.confirm(err.message);
      if (confirmed) navigate("/home");
    },
  });

  return {
    createChatRoom,
  };
};
