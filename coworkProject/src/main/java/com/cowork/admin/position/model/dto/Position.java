package com.cowork.admin.position.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Position {
	private int indexNo;
	private int positionNo;
	private String positionNm;
	private int level;
	private int comNo;
	
	private int levelTemp;
}
