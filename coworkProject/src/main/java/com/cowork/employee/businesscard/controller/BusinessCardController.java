package com.cowork.employee.businesscard.controller;

import java.util.Map;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.SessionAttribute;

import com.cowork.employee.businesscard.model.service.BusinessCardService;
import com.cowork.employee.myInfo.controller.MyInfoController;
import com.cowork.employee.myInfo.model.service.MyInfoService;
import com.cowork.user.model.dto.Employee2;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Controller
@RequiredArgsConstructor
@RequestMapping("businessCard")
public class BusinessCardController {
	
	private final BusinessCardService businesscardService;
	
	@GetMapping("home")
	public String businessCardHome(@SessionAttribute("loginEmp")Employee2 loginEmp) {		
		return "employee/businesscard/businessCard";
	}
		
	@PostMapping("decideType")
	@ResponseBody
	public String decideType (@RequestBody Map<String, Integer> paramMap,
			@SessionAttribute("loginEmp") Employee2 loginEmp
			) {
		int flag = paramMap.get("flag");
		// flag 는 1 아니면 2 아니면 3. 
		businesscardService.decideType(flag, loginEmp);
		return "success";
	}
	

}
