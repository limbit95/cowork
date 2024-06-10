package com.cowork.admin.teamBoard.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class AdminTeamBoardController {

	@GetMapping("adminTeamBoard")
	public String meetingRoom() {
		return "admin/teamBoard/teamBoard";
	}
}
