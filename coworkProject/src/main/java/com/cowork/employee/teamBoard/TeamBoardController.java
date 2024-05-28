package com.cowork.employee.teamBoard;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import lombok.extern.slf4j.Slf4j;

@Controller
@Slf4j
@RequestMapping("employee/teamBoard")
public class TeamBoardController {

	/** 팀 게시판 목록
	 * @return
	 */
	@GetMapping("teamBoardList")
	public String teamBoardList() {
		
		return "employee/teamBoard/teamBoardList";
	}
	
	/** 팀 게시판 등록
	 * @return
	 */
	@GetMapping("teamBoardInsert")
	public String teamBoardInsert() {
		
		return "employee/teamBoard/teamBoardInsert";
	}
}
