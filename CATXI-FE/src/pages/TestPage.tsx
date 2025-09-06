import MemberItem from "./Chat/_components/Map/_components/MemberItem";

//TODO: 지도 컴포넌트로 교체 예정

const TestPage = () => {
  return (
    <div className="absolute inset-0 bg-gray-50 z-50 flex flex-col items-center justify-center">
      <p className="text-gray-700 text-lg font-medium">현재 Room ID:</p>

      <div className="p-[1.625rem]">
        <MemberItem roomId={0} />
      </div>
    </div>
  );
};

export default TestPage;
