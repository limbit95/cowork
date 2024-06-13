package com.cowork.employee.reservation.controller;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
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
import org.springframework.web.bind.annotation.SessionAttributes;

import com.cowork.admin.companyInfo.model.dto.Department;
import com.cowork.admin.companyInfo.model.dto.Team;
import com.cowork.admin.meetingRoom.model.dto.MeetingRoom;
import com.cowork.admin.meetingRoom.model.service.MeetingRoomService;
import com.cowork.employee.calendar.model.service.CalendarService;
import com.cowork.employee.reservation.model.dto.ReserveInfo;
import com.cowork.employee.reservation.model.service.ReservationService;
import com.cowork.user.model.dto.Employee2;

import lombok.RequiredArgsConstructor;

@Controller
@RequestMapping("reservation")
@RequiredArgsConstructor
@SessionAttributes("reserveInfoList")
public class ReservationController {

	private final CalendarService cs;
	private final MeetingRoomService ms;
	
	private final ReservationService service;
	
	/** 회의실 예약 첫 화면
	 * @return
	 */
	@GetMapping("selectMonth")
	public String selectMonth(@SessionAttribute("loginEmp") Employee2 loginEmp,
			Model model) {
		
		// 회사 번호로 예약 정보 가져오기 세션에 실어줄 거임
		List<ReserveInfo> reserveInfoList = service.selectReserveInfoList(loginEmp.getComNo());
		
		model.addAttribute("reserveInfoList", reserveInfoList);
		
		return "employee/reservation/selectMonth";
	}
	
	@GetMapping("selectDay")
	public String selectDay(@SessionAttribute("loginEmp") Employee2 loginEmp,
			@RequestParam(value = "date", required = false) String date,
			Model model) {

        if (date == null || date.isEmpty()) {
            date = LocalDate.now().format(DateTimeFormatter.ISO_DATE); // 오늘 날짜 기본 값 설정
        }
        
        model.addAttribute("selectedDate", date);
		
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
	
	/** 회의실 예약
	 * @param inputReserveInfo
	 * @param loginEmp
	 * @return result
	 */
	@ResponseBody
	@PostMapping("reservationInsert")
	public int reservationInsert(@RequestBody ReserveInfo inputReserveInfo,
			@SessionAttribute("loginEmp") Employee2 loginEmp) {
		
		inputReserveInfo.setEmpCode(loginEmp.getEmpCode());
		
		// 회사 공유가 null 일 경우
		if(inputReserveInfo.getComReserve() != loginEmp.getComNo()) {
			inputReserveInfo.setComReserve(0);
		}
		
		// 부서 공유가 null 일 경우
		if(inputReserveInfo.getDeptReserve().isEmpty() || inputReserveInfo.getDeptReserve() == null) {
			inputReserveInfo.setDeptReserve(null);
			inputReserveInfo.setDeptShare(null);
		} else {
			List<String> deptReserve = inputReserveInfo.getDeptReserve();
			String deptShare = String.join("^^^", deptReserve);
			inputReserveInfo.setDeptShare(deptShare);
		}
		
		// 팀 공유가 null 일 경우
		if(inputReserveInfo.getTeamReserve().isEmpty() || inputReserveInfo.getTeamReserve() == null) {
			inputReserveInfo.setTeamReserve(null);
			inputReserveInfo.setTeamShare(null);
		} else {
			List<String> teamReserve = inputReserveInfo.getTeamReserve();
			String teamShare = String.join("^^^", teamReserve);
			inputReserveInfo.setTeamShare(teamShare);
		}
		
		return service.reservationInsert(inputReserveInfo);
	}
}
