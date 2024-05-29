package com.cowork.user;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@RequestMapping("user")
@Controller
public class UserController {

	
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
	
	/** 회사 정보 입력 페이지 
	 * @return
	 */
	@GetMapping("companyInfo")
	public String companyInfo() {
		return "user/companyInfo"; 
	}
	
	/** 로그인 페이지 
	 * @return
	 */
	@GetMapping("login")
	public String login() {
		return "user/login"; 
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
	
}
