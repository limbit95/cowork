package com.cowork.admin.companyInfo;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

import lombok.extern.slf4j.Slf4j;

@Controller
@Slf4j
public class CompanyInfoController {

	@GetMapping("companyInfo")
	public String companyInfo() {
		return "/admin/companyInfo/companyInfo";
	}
	
}
