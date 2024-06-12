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
import org.springframework.web.bind.annotation.SessionAttributes;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

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
@SessionAttributes({"groupList", "empDetail"})
public class AddrController {
	
	private final AddrService service;
	
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
		
		map.put("empCode", loginEmp.getEmpCode());
		if((map.get("groupName") == null && map.get("groupCode") == null) || 
				(map.get("groupCode") != null && map.get("groupCode").equals("myAll"))) {
			Map<String, Object> selectAllAddrList = service.selectAllAddrList(map, cp);
			
			model.addAttribute("pagination", selectAllAddrList.get("pagination"));
			model.addAttribute("addrList", selectAllAddrList.get("addrList"));
			model.addAttribute("groupCode", selectAllAddrList.get("groupCode"));
		}
		
		if(map.get("groupName") != null || map.get("groupCode") != null) {
			Map<String, Object> selectAddrList = service.selectAddrList(map, cp);
			
			model.addAttribute("pagination", selectAddrList.get("pagination"));
			model.addAttribute("addrList", selectAddrList.get("addrList"));
			model.addAttribute("groupCode", selectAddrList.get("groupCode"));
			model.addAttribute("empCode", selectAddrList.get("empCode"));
		}
		
		return "employee/addr/addrBook";
	}
	
	/** 개인 주소록 그룹 저장
	 * @param map
	 * @return
	 */
	@ResponseBody
	@PostMapping("insertGroupList")
	public int insertGroupList(@RequestBody List<Map<String, String>> map) {
		// 로그인 회원 번호 다른 변수에 값 담고
		String loginEmpCode = map.get(0).get("loginEmpCode");
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
		
		return empDetail;
	}
	
	/** 사원 정보 상세 조회 페이지로 이동
	 * @return
	 */
	@GetMapping("employeeDetailPage")
	public String employeeDetail() {
		return "employee/addr/userEmployeeDetail";
	}
	
	
	/** 개인 주소록에 등록한 사원 삭제
	 * @param map
	 * @param model
	 * @return
	 */
	@ResponseBody
	@PostMapping("deleteAddr")
	public int employeeDetail(@RequestBody List<Map<String, String>> map) {
		return service.deleteAddr(map);
	}
	
}