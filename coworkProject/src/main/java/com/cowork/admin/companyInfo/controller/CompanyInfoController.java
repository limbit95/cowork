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
import com.cowork.user.model.dto.Employee2;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Controller
@Slf4j
@RequestMapping("admin/companyInfo")
@RequiredArgsConstructor
@SessionAttributes("myCompany")
public class CompanyInfoController {

	private final CompanyInfoService service;
	
	/** 관리자 회사 정보 메인페이지
	 * @return companyInfo.html
	 */
	@GetMapping("companyInfo")
	public String companyInfo(Model model,
			@SessionAttribute("loginEmp") Employee2 loginEmp) {
		
		Company myCompany = service.selectCompany(loginEmp.getComNo());
		
		model.addAttribute("myCompany", myCompany);
		
		// 기본 정보 보여줘야함
		String comAddr = myCompany.getComAddr();
		
		// 주소가 있을 경우에만 보여주기
		if(comAddr != null) {
			String[] arr = comAddr.split("\\^\\^\\^");
			model.addAttribute("comPostCode", arr[0]);
			model.addAttribute("comAddress", arr[1]);
			model.addAttribute("comDetailAddress", arr[2]);

		}

		return "/admin/companyInfo/companyInfo";
	}
	
	/** 관리자 회사 로고 수정
	 * @return
	 */
	@PostMapping("companyLogoUpdate")
	public String companyLogoUpdate(
			@RequestParam("comLogo") MultipartFile comLogo,
			@SessionAttribute("myCompany") Company myCompany,
			@SessionAttribute("loginEmp") Employee2 loginEmp,
			RedirectAttributes ra) throws Exception {
		// 로그인 구현 완료되면 로그인한 회원에서 comNo 꺼내서 comLogo 조회해서
		// session scope 에 myCompany 실어주기 myCompany 에서 comLogo 꺼내오기
		// myCompany는 Company 사용자 정의 자료형
		// leftBar에 보여줘야함. 회사 로고 수정 페이지에서도 comLogo 경로 보여줘야함
		
		int result = service.companyLogoUpdate(comLogo, myCompany, loginEmp);
		
		String message = null;
		
		if(result > 0) message = "로고 이미지 업로드 완료";
		else message = "로고 이미지 업로드 실패";
		
		ra.addFlashAttribute("message", message);
		
		return "redirect:companyInfo";
	}
	
	/** 관리자 회사 정보 수정
	 * @return 
	 */
	@PostMapping("companyInfoUpdate")
	public String companyInfoUpdate(Company inputCompany,
			@SessionAttribute("myCompany") Company myCompany,
			@RequestParam("comAddr") String[] comAddr,
			RedirectAttributes ra) {
		// 로그인 구현 완료 후 session comNo 꺼내와야하는 거 마찬가지
		// inputCompany 에 회사명, 회사 번호 들어있음
		// myCompany 안에 있는 comNo 를 inputCompany에 넣어줌
		inputCompany.setComNo(myCompany.getComNo());

		// 회사 정보 수정 서비스 호출
		int result = service.companyInfoUpdate(inputCompany, comAddr);
		
		if(result > 0) {
			ra.addFlashAttribute("message", "회사 정보 수정 성공");
			myCompany.setComNm(inputCompany.getComNm());
			myCompany.setComTel(inputCompany.getComTel());
			myCompany.setComEmail(inputCompany.getComEmail());
			myCompany.setComAddr(myCompany.getComAddr());
		} else {
			ra.addAttribute("message", "회원 정보 수정 실패");
		}
		
		return "redirect:companyInfo";
	}
}