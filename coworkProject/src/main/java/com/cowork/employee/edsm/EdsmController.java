package com.cowork.employee.edsm;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;


import lombok.extern.slf4j.Slf4j;

@Controller
@Slf4j
@RequestMapping("employee/edsm")
public class EdsmController {

	/** 전자결재 기안서 양식 목록
	 * @return
	 */
	@GetMapping("edsmDraftList")
	public String edsmDraftList() {
		
		return "employee/edsm/edsmDraftList";
	}
	
	/** 전자결재 신청
	 * @return
	 */
	@GetMapping("edsmRequest")
	public String edsmRequest() {
		
		return "employee/edsm/edsmRequest";
	}
	
	/** 전자결재 상세
	 * @return
	 */
	@GetMapping("edsmDetail")
	public String edsmDetail() {
		
		return "employee/edsm/edsmDetail";
	}
}
