import MemberCard from "./Chat/_components/Map/_components/MemberCard";
//TODO: 지도 컴포넌트로 교체 예정
import LocationItem from "./Chat/_components/Map/_components/LocationItem";

const TestPage = () => {
  return (
    <div className="absolute inset-0 bg-gray-50 z-50 flex flex-col ">
      <p className="text-gray-700 text-lg font-medium">현재 Room ID:</p>

      <div className="p-[1.25rem]">
        <MemberCard />
        <LocationItem
          name="박가나"
          selected={false}
          email="wjdals"
          myEmail="wjdals"
        />
      </div>
    </div>
  );
};

export default TestPage;
