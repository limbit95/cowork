package com.cowork.employee.usermain.controller;

import java.util.List;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.SessionAttribute;
import org.springframework.web.bind.annotation.SessionAttributes;

import com.cowork.admin.authority.dto.AuthorityMember;
import com.cowork.employee.calendar.model.dto.Calendar;
import com.cowork.employee.calendar.model.service.CalendarService;

import com.cowork.employee.usermain.model.service.UserMainService;

import com.cowork.user.model.dto.Employee2;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Controller
@Slf4j
@RequiredArgsConstructor
@SessionAttributes("companyAllCalendarList")
public class UserMainController {
	
	private final CalendarService cs;
	private final UserMainService service;
	
	@GetMapping("userMain")
	public String userMain(@SessionAttribute("loginEmp") Employee2 loginEmp,
			Model model) {
		
		// loginEmp comNo 로 calendar 조회해오기
		List<Calendar> companyAllCalendarList = cs.companyAllCalendarList(loginEmp.getComNo());
		
		model.addAttribute("companyAllCalendarList", companyAllCalendarList);			

		return "employee/userMain/userMain";
	}
	
	/** 출퇴근 등록 팝업창
	 * @return
	 */
	@GetMapping("userMain/attendanceRegist")
	public String attendanceRegist() {
		
		return "employee/userMain/attendanceReigst";
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
	
	/** 관리자 Left 메뉴
	 * @return
	 */
	@GetMapping("adminMain")
	public String adminMain() {
		
		return "admin/left/adminLeftSideBar";
	}
	
}
