package com.cowork.admin.main.controller;

import org.springframework.web.bind.annotation.GetMapping;

public class AdminMainController {

	@GetMapping("adminMain")
	public String adminMain() {
		
		return "admin/left/adminMain";
	}
}
