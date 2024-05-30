package com.cowork.admin.ip;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

import lombok.extern.slf4j.Slf4j;

@Controller
@Slf4j
public class IpController {
	@GetMapping("ip")
	public String ip() {
		return "/admin/ipInfo/ipInfo";
	}
	
}
