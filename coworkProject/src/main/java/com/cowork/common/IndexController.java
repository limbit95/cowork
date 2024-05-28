package com.cowork.common;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class IndexController {

	@GetMapping("common/index")
	public String indexPage() {
		
		return "common/index";
	}
	
}
