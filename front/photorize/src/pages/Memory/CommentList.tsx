import React from "react";
import { CommentType } from "./useMemory";

interface CommentListProps {
  comments: CommentType[];
  nickname: string; // 현재 로그인 사용자 닉네임
  lastCommentRef: (node: HTMLDivElement | null) => void;
  formatDate: (date: string) => string;
  onDeleteClick: (commentId: number) => void;
}

const CommentList: React.FC<CommentListProps> = ({
  comments,
  nickname,
  lastCommentRef,
  formatDate,
  onDeleteClick,
}) => {
  return (
    <div className="p-3">
      {comments.map((comment, index) => {
        const isLastComment = index === comments.length - 1;
        return (
          <div
            key={comment.commentId}
            ref={isLastComment ? lastCommentRef : null}
            className="flex items-start mb-4"
          >
            <img
              src={comment.writerImg}
              alt={comment.nickname}
              className="w-12 h-12 rounded-full object-cover mr-3 mt-3"
            />
            <div>
              <p className="text-sm font-bold text-[#343434] mb-1">
                {comment.nickname}
              </p>
              <div
                className="bg-[#FFFFFF] border border-[#FFD2D2] rounded-xl p-2 mb-[1px]"
                style={{ borderRadius: "5px 15px 15px 15px" }}
              >
                <p className="text-sm text-[#343434]">{comment.content}</p>
              </div>
              <div className="flex">
                <p className="text-[10px] text-[#A19791] mr-2">
                  {formatDate(comment.date)}
                </p>
                {comment.nickname === nickname && (
                  <button
                    onClick={() => onDeleteClick(comment.commentId)}
                    className="text-red-500 text-[10px]"
                  >
                    삭제
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CommentList;
