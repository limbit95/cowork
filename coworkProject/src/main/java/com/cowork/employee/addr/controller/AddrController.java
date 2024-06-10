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
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

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
public class AddrController {
	
	private final AddrService service;
	
	/** 개인 주소록 그룹 조회
	 * @return
	 */
	@GetMapping("")
	public String addr(HttpServletRequest request, 
					   Model model) {
		
		HttpSession session = request.getSession();
		Employee2 loginEmp = (Employee2)session.getAttribute("loginEmp");
		
		List<String> myAddr = service.selectGroupList(loginEmp);
		
		model.addAttribute("myAddr", myAddr);
		
		
		
		return "employee/addr/addrBook";
	}
	
	/** 주소록 그룹에 속한 정보 리스트 조회
	 * @param map
	 * @return
	 */
	@GetMapping("myGroupList")
	public String myGroupList(@RequestParam Map<String, Object> map,
							  @RequestParam(value="cp", required=false, defaultValue="1") int cp,
							  RedirectAttributes ra,
							  Model model) {
		
		Map<String, Object> map2 = service.selectMyAddrList(map, cp);
		
//		ra.addFlashAttribute("pagination", map2.get("pagination"));
//		ra.addFlashAttribute("groupList", map2.get("groupList"));
//		ra.addFlashAttribute("groupCode", map2.get("groupCode"));
//		ra.addFlashAttribute("empCode", map2.get("empCode"));
//		
//		return "redirect:/employee/addr";
		
		model.addAttribute("pagination", map2.get("pagination"));
		model.addAttribute("groupList", map2.get("groupList"));
		model.addAttribute("groupCode", map2.get("groupCode"));
		model.addAttribute("empCode", map2.get("empCode"));

		return "employee/addr/addrBook";
	}
	
	
	@GetMapping("employeeDetail")
	public String employeeDetail() {
		return "employee/addr/userEmployeeDetail";
	}
	
}