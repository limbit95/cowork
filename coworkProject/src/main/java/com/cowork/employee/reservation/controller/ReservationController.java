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
import lombok.extern.slf4j.Slf4j;

@Controller
@RequestMapping("reservation")
@RequiredArgsConstructor
@SessionAttributes("reserveInfoList")
@Slf4j
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
		
		int size = reserveInfoList.size();
		
		log.info("List size == {}", size);
		
		List<ReserveInfo> shareList = new ArrayList<>(size);
				
		for(int i = 0 ; i < reserveInfoList.size() ; i ++) {
			ReserveInfo shareInfo = new ReserveInfo();
			String share = "";
			
			// 회사 전체 공유일 때 comReserve
			if(reserveInfoList.get(i).getComShare() != null) {
				share = "회사 전체";
			}
			// 부서 공유 null 이 아닐 때
			if(reserveInfoList.get(i).getDeptShare() != null) {
				share += reserveInfoList.get(i).getDeptShare().replace("^^^", ", ");
			}
			// 팀 공유 null 이 아닐 때
			if(reserveInfoList.get(i).getTeamShare() != null) {
				
				if(share != null) {
					share += ", ";
				}
				
				share += reserveInfoList.get(i).getTeamShare().replace("^^^", ", ");

			}
			
			shareInfo.setShareStr(share);
			shareList.add(shareInfo);
			
		}
		
		for(int i = 0 ; i < reserveInfoList.size() ; i ++) {
			reserveInfoList.get(i).setShareStr(shareList.get(i).getShareStr());
		}
		
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
			@SessionAttribute("loginEmp") Employee2 loginEmp,
			@SessionAttribute("reserveInfoList") List<ReserveInfo> reserveInfoList,
			Model model) {
		
		// 회의실 예약 시간 겹치는지 확인
		int count = service.checkMeetingRoom(inputReserveInfo);
		
		// count 1 이상이면 겹치는 게 있는 거
		if(count < 1) {
			
			inputReserveInfo.setEmpCode(loginEmp.getEmpCode());
			inputReserveInfo.setComNo(loginEmp.getComNo());
			
			// 회사 공유가 null 일 경우
			if(inputReserveInfo.getComReserve() != loginEmp.getComNo()) {
				inputReserveInfo.setComReserve(0);
				inputReserveInfo.setComShare(null);
			} else {
				inputReserveInfo.setComShare("회사 전체");
			}
			
			// 부서 공유가 null 일 경우
			if(inputReserveInfo.getDeptReserve().isEmpty() || inputReserveInfo.getDeptReserve() == null) {
				inputReserveInfo.setDeptReserve(null);
				inputReserveInfo.setDeptShare(null);
			} else {
				List<String> deptReserve = inputReserveInfo.getDeptReserve();
				
				List<String> newDeptReserve = new ArrayList<>();
				String deptShare = "";
				
				for(int i = 0 ; i < deptReserve.size() ; i++) {
					// deptNo 조회해온 거 이름으로 바꿔서 저장
					String deptNm = service.selectDeptNm(deptReserve.get(i));
					newDeptReserve.add(deptNm);
				}
				
				deptShare = String.join("^^^", newDeptReserve);
				inputReserveInfo.setDeptShare(deptShare);
			}
			
			// 팀 공유가 null 일 경우
			if(inputReserveInfo.getTeamReserve().isEmpty() || inputReserveInfo.getTeamReserve() == null) {
				inputReserveInfo.setTeamReserve(null);
				inputReserveInfo.setTeamShare(null);
			} else {
				List<String> teamReserve = inputReserveInfo.getTeamReserve();
				
				List<String> newTeamReserve = new ArrayList<>();
				String teamShare = "";
				
				for(int i = 0 ; i < teamReserve.size() ; i ++) {
					// teamNo로 조회해온 teamNm
					String teamNm = service.selectTeamNm(teamReserve.get(i));
					newTeamReserve.add(teamNm);
				}
				
				teamShare = String.join("^^^", newTeamReserve);
				inputReserveInfo.setTeamShare(teamShare);
			}
			
			reserveInfoList.add(inputReserveInfo);
			
			return service.reservationInsert(inputReserveInfo);
		}
		
		// count 1보다 클 때 겹치는 게 있을 때
		return -1;
		
		
	}
}
