package com.cowork.admin.companyInfo.model.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@ToString
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
public class Department {
	private int deptNo;
	private String deptNm;
	private int comNo;
	
	private List<Team> teamList;
}
