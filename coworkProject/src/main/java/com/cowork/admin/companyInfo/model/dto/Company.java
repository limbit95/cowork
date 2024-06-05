package com.cowork.admin.companyInfo.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@ToString
@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
@Builder
public class Company {

	private int comNo;
	private String comNm;
	private String comTel;
	private String licenseNo;
	private String ceoNm;
	private String comAddr;
	private String comLogo;
	private String licenseImg;
	private String comEmail;
	private String domain;
}
