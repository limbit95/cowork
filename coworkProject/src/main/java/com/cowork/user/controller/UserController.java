package com.cowork.user.controller;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
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
import org.springframework.web.bind.support.SessionStatus;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.cowork.admin.addr.model.service.AdminAddrService;
import com.cowork.admin.companyInfo.model.dto.Company;
import com.cowork.admin.companyInfo.model.dto.Department;
import com.cowork.email.model.service.EmailService;
import com.cowork.user.model.dto.Employee2;
import com.cowork.user.model.service.UserService;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Controller
@RequiredArgsConstructor
@SessionAttributes({"loginEmp", "comAddrList", "positionList"})
@RequestMapping("user")
public class UserController {

	private final UserService service;
	
	private final EmailService emailService;
	
	private final AdminAddrService adminAddrService;
	
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
	public String signUp(SessionStatus status) {
		status.setComplete();
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
		
		int empCode = service.selectEmpCode(inputEmp.getEmpId());
		
		String path = null;
		String message = null;
		
		if(result > 0) {
			int createInviteAuthkey = service.createInviteAuthkey("cowork@invite.authKey.", empCode);
			
			if(createInviteAuthkey == 0) {
				message = "가입이 완료되었습니다. (초대 링크 인증키 생성 실패)";
			} else {
				message = "가입이 완료되었습니다.";
			}
			
			path = "/user/companyInfo";
		} else {
			message = "회원 가입 실패";
			path = "signup";
		}
		
		ra.addFlashAttribute("message", message);
		ra.addFlashAttribute("empCode", empCode);
		
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
			message = "등록이 완료되었습니다.";
			path = "/";
		}
		
		ra.addFlashAttribute("message", message);
		
		return "redirect:" + path;
	}
	
	/** 공공데이터 사업자등록정보 진위확인 및 상태조회 서비스 서비스키 리턴하기
	 * @return
	 */
	@ResponseBody 
	@GetMapping("/getServiceKey")
	public String getServiceKey() {
		return encodeServiceKey;
	}
	
	/** 로그인 페이지 
	 * @return
	 */
	@GetMapping("login")
	public String login(@RequestParam(value="empId", required=false) String empId,
									  Model model) {
		
		model.addAttribute("findEmpId", empId);
		
		return "user/login"; 
	}
	 
	/** 로그인 서비스
	 * @return
	 */
	@PostMapping("login")
	public String login(Employee2 inputEmp,
			 			RedirectAttributes ra,
			 			Model model,
			 			HttpServletRequest request) {
		
		Employee2 loginEmp = service.login(inputEmp);
		
		if(loginEmp == null) {
			ra.addFlashAttribute("message", "아이디 또는 비밀번호가 일치하지 않습니다.");
			return "redirect:/user/login";
		}
		
		Integer businessCardFl = service.businessCardProcess(loginEmp.getEmpCode());
		loginEmp.setBusinessCardFl(businessCardFl);

		if(loginEmp.getComNm().equals("없음")) {
			ra.addFlashAttribute("message", "기업 정보 등록 후 서비스 이용 가능합니다.");
			ra.addFlashAttribute("loginEmp", loginEmp);
			return "redirect:/user/companyInfo";
		} else {
			model.addAttribute("loginEmp", loginEmp);
		}
		
		List<Department> comAddrList = adminAddrService.selectComAddrList(loginEmp);
		model.addAttribute("comAddrList", comAddrList);
		
        String connectIP = request.getHeader("X-Forwarded-For");
        if (connectIP == null || connectIP.isEmpty() || "unknown".equalsIgnoreCase(connectIP)) {
        	connectIP = request.getHeader("Proxy-Client-IP");
        }
        if (connectIP == null || connectIP.isEmpty() || "unknown".equalsIgnoreCase(connectIP)) {
        	connectIP = request.getHeader("WL-Proxy-Client-IP");
        }
        if (connectIP == null || connectIP.isEmpty() || "unknown".equalsIgnoreCase(connectIP)) {
        	connectIP = request.getHeader("HTTP_CLIENT_IP");
        }
        if (connectIP == null || connectIP.isEmpty() || "unknown".equalsIgnoreCase(connectIP)) {
        	connectIP = request.getHeader("HTTP_X_FORWARDED_FOR");
        }
        if (connectIP == null || connectIP.isEmpty() || "unknown".equalsIgnoreCase(connectIP)) {
        	connectIP = request.getRemoteAddr();
        }

        log.info("@@@@@@@@@@@@@ 접속한 ip @@@@@@@@@@@@@@ : " + connectIP);
        
        // 로그인한 회원의 ip가 DB에 존재하지는지 확인
        String loginEmpGetIp = service.loginEmpGetIp(loginEmp);
        
        // DB에 존재하지 않으면 ip 삽입
        // 결국 회원가입 후 첫 로그인 시 당연히 DB에 ip가 없기 때문에
        // 그 때 사용자의 ip가 DB에 저장되기에 최초 로그인 시에만 DB에 ip가 저장됨
        if(loginEmpGetIp == null) {
        	loginEmp.setEmpIp(connectIP);
        	int result = service.firstInsertIp(loginEmp);
        }
		
		ra.addFlashAttribute("message", loginEmp.getEmpLastName() + loginEmp.getEmpFirstName() + "님 환영합니다.");
		
		return "redirect:/userMain";
	}
	
	/** 로그아웃
	 * @param status
	 * @return
	 */
	@GetMapping("logout")
	public String logoutMethod(SessionStatus status) {
		status.setComplete();
		return "redirect:/";
		
	}
	
	/** 아이디 찾기 페이지
	 * @return
	 */
	@GetMapping("findId")
	public String findId() {
		return "user/findId"; 
	}
	
	/** 비밀번호 찾기 페이지 
	 * @return
	 */
	@GetMapping("findPw")
	public String findPw() {
		return "user/findPw";
	}
	
	/** 비밀번호 재설정 페이지 이동
	 * @return
	 */
	@PostMapping("resetPwPage")
	public String resetPwPage(@RequestParam("item") String item,
 							  RedirectAttributes ra,
 							  Model model) {
		String[] items = item.split(",");

		Map<String, Object> map = new HashMap<String, Object>();
		map.put("empId", items[0]);
		map.put("email", items[1]);
		map.put("authKey", items[2]);
		
		int result = service.checkAuthKey(map);
		
		if(result == 0) {
			ra.addFlashAttribute("message", "페이지를 찾을 수 없습니다.");
			return "redirect:/";
		}
		
		model.addAttribute("map", map);
		
		return "user/resetPw";
	}
	
	/** 비밀번호 재설정
	 * @param item
	 * @return
	 */
	@PostMapping("resetPw")
	public String resetPw(Employee2 inputEmp,
			  			  RedirectAttributes ra,
			  			  Model model) {
		
		int result = service.resetPw(inputEmp);
		
		if(result == 0) {
			model.addAttribute("message", "비밀번호 재설정 실패");
			return "redirect:/";
		}
		
		if(result == -1) {
			model.addAttribute("message", "인증번호 업데이트 실패");
			return "redirect:/";
		}
		
		ra.addFlashAttribute("message", "비밀번호 재설정 되었습니다. 새로운 비밀번호로 로그인 해주세요.");
		return "redirect:/";
	}
	
	/** 초대 받은 사람의 회원가입 페이지 이동
	 * @return
	 */
	@PostMapping("inviteSignUpPage")
	public String inviteSignUpPage(@RequestParam Map<String, Object> data,
								   Model model) {
		
		int checkInviteAuthKey = service.checkInviteAuthKey(data);
		
		if(checkInviteAuthKey == 0) {
			return "common/error/404";
		}
		
		model.addAttribute("data", data);
		
		return "user/inviteSignUp";
	}
	
	/** 초대 받은 사람의 회원가입 
	 * @return
	 */
	@ResponseBody
	@PostMapping("inviteSignUp")
	public int inviteSignUp(@RequestBody Map<String, Object> data,
							   RedirectAttributes ra) {
		return service.inviteSignUp(data);
	}
	
	/** 사업자 등록 번호 인증 팝업창
	 * @return
	 */
	@GetMapping("registrationNumCheck")
	public String registYourself() {
		return "user/registrationNumCheck";
	}
	
	
	
	
	
	// 빠른 로그인
	@GetMapping("quick")
	public String quickLogin(@RequestParam("empId") String empId,
							 RedirectAttributes ra,
							 Model model) {
		Employee2 loginEmp = service.quickLogin(empId);
		
		Integer businessCardFl = service.businessCardProcess(loginEmp.getEmpCode());
		loginEmp.setBusinessCardFl(businessCardFl);
		
		List<Department> comAddrList = adminAddrService.selectComAddrList(loginEmp);
		model.addAttribute("comAddrList", comAddrList);
		
		model.addAttribute("loginEmp", loginEmp);
		ra.addFlashAttribute("message", loginEmp.getEmpLastName() + loginEmp.getEmpFirstName() + "님 환영합니다.");
		return "redirect:/userMain";
	}
	
	@GetMapping("resetPw")
	public String resetPw (@RequestParam("empId") String empId, Model model) {
		model.addAttribute("empId", empId);
		return "user/resetPwFindByPhoneVersion";
	}
	
	@PostMapping("resetPwPhoneVersion")
	public String resetPwPhoneVersion (@RequestParam("empPw") String empPw, 
				@RequestParam("empId") String empId,
				Model model
			) {
		service.resetPwPhoneVersion(empId, empPw);
		model.addAttribute("message", "비밀번호가 정상적으로 수정되었습니다.");
		return "common/main";
	}
	
}