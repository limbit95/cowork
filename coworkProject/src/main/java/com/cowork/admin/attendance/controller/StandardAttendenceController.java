package com.cowork.admin.attendance.controller;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.SessionAttribute;

import com.cowork.admin.attendance.model.dto.StandardAttendence;
import com.cowork.admin.attendance.model.service.AdminAttendanceService;
import com.cowork.admin.attendance.model.service.StandardAttendenceService;
import com.cowork.user.model.dto.Employee2;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Controller
@RequiredArgsConstructor
@Slf4j
@RequestMapping("admin/standardAttendence")
public class StandardAttendenceController {
	
	private final StandardAttendenceService service;

	@GetMapping("")
	public String attendenceStandardManagement(@SessionAttribute("loginEmp") Employee2 loginEmp,
			 								   Model model) {
		
		StandardAttendence stdAtd = service.getStandardAtd(loginEmp);
		
		model.addAttribute("stdAtd", stdAtd);
		
		return "admin/attendence/attendenceStandardManagement";
	}
	
	/** 설정 안함
	 * @param loginEmp
	 * @return
	 */
	@ResponseBody
	@GetMapping("offSet")
	public int offSet(@SessionAttribute("loginEmp") Employee2 loginEmp) {
		return service.offSet(loginEmp);
	}
	
	/** 지정된 시간으로 설정
	 * @param loginEmp
	 * @return
	 */
	@ResponseBody
	@PostMapping("setTime")
	public int setTime(@SessionAttribute("loginEmp") Employee2 loginEmp,
									  @RequestBody List<Map<String, Object>> data) {
		return service.setTime(loginEmp, data);
	}
	
}