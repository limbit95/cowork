package com.cowork.employee.teamBoard.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Builder
@ToString
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class Comment {
	
	private int commentNo;
	private String commentContent;
	private String commentWriteDate;
	private String commentDelFl;
	private int parentCommentNo;
	private int teamBoardNo;
	private int empCode;
	
	private String empName; // 사원명
	private String profileImg; // 프로필 이미지
	private String empNameTo; // 댓글 답변 To 사원명
	private String parentCommentDelFl; // 부모 댓글 삭제 여부
}
