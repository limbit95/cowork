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
}
