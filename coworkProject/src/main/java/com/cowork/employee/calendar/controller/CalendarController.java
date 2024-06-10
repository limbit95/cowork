package com.cowork.employee.calendar.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.SessionAttribute;

import com.cowork.admin.companyInfo.model.dto.Department;
import com.cowork.employee.calendar.model.dto.Calendar;
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

		// 달력 내용 조회해오기
		List<Calendar> calendarList = service.selectCalendarList(loginEmp);
		
		// 회사 번호 comNo 는 loginEmp.getComNo() 로 얻어올 수 있음
		// 부서 List 조회해오기
		List<Department> deptList = service.selectDeptList(loginEmp.getComNo());
		// 부서가 없으면 null 있으면 List 들어있음 teamList 안에 team 있으면 teamList, 없으면 null
		
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
	
	/** 캘린더 저장
	 * @param inputCalendar
	 * @return result
	 */
	@ResponseBody
	@PostMapping("calendarInsert")
	public int calendarInsert(@RequestBody Calendar inputCalendar,
			@SessionAttribute("loginEmp") Employee2 loginEmp
			) {
		
		inputCalendar.setEmpCode(loginEmp.getEmpCode());
		
	    List<String> shareList = inputCalendar.getShareList();
	    String calendarShare = String.join("^^^", shareList);
	    inputCalendar.setCalendarShare(calendarShare);
	    
	    log.info("shareListString == {}", calendarShare);
		
		log.info("inputCalendar의 shareList 출력 == {}", inputCalendar.getShareList());

		return service.calendarInsert(inputCalendar);
	}
}
