package com.cowork.employee.teamBoard.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import lombok.extern.slf4j.Slf4j;

@Controller
@Slf4j
@RequestMapping("teamBoard")
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
	
	/** 팀 게시판 수정
	 * @return
	 */
	@GetMapping("teamBoardUpdate")
	public String teamBoardUpdate() {
		
		return "employee/teamBoard/teamBoardUpdate";
	}
	
	/** 팀 게시판 수정
	 * @return
	 */
	@GetMapping("teamBoardDetail")
	public String teamBoardDetail() {
		
		return "employee/teamBoard/teamBoardDetail";
	}
}
