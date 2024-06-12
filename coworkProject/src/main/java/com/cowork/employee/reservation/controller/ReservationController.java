package com.cowork.employee.reservation.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.SessionAttribute;

import com.cowork.admin.companyInfo.model.dto.Department;
import com.cowork.admin.companyInfo.model.dto.Team;
import com.cowork.admin.meetingRoom.model.dto.MeetingRoom;
import com.cowork.admin.meetingRoom.model.service.MeetingRoomService;
import com.cowork.employee.calendar.model.service.CalendarService;
import com.cowork.user.model.dto.Employee2;

import lombok.RequiredArgsConstructor;

@Controller
@RequestMapping("reservation")
@RequiredArgsConstructor
public class ReservationController {

	private final CalendarService cs;
	private final MeetingRoomService ms;
	
	@GetMapping("reservation")
	public String reservation() {
		return "employee/reservation/selectMonth";
	}
	
	@GetMapping("reservationInsert")
	public String reservationInsert(@SessionAttribute("loginEmp") Employee2 loginEmp,
			Model model) {

		// comNo 로 회사 모든 부서와 팀 조회해오기
		List<Department> deptList = cs.selectDeptList(loginEmp.getComNo());
		// 부서가 없으면 null 있으면 List 들어있음 teamList 안에 team 있으면 teamList, 없으면 null
		
		List<Team> teamList = new ArrayList<>();
		for(Department dept : deptList) {
			if(dept.getTeamList() != null) {
				teamList.addAll(dept.getTeamList());
			}
		}
		
		// 회사 번호로 회사에 있는 회의실 조회해오기
		List<MeetingRoom> meetingRoomList = ms.meetingRoomList(loginEmp.getComNo());
		
		model.addAttribute("loginEmp", loginEmp);
		model.addAttribute("deptList", deptList);
		model.addAttribute("teamList", teamList);
		model.addAttribute("meetingRoomList", meetingRoomList);
		
		return "employee/reservation/selectDay";
	}
}
