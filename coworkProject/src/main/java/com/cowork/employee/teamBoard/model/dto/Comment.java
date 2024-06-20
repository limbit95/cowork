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
}
