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
	private String approverFlage;
	private int empCode;
	private String progeressFlage;
	private String approveFlage;
	private int edsmNo;
}
