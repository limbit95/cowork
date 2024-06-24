package com.cowork.employee.calendar.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.SessionAttribute;
import org.springframework.web.bind.annotation.SessionAttributes;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

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
@SessionAttributes("calendarList")
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
		if(deptList != null) {
			for(Department dept : deptList) {
				if(dept.getTeamList() != null) {
					teamList.addAll(dept.getTeamList());
				}
			}
		}
		
		model.addAttribute("loginEmp", loginEmp);
		model.addAttribute("deptList", deptList);
		model.addAttribute("teamList", teamList);
		model.addAttribute("calendarList", calendarList);
		
		return "employee/calendar/calendar";
	}
	
	/** 캘린더 저장
	 * @param inputCalendar
	 * @return result
	 */
	@ResponseBody
	@PostMapping("calendarInsert")
	public int calendarInsert(@RequestBody Calendar inputCalendar,
			@SessionAttribute("loginEmp") Employee2 loginEmp,
			@SessionAttribute("calendarList") List<Calendar> calendarList,
			Model model
			) {
		
		if(inputCalendar.getComShareList() != loginEmp.getComNo()) {
			inputCalendar.setComShare("0");
		} else {
			int temp = inputCalendar.getComShareList();
			String comShare = String.valueOf(temp);
			inputCalendar.setComShare(comShare);
		}
		
		if(inputCalendar.getDeptShareList() == null || inputCalendar.getDeptShareList().isEmpty()) {
			inputCalendar.setDeptShare(null);
		} else {
			String deptShare = String.join("^^^", inputCalendar.getDeptShareList());
			inputCalendar.setDeptShare(deptShare);
		}
		
		if(inputCalendar.getTeamShareList() == null || inputCalendar.getTeamShareList().isEmpty()) {
			inputCalendar.setTeamShare(null);
		} else {
			String teamShare = String.join("^^^", inputCalendar.getTeamShareList());
			inputCalendar.setTeamShare(teamShare);
		}
		
		int result = service.calendarInsert(inputCalendar);

		if(result > 0) {
			calendarList.add(inputCalendar);
			return result;
		} else {
			return result;
		}
	}
	
	/** 내가 작성한 일정 보기
	 * @param loginEmp
	 * @param model
	 * @return
	 */
	@GetMapping("myCalendar")
	public String myCalendar(@SessionAttribute("loginEmp") Employee2 loginEmp,
			Model model) {
		
		// 달력 내용 조회해오기
		List<Calendar> myCalendarList = service.selectMyCalendarList(loginEmp);
		
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
		model.addAttribute("myCalendarList", myCalendarList);
		
		return "employee/calendar/myCalendar";
	}
	
	/** 일정 삭제
	 * @param eventCalendarNo
	 * @return result
	 */
	@GetMapping("calendarDelete")
	public String calendarDelete(@RequestParam("calendarNo") int calendarNo,
			RedirectAttributes ra) {
		int result = service.calendarDelete(calendarNo);
		
		String message = "";
		
		if(result > 0) {
			message = "일정 삭제 성공";
		} else {
			message = "일정 삭제 실패";
		}
		
		ra.addFlashAttribute("message", message);
		
		return "redirect:myCalendar";
		
	}
	
	@ResponseBody
	@PutMapping("calendarUpdate")
	public int calendarUpdate(@RequestBody Calendar updateCalendar,
			@SessionAttribute("loginEmp") Employee2 loginEmp,
			@SessionAttribute("calendarList") List<Calendar> calendarList,
			Model model) {
		
		
		if(updateCalendar.getComShareList() != loginEmp.getComNo()) {
			updateCalendar.setComShare("0");
		} else {
			int temp = updateCalendar.getComShareList();
			String comShare = String.valueOf(temp);
			updateCalendar.setComShare(comShare);
		}
		
		if(updateCalendar.getDeptShareList() == null || updateCalendar.getDeptShareList().isEmpty()) {
			updateCalendar.setDeptShare(null);
		} else {
			String deptShare = String.join("^^^", updateCalendar.getDeptShareList());
			updateCalendar.setDeptShare(deptShare);
		}
		
		if(updateCalendar.getTeamShareList() == null || updateCalendar.getTeamShareList().isEmpty()) {
			updateCalendar.setTeamShare(null);
		} else {
			String teamShare = String.join("^^^", updateCalendar.getTeamShareList());
			updateCalendar.setTeamShare(teamShare);
		}
		
		int result = service.calendarUpdate(updateCalendar);

		if(result > 0) {
			calendarList.add(updateCalendar);
			return result;
		} else {
			return result;
		}
	}
	
}
