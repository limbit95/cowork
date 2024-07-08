package com.cowork.admin.attendance.controller;

import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.TimeZone;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.SessionAttribute;
import org.springframework.web.bind.annotation.SessionAttributes;

import com.cowork.admin.attendance.model.service.AdminAttendanceService;
import com.cowork.employee.addr.model.dto.MyAddr;
import com.cowork.user.model.dto.Employee2;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Controller
@RequiredArgsConstructor
@RequestMapping("admin/attendence")
@SessionAttributes({"empDetail", "backPageLocation", "comAddrList", "loginEmp", "positionList", "companyCreateDate", "date"})
public class AdminAttendanceController {
	
	private final AdminAttendanceService service;
	
	@GetMapping("")
	public String attendenceManager(HttpServletRequest request, 
							        Model model, 
							        @RequestParam(value="cp", required=false, defaultValue="1") int cp,
							        @RequestParam(value="date", required=false, defaultValue="null") String date) {
		
		if(date.equals("null")) {
			SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
			sdf.setTimeZone(TimeZone.getTimeZone("Asia/Seoul"));
			date = sdf.format(new java.util.Date());
		}
		
		log.info("date : " + date);
		
		HttpSession session = request.getSession();
		Employee2 loginEmp = (Employee2)session.getAttribute("loginEmp");
		
		Map<String, Object> map = service.selectComList(loginEmp, cp, date);
		model.addAttribute("pagination", map.get("pagination"));
		model.addAttribute("comList", map.get("comList"));
		
		String companyCreateDate = service.getCompanyCreateDate(loginEmp);
		model.addAttribute("companyCreateDate", companyCreateDate);
		
		model.addAttribute("date", date);
		
		return "admin/attendence/attendenceManager";
	}
	
	@GetMapping("detail")
	public String attendenceDetail() {
		return "admin/attendence/attendenceDetail";
	}
	
	@GetMapping("requestManager")
	public String attendenceRequestManager() {
		return "admin/attendence/attendenceRequestManager";
	}
	
	@GetMapping("approvalManager")
	public String attendenceApprovalManager() {
		return "admin/attendence/attendenceApprovalManager";
	}
	
	@GetMapping("rejectManager")
	public String attendenceRejectManager() {
		return "admin/attendence/attendenceRejectManager";
	}

	/** 사원 찾기 (이름으로)
	 * @param request
	 * @param name
	 * @return
	 */
	@ResponseBody
	@GetMapping("findEmp")
	public List<Employee2> findEmp(HttpServletRequest request,
							 @RequestParam("name") String name,
							 @RequestParam(value="date", required=false, defaultValue="null") String date) {
		
		if(date.equals("null")) {
			SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
			sdf.setTimeZone(TimeZone.getTimeZone("Asia/Seoul"));
			date = sdf.format(new java.util.Date());
		}

		HttpSession session = request.getSession();
		Employee2 loginEmp = (Employee2)session.getAttribute("loginEmp");
		
		Map<String, Object> data = new HashMap<String, Object>();
		data.put("name", name);
		data.put("comNo", loginEmp.getComNo());
		data.put("date", date);
		
		return service.findEmp(data);
	}
	
	
	// -----------------------------------------------------------------------------------------------------------
	// -----------------------------------------------------------------------------------------------------------
	// -----------------------------------------------------------------------------------------------------------
	/** 회사별 사원 리스트 조회
	 * @param request
	 * @param model
	 * @param cp
	 * @param date
	 * @return
	 */
	@GetMapping("comList")
	public String comList(HttpServletRequest request, 
							        Model model, 
							        @RequestParam(value="cp", required=false, defaultValue="1") int cp,
							        @RequestParam(value="date", required=false, defaultValue="null") String date) {
		
		HttpSession session = request.getSession();
		Employee2 loginEmp = (Employee2)session.getAttribute("loginEmp");
		
		Map<String, Object> map = service.selectComList(loginEmp, cp, date);
		
		model.addAttribute("pagination", map.get("pagination"));
		model.addAttribute("comList", map.get("comList"));
		model.addAttribute("date", date);
		
		String companyCreateDate = service.getCompanyCreateDate(loginEmp);
		model.addAttribute("companyCreateDate", companyCreateDate);
		
		return "admin/attendence/attendenceManager";
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
					       @RequestParam(value="cp", required=false, defaultValue="1") int cp,
					       @RequestParam(value="date", required=false, defaultValue="null") String date) {
		
		HttpSession session = request.getSession();
		Employee2 loginEmp = (Employee2)session.getAttribute("loginEmp");
		data.put("comNo", loginEmp.getComNo());
		data.put("date", date);
		
		Map<String, Object> selectDeptList = service.selectDeptList(data, cp);
		
		model.addAttribute("pagination", selectDeptList.get("pagination"));
		model.addAttribute("deptList", selectDeptList.get("deptList"));
		model.addAttribute("deptNo", data.get("deptNo"));
		model.addAttribute("date", date);
		
		String companyCreateDate = service.getCompanyCreateDate(loginEmp);
		model.addAttribute("companyCreateDate", companyCreateDate);

		return "admin/attendence/attendenceManager";
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
					       @RequestParam(value="cp", required=false, defaultValue="1") int cp,
					       @RequestParam(value="date", required=false, defaultValue="null") String date) {
		
		HttpSession session = request.getSession();
		Employee2 loginEmp = (Employee2)session.getAttribute("loginEmp");
		data.put("comNo", loginEmp.getComNo());
		data.put("date", date);
		
		String[] arr = ((String)data.get("teamNo")).split("/");
		data.put("deptNo", arr[0]);
		data.put("teamNo", arr[1]);
		
		Map<String, Object> selectTeamList = service.selectTeamList(data, cp);
		
		model.addAttribute("pagination", selectTeamList.get("pagination"));
		model.addAttribute("teamList", selectTeamList.get("teamList"));
		model.addAttribute("teamNo", data.get("deptNo") + "/" + data.get("teamNo"));
		model.addAttribute("date", date);
		
		String companyCreateDate = service.getCompanyCreateDate(loginEmp);
		model.addAttribute("companyCreateDate", companyCreateDate);

		return "admin/attendence/attendenceManager";
	}
	
}