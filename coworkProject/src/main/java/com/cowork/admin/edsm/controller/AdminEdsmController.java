package com.cowork.admin.edsm.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import lombok.extern.slf4j.Slf4j;

@Controller
@Slf4j
@RequestMapping("admin/edsm")
public class AdminEdsmController {
	
	/** 전자결재 문서 관리
	 * @return
	 */
	@GetMapping("edsmList")
	public String edsmList() {
		
		return "admin/edsm/edsmList";
	}
	
	/** 전자결재 문서 관리
	 * @return
	 */
	@GetMapping("edsmCreateDraft")
	public String edsmCreateDraft() {
		
		return "admin/edsm/edsmCreateDraft";
	}
}
