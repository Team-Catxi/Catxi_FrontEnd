interface UserMessageItemProps {
  content: string;
}

const UserMessageItem = ({ content }: UserMessageItemProps) => {
  return (
    <div className="w-full text-center text-[12px] text-gray-400 px-4">
      <p className="bg-[#F2F6FC] text-gray-600 py-2 px-3 rounded-[5px] inline-block">
        {content}
      </p>
    </div>
  );
};

export default UserMessageItem;
