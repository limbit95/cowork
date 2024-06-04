package com.cowork.admin.companyInfo.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.SessionAttribute;
import org.springframework.web.bind.annotation.SessionAttributes;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.cowork.admin.companyInfo.model.dto.Company;
import com.cowork.admin.companyInfo.model.service.CompanyInfoService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Controller
@Slf4j
@RequestMapping("admin/companyInfo")
@RequiredArgsConstructor
@SessionAttributes({"myCompany"})
public class CompanyInfoController {

	private final CompanyInfoService service;
	
	/** 관리자 회사 정보 메인페이지
	 * @return companyInfo.html
	 */
	@GetMapping("companyInfo")
	public String companyInfo(Model model) {
		// session scope 에 회사 정보 실어주기
		Company myCompany = Company.builder()
				.comNo(1)
				.build();
		
		model.addAttribute("myCompany", myCompany);
		
		return "/admin/companyInfo/companyInfo";
	}
	
	/** 관리자 회사 로고 수정
	 * @return
	 */
	@PostMapping("companyLogoUpdate")
	public String companyLogoUpdate(
			@RequestParam("comLogo") MultipartFile comLogo,
			@SessionAttribute("myCompany") Company myCompany,
			RedirectAttributes ra) throws Exception {
		// 로그인 구현 완료되면 로그인한 회원에서 comNo 꺼내서 comLogo 조회해서
		// session scope 에 myCompany 실어주기 myCompany 에서 comLogo 꺼내오기
		// myCompany는 Company 사용자 정의 자료형
		// leftBar에 보여줘야함. 회사 로고 수정 페이지에서도 comLogo 경로 보여줘야함
		
		log.info("MyCompany == {}", myCompany.getComNo());
		
		int result = service.companyLogoUpdate(comLogo, myCompany);
		
		String message = null;
		
		if(result > 0) message = "로고 이미지 업로드 완료";
		else message = "로고 이미지 업로드 실패";
		
		ra.addFlashAttribute("message", message);
		
		return "redirect:companyInfo";
	}
	
}