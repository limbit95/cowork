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
public class DraftKeep {
	
	private int keepNo;
	private int draftNo;
	private int empCode;
	private String keepYn;
}
