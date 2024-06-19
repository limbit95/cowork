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
public class TeamBoard {
	private int teamBoardNo;
	private String teamBoardTitle;
	private String teamBoardContent;
	private String teamBoardWriteDate;
	private String teamBoardUpdateDate;
	private String teamBoardDelFl;
	private int empCode;
	private int teamNo;
	private String teamFlag;
	
	private String empName;   // 작성자
	private int comNo;        // 회사번호
	private String teamType;  // 팀구분
	private int fileCnt;      // 파일개수
}
