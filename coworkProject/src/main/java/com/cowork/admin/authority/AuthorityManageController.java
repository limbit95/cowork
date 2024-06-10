package com.cowork.admin.authority;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Controller
@RequiredArgsConstructor
@Slf4j
public class AuthorityManageController {
	
	@GetMapping("authorityManage")
	public String authorityManage() {
		return "admin/authority/authorityManage";
	}
	
}
