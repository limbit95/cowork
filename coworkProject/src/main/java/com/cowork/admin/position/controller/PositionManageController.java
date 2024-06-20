package com.cowork.admin.position.controller;

import java.util.List;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.SessionAttribute;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.cowork.admin.position.model.dto.Position;
import com.cowork.admin.position.model.service.PositionService;
import com.cowork.user.model.dto.Employee2;

import lombok.Builder;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Controller
@Slf4j
@RequiredArgsConstructor
@RequestMapping("position")
public class PositionManageController {

	private final PositionService service;
	
	@GetMapping("positionMain")
	public String positionManage(@SessionAttribute("loginEmp") Employee2 loginEmp,
			Model model) {
		
		// 페이지 요청 시 loginEmp 의 comNo 로 회사 직책 조회해오기
		List<Position> positionList = service.positionSelectAll(loginEmp.getComNo());
		
		model.addAttribute("positionList", positionList);
		
		return "admin/position/positionManage";
	}
	
	@GetMapping("positionDelete")
	public String positionDelete(@RequestParam("positionNo") int positionNo,
			@SessionAttribute("loginEmp") Employee2 loginEmp,
			RedirectAttributes ra) {
		
		int comNo = loginEmp.getComNo();
		
		// positionNo 보내서 지워주기
		int result = service.positionDelete(positionNo, comNo);
		
		String message = "";
		
		if(result == -5) {
			message = "기존 직책 업데이트 실패";
		} else if(result > 0) {
			message = "직책 삭제 성공";
			
		} else {
			message = "직책 삭제 실패";
		}
		
		ra.addFlashAttribute("message", message);
		
		return "redirect:positionMain";
	}
	
	@GetMapping("positionInsert")
	public String positionInsert(@RequestParam("positionNm") String positionNm,
			@RequestParam("level") int level,
			@SessionAttribute("loginEmp") Employee2 loginEmp,
			RedirectAttributes ra) {
		
		int comNo = loginEmp.getComNo();
		
		Position inputPosition = new Position();
		
		inputPosition.setPositionNm(positionNm);
		inputPosition.setComNo(comNo);
		inputPosition.setLevel(level);
		
		int result = service.positionInsert(inputPosition);
		
		String message = "";
		
		// result
		if(result > 0) {
			message = "직책 추가 성공";
		} else {
			message = "직책 추가 실패";
		}
		
		ra.addFlashAttribute("message", message);
		
		return "redirect:positionMain";
	}
	
	@GetMapping("positionMiddleInsert")
	public String positionMiddleInsert(@RequestParam("positionNm") String positionNm,
			@RequestParam("level") int level,
			@SessionAttribute("loginEmp") Employee2 loginEmp,
			RedirectAttributes ra) {
		
		Position position = Position.builder()
				.comNo(loginEmp.getComNo())
				.level(level)
				.positionNm(positionNm)
				.build();
		
		int result = service.positionMiddleInsert(position);
		String message = "";
		
		if(result == -5) {
			message = "기존 직책 업데이트 실패";
		} else if (result > 0) {
			message = "직책 추가 성공";
		} else {
			message = "직책 추가 실패";
		}
		
		ra.addFlashAttribute("message", message);
		
		return "redirect:positionMain";
	}
	
	@GetMapping("positionUpdate")
	public String positionUpdate(@RequestParam("positionNo") int positionNo,
			@RequestParam("positionNm") String positionNm,
			RedirectAttributes ra) {
		
		Position position = Position.builder()
				.positionNo(positionNo)
				.positionNm(positionNm)
				.build();
		
		int result = service.positionUpdate(position);
		String message = "";
		
		if(result > 0) {
			message = "직책 수정 성공";
		} else {
			message = "직책 수정 실패";
		}
		
		ra.addFlashAttribute("message", message);
		
		return "redirect:positionMain";
	}
	
}
