package com.cowork.admin.addr.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Controller
@RequiredArgsConstructor
@RequestMapping("admin/addr")
public class AdminAddrController {
	
	@GetMapping("")
	public String adminAddrMain() {
		return "admin/addr/addrBookManager";
	}
	
	@GetMapping("employeeDetail")
	public String employeeDetail() {
		return "admin/addr/employeeDetail";
	}
	
	@GetMapping("employeeUpdate")
	public String employeeUpdate() {
		return "admin/addr/employeeUpdate";
	}
	
	@PostMapping("employeeUpdate")
	public String employeeUpdate(RedirectAttributes ra) {
		return "redirect:/admin/addr/employeeDetail";
	}

}