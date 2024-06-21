package com.cowork.admin.authority.controller;

import java.util.Map;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.SessionAttribute;

import com.cowork.admin.authority.model.service.AuthorityManageSerive;
import com.cowork.user.model.dto.Employee2;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Controller
@Slf4j
@RequiredArgsConstructor
@RequestMapping("authority")
public class AuthorityManageController {
	
	private final AuthorityManageSerive service;
	
	/** 권한관리 화면
	 * @return
	 */
	@GetMapping("authorityManage")
	public String authorityManage(
				@SessionAttribute("loginEmp") Employee2 loginEmp,
				@RequestParam(value="cp", required=false, defaultValue="1") int cp,
			    Model model
			) {
		
		Map<String, Object> map = service.authorityList(loginEmp.getComNo(), cp);
		
		model.addAttribute("pagination", map.get("pagination"));
		model.addAttribute("authorityList", map.get("authorityList"));
		
		return "admin/authority/authorityManage";
	}
	
}
