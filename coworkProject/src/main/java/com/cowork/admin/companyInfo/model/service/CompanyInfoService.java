package com.cowork.admin.companyInfo.model.service;

import org.springframework.web.multipart.MultipartFile;

import com.cowork.admin.companyInfo.model.dto.Company;

public interface CompanyInfoService {

	/** 회사 로고 수정
	 * @param comLogo
	 * @param myCompany
	 * @return result
	 * @throws Exception
	 */
	int companyLogoUpdate(MultipartFile comLogo, Company myCompany) throws Exception;

	/** 회사 정보 수정
	 * @param inputCompany
	 * @param comAddr
	 * @return result
	 */
	int companyInfoUpdate(Company inputCompany, String[] comAddr);

	/** 회사 정보 조회
	 * @param comNo
	 * @return myCompany
	 */
	Company selectCompany(int comNo);

}
