package com.cowork.email.controller;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.cowork.email.model.service.EmailService;
import com.cowork.user.model.dto.Employee2;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Controller
@RequestMapping("email")
@RequiredArgsConstructor 
@Slf4j
public class EmailController {

	private final EmailService service;
	
	// 회원가입 중 이메일 인증 번호 발송
	@ResponseBody
	@PostMapping("signup")
	public int signup(@RequestBody String email) {
		String authKey = service.sendEmail("signup", email);
		
		// 인증번호가 반환돼서 돌아옴
		// == 이메일 보내기 성공
		if(authKey != null) { 
			return 1;
		}
		
		// 이메일 보내기 실패
		return 0;
	}
	
	// 인증번호 인증
	@ResponseBody
	@PostMapping("checkAuthKey")
	public int checkAuthKey(@RequestBody Map<String, Object> map) {
		// 입력 받은 이메일, 인증번호가 DB에 있는지 조회
		// 이메일 있고, 인증번호 일치 == 1 반환
		// 아니면 0 반환
		return service.checkAuthKey(map);
	}
	
	// 아이디 찾기 중 이메일 인증번호 발송
	@ResponseBody
	@PostMapping("findId")
	public int findId(@RequestBody Map<String, Object> map) {
		
		log.info("tset : " + map);

		int result = service.findId(map);
		
		if(result == 0) {
			return 0;
		}
		
		String email = (String)map.get("empEmail");
		String authKey = service.sendEmail("findId", email);
		
		if(authKey != null) { 
			return 1;
		} 
		
		return -1; 
	}
	
	
	/** 아이디 찾기 이메일 인증번호 인증 성공 시 해당 이메일로 가입한 아이디 모두 조회
	 * @param map
	 * @return
	 */
	@ResponseBody
	@PostMapping("selectId")
	public List<Employee2> selectId(@RequestBody Map<String, Object> map) {
		return service.selectId(map);
	}
	
	
	/** 아이디와 이메일 검사(비밀번호 찾기(이메일))
	 * @param map
	 * @return
	 */
	@ResponseBody
	@PostMapping("checkIdAndEmail")
	public int checkIdAndEmail(@RequestBody Map<String, Object> map) {
		return service.findPwByEmail(map);
	}
	
	/** 비밀번호 찾기(이메일)
	 * @param map
	 * @return
	 */
//	@ResponseBody
//	@PostMapping("findPwByEmail")
//	public int findPwByEmail(@RequestBody Map<String, Object> map) {
//		return service.sendEmail("findPwByEmail", map);
//	}
	
}