package com.cowork.admin.attendance.controller;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.SessionAttributes;

import com.cowork.admin.addr.model.service.AdminAddrService;
import com.cowork.employee.addr.model.dto.MyAddr;
import com.cowork.user.model.dto.Employee2;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Controller
@RequiredArgsConstructor
@RequestMapping("admin/attendance")
@SessionAttributes({"empDetail", "backPageLocation", "comAddrList", "loginEmp", "positionList"})
public class AdminAttendanceController {
	
	private final AdminAddrService adminAddrService;
	
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
	
	@GetMapping("approvalManager")
	public String attendanceApprovalManager() {
		return "admin/attendance/attendanceApprovalManager";
	}
	
	@GetMapping("rejectManager")
	public String attendanceRejectManager() {
		return "admin/attendance/attendanceRejectManager";
	}
	
	@GetMapping("standardManagement")
	public String attendanceStandardManagement() {
		return "admin/attendance/attendanceStandardManagement";
	}

	/** 사원 찾기 (이름으로)
	 * @param request
	 * @param name
	 * @return
	 */
	@ResponseBody
	@GetMapping("findEmp")
	public List<Employee2> findEmp(HttpServletRequest request,
							 @RequestParam("name") String name) {

		HttpSession session = request.getSession();
		Employee2 loginEmp = (Employee2)session.getAttribute("loginEmp");
		
		return adminAddrService.findEmp(name, loginEmp);
	}
	
	
	// -----------------------------------------------------------------------------------------------------------
	// -----------------------------------------------------------------------------------------------------------
	// -----------------------------------------------------------------------------------------------------------
	// AdminAddrService 가져다 사용
	/** 회사별 사원 리스트 조회
	 * @param request
	 * @param model
	 * @param map
	 * @param cp
	 * @return
	 */
	@GetMapping("comList")
	public String comList(HttpServletRequest request, 
					      Model model, 
					      @RequestParam(value="cp", required=false, defaultValue="1") int cp
					      ) {
		
		HttpSession session = request.getSession();
		Employee2 loginEmp = (Employee2)session.getAttribute("loginEmp");
		
		Map<String, Object> map = adminAddrService.selectComList(loginEmp, cp);
		
		model.addAttribute("pagination", map.get("pagination"));
		model.addAttribute("comList", map.get("comList"));
		

		return "admin/attendance";
	}
	
	/** 부서별 사원 리스트 조회
	 * @param request
	 * @param model
	 * @param cp
	 * @return
	 */
	@GetMapping("deptList")
	public String deptList(HttpServletRequest request, 
					       Model model, 
					       @RequestParam Map<String, Object> data, 
					       @RequestParam(value="cp", required=false, defaultValue="1") int cp
					       ) {
		HttpSession session = request.getSession();
		Employee2 loginEmp = (Employee2)session.getAttribute("loginEmp");
		data.put("comNo", loginEmp.getComNo());
		
		Map<String, Object> selectDeptList = adminAddrService.selectDeptList(data, cp);
		
		model.addAttribute("pagination", selectDeptList.get("pagination"));
		model.addAttribute("deptList", selectDeptList.get("deptList"));
		model.addAttribute("deptNo", data.get("deptNo"));


		return "admin/attendance";
	}
	
	/** 팀별 사원 리스트 조회
	 * @param request
	 * @param model
	 * @param data
	 * @param cp
	 * @return
	 */
	@GetMapping("teamList")
	public String teamList(HttpServletRequest request, 
					       Model model, 
					       @RequestParam Map<String, Object> data, 
					       @RequestParam(value="cp", required=false, defaultValue="1") int cp
					       ) {
		
		HttpSession session = request.getSession();
		Employee2 loginEmp = (Employee2)session.getAttribute("loginEmp");
		data.put("comNo", loginEmp.getComNo());
		
		String[] arr = ((String)data.get("teamNo")).split("/");
		data.put("deptNo", arr[0]);
		data.put("teamNo", arr[1]);
		
		Map<String, Object> selectTeamList = adminAddrService.selectTeamList(data, cp);
		
		model.addAttribute("pagination", selectTeamList.get("pagination"));
		model.addAttribute("teamList", selectTeamList.get("teamList"));
		model.addAttribute("teamNo", data.get("deptNo") + "/" + data.get("teamNo"));
		

		return "admin/attendance";
	}
	
	
}