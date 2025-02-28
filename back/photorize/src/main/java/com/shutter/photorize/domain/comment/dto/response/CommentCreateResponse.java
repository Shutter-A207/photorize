package com.shutter.photorize.domain.comment.dto.response;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.shutter.photorize.domain.comment.entity.Comment;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class CommentCreateResponse {
	private Long commentId;
	private String content;
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Seoul")
	private LocalDateTime date;

	@Builder
	public CommentCreateResponse(Long commentId, String content, LocalDateTime date) {
		this.commentId = commentId;
		this.content = content;
		this.date = date;
	}

	public static CommentCreateResponse from(Comment comment) {
		return CommentCreateResponse.builder()
			.commentId(comment.getId())
			.content(comment.getContent())
			.date(comment.getCreatedAt())
			.build();
	}
}
