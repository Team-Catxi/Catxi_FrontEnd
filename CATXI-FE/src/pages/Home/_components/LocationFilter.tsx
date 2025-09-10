import React from "react";
import NotificationToggle from "./NotificationToggle"; 

interface Props {
  station: string | null;
  sort: "departAt" | "createdTime";
  onSelectLocation: (loc: string) => void;
  onSelectSort: (sort: "departAt" | "createdTime") => void;
}

const locations = ["ALL", "YEOKGOK_ST", "SOSA_ST"];
const locationDisplayMap: Record<string, string> = {
  ALL: "전체",
  YEOKGOK_ST: "역곡역",
  SOSA_ST: "소사역",
};

const LocationFilter: React.FC<Props> = ({
  station,
  sort,
  onSelectLocation,
  onSelectSort,
}) => {
  return (
    <div className="px-[1.5rem] mt-[1.125rem] flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <div className="flex gap-[0.5rem]">
          {locations.map((loc) => (
            <button
              key={loc}
              className={`px-[0.625rem] py-[0.313rem] rounded-[30px] font-medium text-[0.875rem] leading-[17px] ${
                (station ?? "SOSA_ST") === loc
                  ? "bg-[#7424F5] text-white"
                  : "bg-[#F1F1F1] text-[#9E9E9E]"
              }`}
              onClick={() => onSelectLocation(loc)}
            >
              {locationDisplayMap[loc]}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <NotificationToggle />
        </div>
      </div>

      <div className="flex items-center gap-[0.5rem] px-1">
        <span
          className={`text-[14px] cursor-pointer ${
            sort === "departAt" ? "text-black font-medium" : "text-[#9E9E9E]"
          }`}
          onClick={() => onSelectSort("departAt")}
        >
          출발순
        </span>
        <div className="w-[1px] h-[8px] bg-[#E0E0E0]"></div>
        <span
          className={`text-[14px] cursor-pointer ${
            sort === "createdTime" ? "text-black font-bold" : "text-[#9E9E9E]"
          }`}
          onClick={() => onSelectSort("createdTime")}
        >
          생성순
        </span>
      </div>
    </div>
  );
};

export default LocationFilter;
