package com.cowork.admin.authority.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.SessionAttribute;

import com.cowork.admin.authority.model.service.AuthorityManageSerive;
import com.cowork.user.model.dto.Employee2;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Controller
@Slf4j
@RequiredArgsConstructor
@RequestMapping("authority")
public class AuthorityManageController {
	
	private final AuthorityManageSerive service;
	
	/** 권한관리 화면
	 * @return
	 */
	@GetMapping("authorityManage")
	public String authorityManage() {
		
		return "admin/authority/authorityManage";
	}
	
	/** 권한관리 화면
	 * @return
	 */
	@ResponseBody
	@GetMapping("authorityList")
	public Map<String, Object> authorityList(
				@SessionAttribute("loginEmp") Employee2 loginEmp,
				@RequestParam(value="teamNo", required=false, defaultValue="0") int teamNo,
				@RequestParam(value="deptNo", required=false, defaultValue="0") int deptNo,
				@RequestParam(value="empName", required=false) String empName,
				@RequestParam(value="cp", required=false, defaultValue="1") int cp,
			    Model model,
			    @RequestParam Map<String, Object> paramMap
			) {
		
		paramMap.put("teamNo", teamNo);
		paramMap.put("deptNo", deptNo);
		paramMap.put("empName", empName);
		paramMap.put("comNo", loginEmp.getComNo());
		
		Map<String, Object> map = service.authorityList(paramMap, cp);
		
		Map<String, Object> mapList = new HashMap<>();
		
		mapList.put("pagination", map.get("pagination"));
		mapList.put("authorityList", map.get("authorityList"));
		
		//model.addAttribute("pagination", map.get("pagination"));
		//model.addAttribute("authorityList", map.get("authorityList"));
		
		return mapList;/*"admin/authority/authorityManage";*/
	}
	
	/** 사원별 권한 처리
	 * @param authorityList
	 * @return
	 */
	@ResponseBody
	@PostMapping("authorityManage")
	public int authorityManage(
			@RequestBody List<Employee2> authorityList
			) {
		
		int result = service.authorityManage(authorityList);
		
		return result;
	}
	
}
