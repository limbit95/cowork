package com.cowork.employee.edsm;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;


import lombok.extern.slf4j.Slf4j;

@Controller
@Slf4j
@RequestMapping("employee/edsm")
public class EdsmController {

	/** 팀 게시판 목록
	 * @return
	 */
	@GetMapping("edsmDraftList")
	public String edsmDraftList() {
		
		return "employee/edsm/edsmDraftList";
	}
}
