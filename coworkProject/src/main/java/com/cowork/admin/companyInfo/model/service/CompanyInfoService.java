package com.cowork.admin.companyInfo.model.service;

import org.springframework.web.multipart.MultipartFile;

import com.cowork.admin.companyInfo.model.dto.Company;

public interface CompanyInfoService {

	int companyLogoUpdate(MultipartFile comLogo, Company myCompany) throws Exception;

}
