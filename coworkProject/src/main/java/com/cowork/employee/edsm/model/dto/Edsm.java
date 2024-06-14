package com.cowork.employee.edsm.model.dto;

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
public class Edsm {
	private int edsmNo;
	private String edsmTitle;
	private String edsmContent;
	private String edsmWriteDate;
	private String edsmDelFl;
	private int empCode;
	private String edsmFlag;
	private int draftNo;
	
	private String draftFlag;    // 양식 번호
	private String draftNm;      // 양식 종류
	private int approverCode;    // 결재자 번호
	private String approverName; // 결재자 명
	private String positionNm;   // 직급
	private int fileCnt;         // 파일개수
	private String empName;      // 신청자
	
}
