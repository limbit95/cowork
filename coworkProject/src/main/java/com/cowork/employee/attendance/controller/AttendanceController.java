package com.cowork.employee.attendance.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.SessionAttributes;

import com.cowork.employee.attendance.model.service.AttendanceService;
import com.cowork.user.model.dto.Employee2;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Controller
@RequiredArgsConstructor
@RequestMapping("employee/attendance")
@SessionAttributes({"loginEmp"})
public class AttendanceController {
	
	private final AttendanceService service;
	
	@GetMapping("list")
	public String attendanceList() {
		return "employee/attendance/attendanceList";
	}
	
	/** 출근 확인 (DB에 해당 사용자의 출근이 찍혀있는지 확인)
	 * @return
	 */
	@ResponseBody
	@GetMapping("arrivalCheck")
	public int arrivalCheck(HttpServletRequest request) {
		
		HttpSession session = request.getSession();
		Employee2 loginEmp = (Employee2)session.getAttribute("loginEmp");
		
		return service.arrivalCheck(loginEmp);
	}
	
	/** 출근 기록 저장
	 * @param request
	 * @return
	 */
	@ResponseBody
	@GetMapping("arrivalRecord")
	public String arrivalrecord(HttpServletRequest request,
								Model model) {
		
		HttpSession session = request.getSession();
		Employee2 loginEmp = (Employee2)session.getAttribute("loginEmp");
		
		int result = service.arrivalrecord(loginEmp);
		
		if(result == 0) {
			return null;
		}
		
		String arrivalTime = service.selectArrivalTime(loginEmp);
		loginEmp.setArrivalTime(arrivalTime);
		model.addAttribute("loginEmp", loginEmp);
		
		if(arrivalTime == null) {
			return null;
		}
		
		return arrivalTime;
	}
	
	/** 퇴근 확인 (DB에 해당 사용자의 퇴근이 찍혀있는지 확인)
	 * @return
	 */
	@ResponseBody
	@GetMapping("departureCheck")
	public String departureCheck(HttpServletRequest request) {
		
		HttpSession session = request.getSession();
		Employee2 loginEmp = (Employee2)session.getAttribute("loginEmp");
		
		return service.selectDepartureTime(loginEmp);
	}
	
	/** 퇴근 기록 저장
	 * @param request
	 * @return
	 */
	@ResponseBody
	@GetMapping("departureRecord")
	public String departureRecord(HttpServletRequest request,
								Model model) {
		
		HttpSession session = request.getSession();
		Employee2 loginEmp = (Employee2)session.getAttribute("loginEmp");
		
		int result = service.departureRecord(loginEmp);
		
		if(result == 0) {
			return null;
		}
		
		String departureTime = service.selectDepartureTime(loginEmp);
		loginEmp.setDepartureTime(departureTime);
		model.addAttribute("loginEmp", loginEmp);
		
		if(departureTime == null) {
			return null;
		}
		
		return departureTime;
	}

}