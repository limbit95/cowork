package com.cowork.employee.myInfo.controller;

import java.io.IOException;
import java.util.Map;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.SessionAttribute;
import org.springframework.web.multipart.MultipartFile;

import com.cowork.employee.myInfo.model.service.MyInfoService;
import com.cowork.user.model.dto.Employee2;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Controller
@RequiredArgsConstructor
@RequestMapping("myInfo")
public class MyInfoController {
	
	private final MyInfoService myInfoService; 

	@GetMapping("myInfoUpdate")
	public String myInfoUpdate(@SessionAttribute("loginEmp") Employee2 loginEmp, Model model) {
		
		model.addAttribute("loginEmp", loginEmp);
		
		String address = loginEmp.getEmpAddress();

        // 문자열을 "^^^" 구분자로 분할
		if(address != null) {
	        String[] parts = address.split("\\^\\^\\^");
	        model.addAttribute("postCode", parts[0]);
	        model.addAttribute("dorojibun", parts[1]);
	        model.addAttribute("detailAddr", parts[2]);
		}
		
		
		
		return "employee/myInfo/myInfoUpdate";
		
	}
	
	@GetMapping("pwUpdate")
	public String myInfoPwUpdate() {
		
		return "employee/myInfo/myInfoPwUpdate";
		
	}
	
	@PostMapping("validateDuplicateEmpId")
	@ResponseBody
	public int validateDuplicateEmpId(@RequestBody Map<String, String> paramMap) {
		String empId = paramMap.get("empId");
		
		int result = myInfoService.validateDuplicateEmpId(empId);		
		
		
		return result; 
	}
	
	@PostMapping("updateProfileImg")
	@ResponseBody
	public int updateProfileImg (@RequestParam("file") MultipartFile file, @SessionAttribute("loginEmp") Employee2 loginEmp) throws IllegalStateException, IOException {
		log.debug("file=={}", file);
		log.debug("fileOriginalName=={}", file.getOriginalFilename());
		
		int result = myInfoService.updateProfileImg(loginEmp, file);
		
		if(result > 0) {
			//프로필이 업데이트 된 경우 
			return 1;
		} else {
			//프로필이 업데이트 되지 못한 경우 
			return 0;
		}
		

	}
	
	
}
