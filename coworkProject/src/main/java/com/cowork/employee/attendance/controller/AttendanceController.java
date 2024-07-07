package com.cowork.employee.attendance.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
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
@RequestMapping("employee/attendence")
@SessionAttributes({"loginEmp"})
public class AttendanceController {
	
	private final AttendanceService service;
	
	@GetMapping("list")
	public String attendenceList() {
		return "employee/attendence/attendenceList";
	}
	
	/** 출근 확인 (DB에 해당 사용자의 출근이 찍혀있는지 확인)
	 * @return
	 */
	@ResponseBody
	@GetMapping("arrivalCheck")
	public int arrivalCheck(HttpServletRequest request,
							@RequestParam("date") String date) {
		
		HttpSession session = request.getSession();
		Employee2 loginEmp = (Employee2)session.getAttribute("loginEmp");
		
		Map<String, Object> data = new HashMap<String, Object>();
		data.put("empCode", loginEmp.getEmpCode());
		data.put("date", date);
		
		return service.arrivalCheck(data);
	}
	
	/** 출근 기록 저장
	 * @param request
	 * @return
	 */
	@ResponseBody
	@GetMapping("arrivalRecord")
	public String arrivalrecord(HttpServletRequest request,
								Model model,
								@RequestParam("dateTime") String dateTime,
								@RequestParam("date") String date) {
		
		HttpSession session = request.getSession();
		Employee2 loginEmp = (Employee2)session.getAttribute("loginEmp");
		
		Map<String, Object> data = new HashMap<String, Object>();
		data.put("empCode", loginEmp.getEmpCode());
		data.put("dateTime", dateTime);
		data.put("date", date);
		
		int result = service.arrivalrecord(data);
		
		if(result == 0) {
			return null;
		}
		
		String arrivalTime = service.selectArrivalTime(data);
		loginEmp.setArrivalTime(arrivalTime);
		model.addAttribute("loginEmp", loginEmp);
		
		return arrivalTime;
	}
	
	/** 퇴근 확인 (DB에 해당 사용자의 퇴근이 찍혀있는지 확인)
	 * @return
	 */
	@ResponseBody
	@GetMapping("departureCheck")
	public String departureCheck(HttpServletRequest request,
								 @RequestParam("date") String date) {
		
		HttpSession session = request.getSession();
		Employee2 loginEmp = (Employee2)session.getAttribute("loginEmp");
		
		Map<String, Object> data = new HashMap<String, Object>();
		data.put("empCode", loginEmp.getEmpCode());
		data.put("date", date);
		
		return service.selectDepartureTime(data);
	}
	
	/** 퇴근 기록 저장
	 * @param request
	 * @return
	 */
	@ResponseBody
	@GetMapping("departureRecord")
	public String departureRecord(HttpServletRequest request,
								Model model,
								@RequestParam("dateTime") String dateTime,
								@RequestParam("date") String date) {
		
		HttpSession session = request.getSession();
		Employee2 loginEmp = (Employee2)session.getAttribute("loginEmp");
		
		Map<String, Object> data = new HashMap<String, Object>();
		data.put("empCode", loginEmp.getEmpCode());
		data.put("dateTime", dateTime);
		data.put("date", date);
		
		int result = service.departureRecord(data);
		
		if(result == 0) {
			return null;
		}
		
		String departureTime = service.selectDepartureTime(data);
		loginEmp.setDepartureTime(departureTime);
		model.addAttribute("loginEmp", loginEmp);
		
		return departureTime;
	}
	
	/** 출퇴근 기록 불러오기
	 * @param request
	 * @param date
	 * @return
	 */
	@ResponseBody
	@GetMapping("attendenceCheck")
	public Map<String, Object> attendenceCheck(HttpServletRequest request,
								 @RequestParam("date") String date) {
		
		HttpSession session = request.getSession();
		Employee2 loginEmp = (Employee2)session.getAttribute("loginEmp");
		
		Map<String, Object> data = new HashMap<String, Object>();
		data.put("empCode", loginEmp.getEmpCode());
		data.put("date", date);
		
		return service.attendenceCheck(data);
	}

}