package com.cowork.employee.notice.model.dto;

import java.util.List;

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
public class Notice {
	
	// Notice 테이블 컬럼
	private int noticeNo;
	private String noticeTitle;
	private String noticeContent;
	private String noticeWriteDate;
	private String noticeUpdateDate;
	private String noticeDelFl;
	private int empCode;
	
	private String empName; // 작성자
	private String deptNm;  // 부서명
	private int fileCnt; // 파일개수
	//private List<BoardFile> fileList; // 파일목록
}
