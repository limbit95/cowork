package com.cowork.employee.usermain.controller;

import java.text.SimpleDateFormat;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.TimeZone;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.SessionAttribute;
import org.springframework.web.bind.annotation.SessionAttributes;

import com.cowork.admin.attendance.model.dto.StandardAttendence;
import com.cowork.admin.attendance.model.service.StandardAttendenceService;
import com.cowork.admin.authority.dto.AuthorityMember;
import com.cowork.employee.attendance.model.dto.TodayIsAttendence;
import com.cowork.employee.attendance.model.service.AttendanceService;
import com.cowork.employee.calendar.model.dto.Calendar;
import com.cowork.employee.calendar.model.service.CalendarService;
import com.cowork.employee.notice.model.dto.Notice;
import com.cowork.employee.usermain.model.service.UserMainService;

import com.cowork.user.model.dto.Employee2;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Controller
@Slf4j
@RequiredArgsConstructor
@SessionAttributes({"companyAllCalendarList", "stdAtd"})
public class UserMainController {
	
	private final CalendarService cs;
	private final UserMainService service;
	private final StandardAttendenceService stdAtdService;
	private final AttendanceService atService;
	
	@GetMapping("userMain")
	public String userMain(@SessionAttribute("loginEmp") Employee2 loginEmp,
						   Model model) {
		
		// loginEmp comNo 로 calendar 조회해오기
		List<Calendar> companyAllCalendarList = cs.companyAllCalendarList(loginEmp.getComNo());
		
		// 공지사항조회
		List<Notice> noticeList = service.noticeList(loginEmp.getComNo());
		
		// 근태 기준 조회
		StandardAttendence stdAtd = stdAtdService.getStandardAtd(loginEmp);

		model.addAttribute("companyAllCalendarList", companyAllCalendarList);
		model.addAttribute("noticeList", noticeList);
		model.addAttribute("stdAtd", stdAtd);

//		log.info("회사 전체 일정 == {}", companyAllCalendarList);
		
		return "employee/userMain/userMain";
	}
	
	/** 출퇴근 등록 팝업창
	 * @return
	 */
	@GetMapping("userMain/attendenceRegist")
	public String attendanceRegist(@SessionAttribute("loginEmp") Employee2 loginEmp,
			   					   Model model) {
		// 근태 기준 조회
		StandardAttendence stdAtd = stdAtdService.getStandardAtd(loginEmp);
		model.addAttribute("stdAtd", stdAtd);
		
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
		sdf.setTimeZone(TimeZone.getTimeZone("Asia/Seoul"));
		String date = sdf.format(new java.util.Date());
		
		Map<String, Object> data = new HashMap<String, Object>();
		data.put("empCode", loginEmp.getEmpCode());
		data.put("date", date);
		
		TodayIsAttendence todayIsAttendence = atService.attendenceCheck(data);
		model.addAttribute("todayIsAtd", todayIsAttendence);
		
		log.info("확인 : " + todayIsAttendence);
		
		return "employee/userMain/attendenceReigst";
	}

	
	/** 사용자 메뉴 권한
	 * @param loginEmp
	 * @param model
	 * @return
	 */
	@ResponseBody
	@GetMapping("authorityYn")
	public int authorityYn(
				@SessionAttribute("loginEmp") Employee2 loginEmp,
				Model model
			) {
	
		// 권한 CNT
		int result = service.authorityCnt(loginEmp.getEmpCode());
		
		return result;
	} 
	
	/** 관리자 권한처리
	 * @return
	 */
	@ResponseBody
	@GetMapping("authorityYnAdmin")
	public List<AuthorityMember> authorityYnAdmin(
				@SessionAttribute("loginEmp") Employee2 loginEmp,
				Model model
			) {
		
		// 권한 조회
		return service.authorityList(loginEmp.getEmpCode());
	}
	
	/** 관리자 메인페이지
	 * @return
	 */
	@GetMapping("adminMain")
	public String adminMain() {
		
		return "admin/left/adminMain";
	}
	
}
