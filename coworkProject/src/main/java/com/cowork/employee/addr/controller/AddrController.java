package com.cowork.employee.addr.controller;

import java.util.HashMap;
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
import org.springframework.web.bind.annotation.SessionAttribute;
import org.springframework.web.bind.annotation.SessionAttributes;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.cowork.admin.addr.model.service.AdminAddrService;
import com.cowork.admin.companyInfo.model.dto.Department;
import com.cowork.employee.addr.model.dto.MyAddr;
import com.cowork.employee.addr.model.service.AddrService;
import com.cowork.user.model.dto.Employee2;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Controller
@RequiredArgsConstructor
@RequestMapping("employee/addr")
@SessionAttributes({"groupList", "empDetail", "backPageLocation"})
public class AddrController {
	
	private final AddrService service;

	private final AdminAddrService adminAddrService;
	
	/** 개인 주소록 그룹 조회 및 그룹 리스트 조회
	 * @return
	 */
	@GetMapping("")
	public String addr(HttpServletRequest request, 
					   Model model, 
					   @RequestParam Map<String, Object> map, 
					   @RequestParam(value="cp", required=false, defaultValue="1") int cp
					   ) {
		
		HttpSession session = request.getSession();
		Employee2 loginEmp = (Employee2)session.getAttribute("loginEmp");
		
		List<MyAddr> groupList = service.selectGroupList(loginEmp);
		model.addAttribute("groupList", groupList);
		
		return "employee/addr/addrBook";
	}
	
	
	@GetMapping("myGroup")
	public String addrGroupList(HttpServletRequest request, 
					   Model model, 
					   @RequestParam Map<String, Object> map, 
					   @RequestParam(value="cp", required=false, defaultValue="1") int cp
					   ) {
		
		HttpSession session = request.getSession();
		Employee2 loginEmp = (Employee2)session.getAttribute("loginEmp");
		
		map.put("empCode", loginEmp.getEmpCode());
		
		Map<String, Object> selectAddrList = service.selectAddrList(map, cp);
		
		model.addAttribute("pagination", selectAddrList.get("pagination"));
		model.addAttribute("addrList", selectAddrList.get("addrList"));
		model.addAttribute("groupCode", selectAddrList.get("groupCode"));
		model.addAttribute("empCode", selectAddrList.get("empCode"));
		
		List<MyAddr> groupList = service.selectGroupList(loginEmp);
		model.addAttribute("groupList", groupList);
		
		return "employee/addr/addrBook";
	}
	
	
	
	/** 개인 주소록 그룹 저장
	 * @param map
	 * @return
	 */
	@ResponseBody
	@PostMapping("insertGroupList")
	public int insertGroupList(@RequestBody List<Map<String, Object>> map) {
		// 로그인 회원 번호 다른 변수에 값 담고
		String loginEmpCode = String.valueOf(map.get(0).get("loginEmpCode"));
		// map 안에서 삭제 -> 불필요 하기 때문에
		map.remove(0);
		
		int result = service.insertGroupList(map, loginEmpCode);
		
		return result;
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
		
		Employee2 empDetail = service.empDetail(map);
		
		model.addAttribute("empDetail", empDetail);
		model.addAttribute("backPageLocation", map.get("backPageLocation"));
		
		return empDetail;
	}
	
	/** 사원 정보 상세 조회 페이지로 이동
	 * @return
	 */
	@GetMapping("employeeDetailPage")
	public String employeeDetail(@SessionAttribute("loginEmp") Employee2 loginEmp,
								 Model model) {
		
		List<MyAddr> groupList = service.selectGroupList(loginEmp);
		model.addAttribute("groupList", groupList);
		
		return "employee/addr/userEmployeeDetail";
	}
	
	
	/** 개인 주소록에 등록한 사원 삭제
	 * @param map
	 * @param model
	 * @return
	 */
	@ResponseBody
	@PostMapping("deleteAddr")
	public int employeeDetail(@RequestBody List<Map<String, Object>> map,
							  HttpServletRequest request) {
		
		HttpSession session = request.getSession();
		Employee2 loginEmp = (Employee2)session.getAttribute("loginEmp");
		
		if(map.get(0).get("groupCode").equals("myAll")) {
			List<Integer> myAddrList = service.selectAllMyAddr(loginEmp);
			
			if(myAddrList.isEmpty()) {
				return 0;
			}
			
			return service.deleteAllMyAddr(myAddrList);
		}
		
		
		return service.deleteAddr(map);
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
		
		List<MyAddr> groupList = service.selectGroupList(loginEmp);
		model.addAttribute("groupList", groupList);

		return "employee/addr/addrBook";
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

		List<MyAddr> groupList = service.selectGroupList(loginEmp);
		model.addAttribute("groupList", groupList);

		return "employee/addr/addrBook";
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
		
		List<MyAddr> groupList = service.selectGroupList(loginEmp);
		model.addAttribute("groupList", groupList);

		return "employee/addr/addrBook";
	}
	
	/** 개인 주소록에 사원 추가
	 * @param request
	 * @param data
	 * @return
	 */
	@ResponseBody
	@PostMapping("addAddr")
	public int addAddr(HttpServletRequest request,
					   @RequestBody List<Map<String, Object>> data) {
		
		HttpSession session = request.getSession();
		Employee2 loginEmp = (Employee2)session.getAttribute("loginEmp");
		
		return service.addAddr(data);
	}
	
	
	
	
	
	
	
	
	
	
}