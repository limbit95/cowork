package com.cowork.common.main.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class MainController {
	
	/** 메인 페이지
	 * @return
	 */
	@GetMapping("/")
	public String mainPage() {
		
		return "common/main"; 
	}

}
