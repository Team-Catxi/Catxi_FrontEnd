interface UserMessageItemProps {
  content: string;
}

const UserSystemMessageItem = ({ content }: UserMessageItemProps) => {
  return (
    <div className="w-full text-center text-[0.75rem] text-[#424242] px-4">
      {content}
    </div>
  );
};

export default UserSystemMessageItem;
