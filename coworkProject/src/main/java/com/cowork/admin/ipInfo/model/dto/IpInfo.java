package com.cowork.admin.ipInfo.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@ToString
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Builder
@Setter
public class IpInfo {

	private int comNo;
	private int empCode;
	private String empLastName;
	private String empFirstName;
	private int teamNo;
	private String teamNm;
	private int ipNo;
	private String ip;
	private int deptNo;
	private String deptNm;
	
	private String fullName;
	private String affiliation;
}
