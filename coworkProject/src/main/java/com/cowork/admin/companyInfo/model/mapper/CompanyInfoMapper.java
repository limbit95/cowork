package com.cowork.admin.companyInfo.model.mapper;

import org.apache.ibatis.annotations.Mapper;

import com.cowork.admin.companyInfo.model.dto.Company;

@Mapper
public interface CompanyInfoMapper {

	/** 회사 로고 수정
	 * @param com
	 * @return result
	 */
	int companyLogoUpdate(Company com);

	/** 회사 정보 수정
	 * @param inputCompany
	 * @return result
	 */
	int companyInfoUpdate(Company inputCompany);

	/** 회사 정보 조회
	 * @param comNo
	 * @return myCompany
	 */
	Company selectCompany(int comNo);

}
