package com.cowork.admin.attendance.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Controller
@RequiredArgsConstructor
@RequestMapping("admin/attendance")
public class AdminAttendanceController {
	
	@GetMapping("")
	public String attendanceManager() {
		return "admin/attendance/attendanceManager";
	}
	
	@GetMapping("detail")
	public String attendanceDetail() {
		return "admin/attendance/attendanceDetail";
	}
	
	@GetMapping("requestManager")
	public String attendanceRequestManager() {
		return "admin/attendance/attendanceRequestManager";
	}
	
}