package com.cowork.admin.position;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

import lombok.extern.slf4j.Slf4j;

@Controller
@Slf4j
public class PositionManageController {

	@GetMapping("positionManage")
	public String positionManage() {
		return "admin/position/positionManage";
	}
	
}
