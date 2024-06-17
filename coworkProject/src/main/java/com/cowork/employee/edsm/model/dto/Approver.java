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
public class Approver {
	private int approverNo;
	private String approverFlag;
	private int empCode;
	private String progressFlag;
	private String approveFlag;
	private int edsmNo;
	private String rejected;
	
	private String approverName; /* 결재자 & 참조자 명 */
	private String positionNm; /* 직급 */
	private int rowNum; /* 결재순서 */
	
}
