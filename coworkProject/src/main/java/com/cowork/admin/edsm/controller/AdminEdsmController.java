package com.cowork.admin.edsm.controller;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.SessionAttribute;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.cowork.admin.edsm.model.dto.Draft;
import com.cowork.admin.edsm.model.service.DraftService;
import com.cowork.user.model.dto.Employee2;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Controller
@Slf4j
@RequiredArgsConstructor
@RequestMapping("admin/edsm")
public class AdminEdsmController {
	
	private final DraftService service;
	
	/** 전자결재 문서 관리
	 * @return
	 */
	@GetMapping("edsmList")
	public String edsmList(
				@SessionAttribute("loginEmp") Employee2 loginEmp,
				Model model,
				@RequestParam Map<String, Object> paramMap
			) {
		
		paramMap.put("comNo", loginEmp.getComNo());
		
		// 조회 서비스 호출 후 결과 반환
		List<Draft> draftList = service.draftList(paramMap);
		
		model.addAttribute("draftList", draftList);
		
		return "admin/edsm/edsmList";
	}
	
	/** 양식 생성 화면
	 * @return
	 */
	@GetMapping("edsmCreateDraft")
	public String edsmCreateDraft() {
		
		return "admin/edsm/edsmCreateDraft";
	}
	
	/** 양식 생성
	 * @return
	 */
	@PostMapping("edsmCreateDraft")
	public String edsmCreateDraft(
				@ModelAttribute Draft inputDraft,
				@SessionAttribute("loginEmp") Employee2 loginEmp, 
				RedirectAttributes ra
			) {
		
		inputDraft.setComNo(loginEmp.getComNo());
		
		int draftNo = service.edsmCreateDraft(inputDraft);
		String message = null;
		String path = null;;
		
		if(draftNo > 0) {
			message = "기안 양식이 생성되었습니다";
			path = "edsmUpdateDraft/" + draftNo;
		}
		else {
			message = "기안 양식이 생성 실패";
			path = "edsmCreateDraft";
		}
		
		ra.addFlashAttribute("message", message);
		
		return "redirect:" + path;
	}
	
	/** 양식 수정 화면
	 * @return
	 */
	@GetMapping("edsmUpdateDraft")
	public String edsmUpdateDraft() {
		
		return "admin/edsm/edsmUpdateDraft";
	}
}
