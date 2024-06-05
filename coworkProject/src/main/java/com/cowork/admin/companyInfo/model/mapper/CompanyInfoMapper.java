package com.cowork.admin.companyInfo.model.mapper;

import org.apache.ibatis.annotations.Mapper;

import com.cowork.admin.companyInfo.model.dto.Company;

@Mapper
public interface CompanyInfoMapper {

	int companyLogoUpdate(Company com);

}
