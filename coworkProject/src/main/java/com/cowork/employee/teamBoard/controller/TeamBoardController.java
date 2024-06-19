package com.cowork.employee.teamBoard.controller;

import java.io.IOException;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.SessionAttribute;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.cowork.admin.notice.model.service.AdminNoticeService;
import com.cowork.employee.teamBoard.model.dto.TeamBoard;
import com.cowork.employee.teamBoard.model.service.TeamBoardService;
import com.cowork.user.model.dto.Employee2;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Controller
@Slf4j
@RequiredArgsConstructor
@RequestMapping("teamBoard")
public class TeamBoardController {
	
	private final TeamBoardService service;

	/** 팀 게시판 목록
	 * @return
	 */
	@GetMapping("teamBoardList")
	public String teamBoardList(
				@SessionAttribute("loginEmp") Employee2 loginEmp,
				@RequestParam(value="combo", required=false, defaultValue="0") String combo,
				@RequestParam(value="cp", required=false, defaultValue="1") int cp,
				Model model,
				@RequestParam Map<String, Object> paramMap
			) {
		
		paramMap.put("comNo", loginEmp.getComNo());
		paramMap.put("teamNo", loginEmp.getTeamNo());
		paramMap.put("combo", combo);
		
		// 조회 서비스 호출 후 결과 반환
		Map<String, Object> map = service.teamBoardList(paramMap, cp);
		
		model.addAttribute("pagination", map.get("pagination"));
		model.addAttribute("teamBoardList", map.get("teamBoardList"));
		
		return "employee/teamBoard/teamBoardList";
	}
	
	/** 팀 게시판 상세
	 * @return
	 */
	@GetMapping("teamBoardDetail/{teamBoardNo:[0-9]+}")
	public String teamBoardDetail(
				@PathVariable("teamBoardNo") int teamBoardNo,
				Model model,
				RedirectAttributes ra
			) {
		
		Map<String, Object> map = service.teamBoardDetail(teamBoardNo);
		
		String path = null;
		
		if(map.get("teamBoard") == null) {
			
			path = "redirect:../teamBoardList";
			ra.addFlashAttribute("message", "게시글이 존재하지 않습니다");
		} else {
			
			path = "employee/teamBoard/teamBoardDetail";
			
			model.addAttribute("teamBoard", map.get("teamBoard"));
			model.addAttribute("fileList", map.get("fileList"));
		}
		
		return path;
	}
	
	/** 팀 게시판 등록 화면
	 * @return
	 */
	@GetMapping("teamBoardInsert")
	public String teamBoardInsert() {
		
		return "employee/teamBoard/teamBoardInsert";
	}
	
	/** 팀 게시판 등록
	 * @return
	 */
	@ResponseBody
	@PostMapping("teamBoardInsert")
	public int teamBoardInsert(
				@RequestParam("teamBoardTitle") String teamBoardTitle,
	            @RequestParam("teamBoardContent") String teamBoardContent,
	            @RequestParam("teamFlag") String teamFlag,
	            @SessionAttribute("loginEmp") Employee2 loginEmp, 
				@RequestParam(value="files", required=false) List<MultipartFile> files,
				RedirectAttributes ra
			) throws IllegalStateException, IOException {
		
		teamBoardContent = teamBoardContent.replaceAll("<div\\s+align=\"\"\\s+style=\"\">|</div><p><br></p>", "");
		
		TeamBoard inputTeamBoard = TeamBoard.builder()
						.teamBoardTitle(teamBoardTitle)
						.teamBoardContent(teamBoardContent)
						.empCode(loginEmp.getEmpCode())
						.teamNo(loginEmp.getTeamNo())
						.teamFlag(teamFlag)
						.build();
		
		return service.teamBoardInsert(inputTeamBoard, files);
	}
	
	/** 팀 게시판 수정
	 * @return
	 */
	@GetMapping("teamBoardUpdate")
	public String teamBoardUpdate() {
		
		return "employee/teamBoard/teamBoardUpdate";
	}

}
