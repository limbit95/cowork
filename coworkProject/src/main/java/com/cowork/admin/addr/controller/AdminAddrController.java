package com.cowork.admin.addr.controller;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.SessionAttributes;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.cowork.admin.addr.model.service.AdminAddrService;
import com.cowork.admin.companyInfo.model.dto.Department;
import com.cowork.admin.companyInfo.model.dto.Team;
import com.cowork.employee.addr.model.dto.MyAddr;
import com.cowork.employee.addr.model.service.AddrService;
import com.cowork.user.model.dto.Employee2;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import oracle.jdbc.proxy.annotation.Post;

@Slf4j
@Controller
@RequiredArgsConstructor
@RequestMapping("admin/addr")
@SessionAttributes({"empDetail", "backPageLocation", "comAddrList"})
public class AdminAddrController {
	
	private final AdminAddrService service;
	
	private final AddrService addrService;
	
	/** 회사 주소록 부서, 팀 조회
	 * @param request
	 * @param model
	 * @param map
	 * @param cp
	 * @return
	 */
	@GetMapping("")
	public String adminAddrMain(HttpServletRequest request, 
							    Model model) {
		
		HttpSession session = request.getSession();
		Employee2 loginEmp = (Employee2)session.getAttribute("loginEmp");
		
		List<Department> comAddrList = service.selectComAddrList(loginEmp);
		
		model.addAttribute("comAddrList", comAddrList);
		
		return "admin/addr/addrBookManager";
	}
	
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
		
		Map<String, Object> map = service.selectComList(loginEmp, cp);
		
		model.addAttribute("pagination", map.get("pagination"));
		model.addAttribute("comList", map.get("comList"));
		
		return "admin/addr/addrBookManager";
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
		
		Map<String, Object> selectDeptList = service.selectDeptList(data, cp);
		
		model.addAttribute("pagination", selectDeptList.get("pagination"));
		model.addAttribute("deptList", selectDeptList.get("deptList"));
		model.addAttribute("deptNo", data.get("deptNo"));
		
		return "admin/addr/addrBookManager";
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
		
		Map<String, Object> selectTeamList = service.selectTeamList(data, cp);
		
		model.addAttribute("pagination", selectTeamList.get("pagination"));
		model.addAttribute("teamList", selectTeamList.get("teamList"));
		model.addAttribute("teamNo", data.get("deptNo") + "/" + data.get("teamNo"));
		
		return "admin/addr/addrBookManager";
	}
	
	
	
	/** 주소록에 등록된 사원 정보 상세 조회
	 * @return
	 */
	@ResponseBody
	@PostMapping("employeeDetail")
	public Employee2 employeeDetail(@RequestBody Map<String, Object> map, 
									HttpServletRequest request,
									Model model) {
		
		HttpSession session = request.getSession();
		Employee2 loginEmp = (Employee2)session.getAttribute("loginEmp");
		
		map.put("comNo", loginEmp.getComNo());
		
		Employee2 empDetail = addrService.empDetail(map);
		
		model.addAttribute("empDetail", empDetail);
		model.addAttribute("backPageLocation", map.get("backPageLocation"));
		
		return empDetail;
	}
	
	/** 사원 정보 상세 조회 페이지로 이동
	 * @return
	 */
	@GetMapping("employeeDetailPage")
	public String employeeDetail() {
		return "admin/addr/employeeDetail";
	}
	
	/** 사원 정보 수정 페이지에서 부서 select 태그 서 선택한 부서 기준 하위 팀 리스트만 조회
	 * @param map
	 * @return
	 */
	@ResponseBody
	@PostMapping("getTeamList")
	public List<Team> getTeamList(@RequestBody Map<String, Object> map){
		log.info("map : " + map);
		return service.getTeamList(map);
	}
	
	/** 회사 주소록 그룹 CRUD
	 * @param data
	 * @return
	 */
	@ResponseBody
	@PostMapping("insertGroupList")
	public int insertGroupList(@RequestBody List<List<Map<String, Object>>> data,
							   HttpServletRequest request) {
		
		HttpSession session = request.getSession();
		Employee2 loginEmp = (Employee2)session.getAttribute("loginEmp");
		
		return service.insertGroupList(data, loginEmp);
	}

	
	
	@GetMapping("employeeUpdate")
	public String employeeUpdate() {
		return "admin/addr/employeeUpdate";
	}
	
	@PostMapping("employeeUpdate")
	public String employeeUpdate(RedirectAttributes ra) {
		return "redirect:/admin/addr/employeeDetailPage";
	}

}