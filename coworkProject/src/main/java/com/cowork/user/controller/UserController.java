package com.cowork.user.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.SessionAttributes;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.cowork.admin.companyInfo.model.dto.Company;
import com.cowork.email.model.service.EmailService;
import com.cowork.user.model.dto.Employee2;
import com.cowork.user.model.service.UserService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Controller
@RequiredArgsConstructor
@SessionAttributes({"loginEmp"})
@RequestMapping("user")
public class UserController {

	private final UserService service;
	
	private final EmailService emailService;
	
	@Value("${my.public.data.service.key.decode}")
	private String decodeServiceKey;
	@Value("${my.public.data.service.key.encode}")
	private String encodeServiceKey;
	
	/** 이용약관 페이지
	 * @return
	 */
	@GetMapping("term")
	public String term() {
		
		return "user/term";
	}
	
	/** 회원가입 페이지
	 * @return
	 */
	@GetMapping("signUp")
	public String signUp() {
		return "user/signUp"; 
	}
	
	/** 아이디 중복 검사
	 * @param empId
	 * @return
	 */
	@ResponseBody
	@GetMapping("checkId")
	public int checkId(@RequestParam("empId") String empId) {
		return service.checkId(empId);
	}
	
	/** 회원가입
	 * @param inpuEmp
	 * @param empAddress
	 * @param ra
	 * @return
	 */
	@PostMapping("signUp")
	public String signUp(Employee2 inputEmp,
						 @RequestParam("empAddress") String[] empAddress,
						 RedirectAttributes ra) {
		
		log.info("test : " + inputEmp);

		int result = service.signup(inputEmp, empAddress);
		
		String path = null;
		String message = null;
		
		if(result > 0) {
			message = "가입이 완료되었습니다.";
			path = "/user/companyInfo";
		} else {
			message = "회원 가입 실패..";
			path = "signup";
		}
		
		ra.addFlashAttribute("message", message);
		
		return "redirect:" + path;
	}
	
	/** 도메인 중복 검사
	 * @param inputDomain
	 * @return
	 */
	@ResponseBody
	@GetMapping("checkDomain")
	public int checkDomain(@RequestParam("domain") String inputDomain) {
		return service.checkDomain(inputDomain);
	}
	
	/** 회사 정보 입력 페이지 
	 * @return
	 */
	@GetMapping("companyInfo")
	public String companyInfo() {
		return "user/companyInfo";
	}
	
	/** 회사 정보 등록 서비스
	 * @param ra
	 * @param model
	 * @return
	 */
	@PostMapping("companyInfo")
	public String companyInfo(Company inputCompany,
			 				  @RequestParam("comAddr") String[] comAddr,
			 				  @RequestParam("empCode") int empCode,
							  RedirectAttributes ra,
 							  Model model) {
		
		int result = service.registCompanyInfo(inputCompany, comAddr, empCode);
		
		String message = null;
		String path = null;
		
		if(result == 0) {
			message = "기업 정보 등록 실패";
			path = "/user/companyInfo";
		} else {
			message = "등록이 완료되었습니다. \n로그인 후 서비스 이용해주세요.";
			path = "/";
		}
		
		ra.addFlashAttribute("message", message);
		
		return "redirect:" + path;
	}
	
	// 공공데이터 사업자등록정보 진위확인 및 상태조회 서비스
	// 서비스키 리턴하기
	@ResponseBody 
	@GetMapping("/getServiceKey")
	public String getServiceKey() {
		return encodeServiceKey;
	}
	
	/** 로그인 페이지 
	 * @return
	 */
	@GetMapping("login")
	public String login() {
		return "user/login"; 
	}
	 
	/** 로그인 서비스
	 * @return
	 */
	@PostMapping("login")
	public String login(Employee2 inputEmp,
			 			RedirectAttributes ra,
			 			Model model) {
		

		Employee2 loginEmp = service.login(inputEmp);
		
		if(loginEmp == null) {
			ra.addFlashAttribute("message", "아이디 또는 비밀번호가 일치하지 않습니다.");
			return "redirect:/user/login";
		} 
		
		if(loginEmp.getComNm().equals("없음")) {
			ra.addFlashAttribute("message", "기업 정보 등록 후 서비스 이용 가능합니다.");
			model.addAttribute("loginEmp", loginEmp);
			return "redirect:/user/companyInfo";
		}
		
		model.addAttribute("loginEmp", loginEmp);
		ra.addFlashAttribute("message", loginEmp.getEmpLastName() + loginEmp.getEmpFirstName() + "님 환영합니다.");
		

		log.info("empCode : " + loginEmp.getEmpCode());
		
		return "redirect:/userMain";
	}
	
	
	
	/** 아이디 찾기 페이지
	 * @return
	 */
	@GetMapping("findId")
	public String findId() {
		return "user/findId"; 
	}
	
	@ResponseBody
	@PostMapping("findId")
	public int findId(@RequestBody Map<String, Object> map,
						 RedirectAttributes ra) {

		int result = service.findId(map);
		
		String authKey = null;
		
		if(result > 0) {
			String email = (String)map.get("empEmail");
			authKey = emailService.sendEmail("findId", email);
		} else {
			return 0;
		}
		
		if(authKey != null) { 
			return 1;
		}
		
		return 1; 
	}
	
	/** 비밀번호 찾기 페이지 
	 * @return
	 */
	@GetMapping("findPw")
	public String findPw() {
		return "user/findPw";
	}
	
}
