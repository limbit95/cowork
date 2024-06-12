package com.cowork.admin.edsm.model.dto;

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
public class Draft {

	private int draftNo;
	private String draftTitle;
	private String draftContent;
	private int comNo;
	private String draftFlag;
	
	private String draftNm; /* 기안서 명칭 */
	private String keepYn; /* 즐겨찾기 여부*/
}
