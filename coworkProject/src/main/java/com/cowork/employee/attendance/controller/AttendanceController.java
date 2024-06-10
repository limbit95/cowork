package com.cowork.employee.attendance.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Controller
@RequiredArgsConstructor
@RequestMapping("employee/attendance")
public class AttendanceController {
	
	@GetMapping("list")
	public String attendanceList() {
		return "employee/attendance/attendanceList";
	}

}