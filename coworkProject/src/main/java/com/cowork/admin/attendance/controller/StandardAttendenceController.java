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
import org.springframework.web.bind.annotation.SessionAttributes;

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
@SessionAttributes({"stdAtd"})
public class StandardAttendenceController {
	
	private final StandardAttendenceService service;

	/** 근태 기준 관리 팝업창
	 * @param loginEmp
	 * @param model
	 * @return
	 */
	@GetMapping("")
	public String attendenceStandardManagement(@SessionAttribute("loginEmp") Employee2 loginEmp,
			 								   Model model) {
		
		StandardAttendence stdAtd = service.getStandardAtd(loginEmp);
		model.addAttribute("stdAtd", stdAtd);
		
		return "admin/attendence/attendenceStandardManagement";
	}
	
	/** 팝업창 열기 전에 근태 기준 관리 정보가 DB에 있는지 확인
	 * @param loginEmp
	 * @param model
	 * @return
	 */
	@ResponseBody
	@GetMapping("getAttendenceStatus")
	public StandardAttendence getAttendenceStatus(@SessionAttribute("loginEmp") Employee2 loginEmp,
									  Model model) {
		
		StandardAttendence stdAtd = service.getStandardAtd(loginEmp);
		
		return stdAtd;
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
	public StandardAttendence setTime(@SessionAttribute("loginEmp") Employee2 loginEmp,
					   @RequestBody List<Map<String, Object>> data,
					   Model model) {
		
		int result = service.setTime(loginEmp, data);
		
		if(result == 0) {
			return null;
		}
		
		StandardAttendence stdAtd = service.getStandardAtd(loginEmp);
		model.addAttribute("stdAtd", stdAtd);
		
		return stdAtd;
	}
	
	/** 근태 기준 관리 초기 설정인 경우 초기 설정 페이지로 이동
	 * @return
	 */
	@GetMapping("init")
	public String attendenceStandardManagementInit() {
		return "admin/attendence/attendenceStandardManagementInit";
	}
	
	/** 설정 안함
	 * @param loginEmp
	 * @return
	 */
	@ResponseBody
	@GetMapping("init/offSet")
	public int initOffSet(@SessionAttribute("loginEmp") Employee2 loginEmp,
						  Model model) {
		
		int result = service.initOffSet(loginEmp);
		
		StandardAttendence stdAtd = service.getStandardAtd(loginEmp);
		model.addAttribute("stdAtd", stdAtd);
		
		return result;
	}
	
	/** 지정된 시간으로 설정
	 * @param loginEmp
	 * @return
	 */
	@ResponseBody
	@PostMapping("init/setTime")
	public int initSetTime(@SessionAttribute("loginEmp") Employee2 loginEmp,
						   @RequestBody List<Map<String, Object>> data,
						   Model model) {
		
		int result = service.initSetTime(loginEmp, data);
		
		StandardAttendence stdAtd = service.getStandardAtd(loginEmp);
		model.addAttribute("stdAtd", stdAtd);
		
		return result;
	}
	
}