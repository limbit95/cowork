package com.cowork.employee.teamBoard.controller;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.SessionAttribute;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.cowork.employee.teamBoard.model.dto.Comment;
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
		//paramMap.put("combo", combo);
		
		paramMap.put("empCode", loginEmp.getEmpCode());
		
		// 조회 서비스 호출 후 결과 반환
		Map<String, Object> map = service.teamBoardList(paramMap, cp);
		
		model.addAttribute("pagination", map.get("pagination"));
		model.addAttribute("teamBoardList", map.get("teamBoardList"));
		
		return "employee/teamBoard/teamBoardList";
	}
	
	/** 권한여부 확인
	 * @return
	 */
	@ResponseBody
	@GetMapping("teamAuthorityList")
	public Map<String, Object> teamAuthorityList(
				@SessionAttribute("loginEmp") Employee2 loginEmp
			) {
		
		Map<String, Object> paramMap = new HashMap<>();
		
		paramMap.put("comNo", loginEmp.getComNo());
		paramMap.put("teamNo", loginEmp.getTeamNo());
		paramMap.put("empCode", loginEmp.getEmpCode());
		
		// 조회 서비스 호출 후 결과 반환
		Map<String, Object> map = service.teamAuthorityList(paramMap);
		
		return map;
		
	}
	
	/** 사원별 권한 처리
	 * @param authorityList
	 * @return
	 */
	@ResponseBody
	@PostMapping("teamAuthorityManage")
	public int teamAuthorityManage(
				@RequestBody List<Employee2> authorityList
			) {
		
		log.info(authorityList.size() + "ddd");
		
		int result = service.teamAuthorityManage(authorityList);
		
		log.info("result : " + result);
		
		return result;
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
	
	/** 팀 게시판 수정 화면
	 * @return
	 */
	@GetMapping("teamBoardUpdate/{teamBoardNo:[0-9]+}")
	public String teamBoardUpdate(
				@PathVariable("teamBoardNo") int teamBoardNo,
				Model model
			) {
		
		Map<String, Object> map = service.teamBoardDetail(teamBoardNo);
		
		model.addAttribute("teamBoard", map.get("teamBoard"));
		model.addAttribute("fileList", map.get("fileList"));
		
		return "employee/teamBoard/teamBoardUpdate";
	}
	
	/** 팀 게시판 수정
	 * @return
	 */
	@ResponseBody
	@PostMapping("teamBoardUpdate/{teamBoardNo:[0-9]+}")
	public int teamBoardUpdate(
			@PathVariable("teamBoardNo") int teamBoardNo,
			@RequestParam("teamBoardTitle") String teamBoardTitle,
			@RequestParam("teamFlag") String teamFlag,
            @RequestParam("teamBoardContent") String teamBoardContent,
            @SessionAttribute("loginEmp") Employee2 loginEmp, 
            @RequestParam(value="files", required=false) List<MultipartFile> files,
            @RequestParam(value="deleteOrder", required = false) String deleteOrder, /* 삭제 */
            @RequestParam(value="updateOrder", required=false) String updateOrder, /* 기존 */
            @RequestParam(value="queryString", required = false, defaultValue="") String querystring
			) throws IllegalStateException, IOException {
		
		teamBoardContent = teamBoardContent.replaceAll("<div\\s+align=\"\"\\s+style=\"\">|</div><p><br></p>", "");
		
		TeamBoard inputTeamBoard = TeamBoard.builder()
				.teamBoardNo(teamBoardNo)
				.teamBoardTitle(teamBoardTitle)
				.teamBoardContent(teamBoardContent)
				.teamFlag(teamFlag)
				.build();
		
		return service.teamBoardUpdate(inputTeamBoard, files, deleteOrder, updateOrder);
	}
	
	/** 팀게시판 삭제
	 * @return
	 */
	@GetMapping("teamBoardDelete")
	public String teamBoardDelete(
				@RequestParam("teamBoardNo") int teamBoardNo,
				RedirectAttributes ra
			) {
		
		int result = service.teamBoardDelete(teamBoardNo);
		
		String path = null;
		String message = null;
		
		if(result > 0) {
			path = "redirect:teamBoardList";
			message = "게시글이 삭제되었습니다.";
		} else {
			path = "redirect:teamBoardDetail/" + teamBoardNo;
			message = "게시글 삭제 실패";
		}
		
		ra.addFlashAttribute("message", message);
		
		return path;
		
	}
	
	/*******************/
	
	/** 댓글 목록 조회
	 * @param teamBoardNo
	 * @return
	 */
	@ResponseBody
	@GetMapping("comment")
	public List<Comment> commentList(
				@RequestParam("teamBoardNo") int teamBoardNo
			) {
		return service.commentList(teamBoardNo);
	}
	
	/** 댓글/답글 등록
	 * @param comment
	 * @return
	 */
	@ResponseBody
	@PostMapping("comment")
	public int commentInsert(
				@RequestBody Comment comment,
				@SessionAttribute("loginEmp") Employee2 loginEmp
			) {
		
		comment.setEmpCode(loginEmp.getEmpCode());
		
		return service.commentInsert(comment);
	}
	
	/** 댓글/답글 수정
	 * @param comment
	 * @return
	 */
	@ResponseBody
	@PutMapping("comment")
	public int commentUpdate(@RequestBody Comment comment) {
		
		return service.commentUpdate(comment);
	}
	
	/** 댓글/답글 삭제
	 * @param commentNo
	 * @return
	 */
	@ResponseBody
	@DeleteMapping("comment")
	public int commentDelete(@RequestBody int commentNo) {
		
		return service.commentDelete(commentNo);
	}

}
