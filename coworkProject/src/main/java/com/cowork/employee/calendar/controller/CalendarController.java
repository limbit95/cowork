package com.cowork.employee.calendar.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.SessionAttribute;

import com.cowork.admin.companyInfo.model.dto.Department;
import com.cowork.employee.calendar.model.service.CalendarService;
import com.cowork.user.model.dto.Employee2;
import com.cowork.admin.companyInfo.model.dto.Team;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Controller
@RequestMapping("calendar")
@Slf4j
@RequiredArgsConstructor
public class CalendarController {

	private final CalendarService service;
	
	@GetMapping("calendar")
	public String calendar(@SessionAttribute("loginEmp") Employee2 loginEmp,
			Model model) {
		log.info("로그인한 회원 회사 기본키 == {}", loginEmp.getComNo());
		// 회사 번호 comNo 는 loginEmp.getComNo() 로 얻어올 수 있음
		// 부서 List 조회해오기
		List<Department> deptList = service.selectDeptList(loginEmp.getComNo());
		// 부서가 없으면 null 있으면 List 들어있음 teamList 안에 team 있으면 teamList, 없으면 null
		log.info("팀명 나열 == {}",deptList.get(0).getTeamList());
		
		List<Team> teamList = new ArrayList<>();
		for(Department dept : deptList) {
			if(dept.getTeamList() != null) {
				teamList.addAll(dept.getTeamList());
			}
		}
		
		model.addAttribute("loginEmp", loginEmp);
		model.addAttribute("deptList", deptList);
		model.addAttribute("teamList", teamList);
		
		return "employee/calendar/calendar";
	}
}
