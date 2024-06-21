package com.cowork.admin.ipInfo.controller;

import java.util.List;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.SessionAttribute;

import com.cowork.admin.ipInfo.model.dto.IpInfo;
import com.cowork.admin.ipInfo.model.service.IpInfoService;
import com.cowork.user.model.dto.Employee2;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Controller
@Slf4j
@RequiredArgsConstructor
@RequestMapping("ipInfo")
public class IpInfoController {
	
	private final IpInfoService service;
	
	@GetMapping("ipInfoMain")
	public String ipInfoMain(@SessionAttribute("loginEmp") Employee2 loginEmp,
			Model model) {
		
		// comNo로 부서, 팀, ip 등등 다 가져와야함
		List<IpInfo> selectAllIpInfoList = service.selectAllIpInfoList(loginEmp.getComNo());
		
		model.addAttribute("selectAllIpInfoList", selectAllIpInfoList);
		
		return "/admin/ipInfo/ipInfo";
	}
	
}
