package com.cowork.admin.addr.controller;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.SessionAttributes;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.cowork.admin.addr.model.service.AdminAddrService;
import com.cowork.admin.companyInfo.model.dto.Department;
import com.cowork.employee.addr.model.dto.MyAddr;
import com.cowork.user.model.dto.Employee2;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Controller
@RequiredArgsConstructor
@RequestMapping("admin/addr")
@SessionAttributes({"comAddrList"})
public class AdminAddrController {
	
	private final AdminAddrService service;
	
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
	
	
	
	
	
	
	@GetMapping("employeeDetail")
	public String employeeDetail() {
		return "admin/addr/employeeDetail";
	}
	
	@GetMapping("employeeUpdate")
	public String employeeUpdate() {
		return "admin/addr/employeeUpdate";
	}
	
	@PostMapping("employeeUpdate")
	public String employeeUpdate(RedirectAttributes ra) {
		return "redirect:/admin/addr/employeeDetail";
	}

}