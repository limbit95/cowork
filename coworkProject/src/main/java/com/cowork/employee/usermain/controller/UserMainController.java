package com.cowork.employee.usermain.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.SessionAttribute;
import org.springframework.web.bind.annotation.SessionAttributes;

import com.cowork.employee.calendar.model.dto.Calendar;
import com.cowork.employee.calendar.model.service.CalendarService;
import com.cowork.user.model.dto.Employee2;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Controller
@Slf4j
@RequiredArgsConstructor
@SessionAttributes("companyAllCalendarList")
public class UserMainController {
	
	private final CalendarService cs;
	
	@GetMapping("userMain")
	public String userMain(@SessionAttribute("loginEmp") Employee2 loginEmp,
			Model model) {
		
		// loginEmp comNo 로 calendar 조회해오기
		List<Calendar> companyAllCalendarList = cs.companyAllCalendarList(loginEmp.getComNo());
		
		model.addAttribute("companyAllCalendarList", companyAllCalendarList);			
		
		return "employee/userMain/userMain";
	}
	
	@GetMapping("adminMain")
	public String adminMain() {
		return "admin/left/adminLeftSideBar";
	}
	
}
