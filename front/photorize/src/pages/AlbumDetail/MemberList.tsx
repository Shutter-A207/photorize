import React from "react";

interface MemberData {
  memberId: number;
  nickname: string;
  img: string;
  status: boolean;
}

interface MemberListProps {
  members: MemberData[];
  onMemberClick: (member: MemberData) => void;
}

const MemberList: React.FC<MemberListProps> = ({ members, onMemberClick }) => {
  if (members.length <= 1) return null; // 멤버가 1명 이하인 경우는 표시 안 함

  return (
    <>
      <div
        className="flex overflow-x-auto scrollbar-hide"
        style={{
          maxWidth: "100%",
          paddingBottom: "8px",
        }}
      >
        <div className="flex space-x-4">
          {members.map((member) => (
            <div
              key={member.memberId}
              className={`flex flex-col items-center w-[60px] flex-shrink-0 ${
                !member.status ? "opacity-40" : ""
              }`}
              onClick={() => onMemberClick(member)}
            >
              <img
                src={member.img}
                alt={member.nickname}
                className="w-12 h-12 rounded-full object-cover cursor-pointer"
              />
              <p className="text-sm mt-1 font-bold text-[#343434] text-center truncate">
                {member.nickname}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-gray-200 mt-2 mb-6"></div>
    </>
  );
};

export default MemberList;
