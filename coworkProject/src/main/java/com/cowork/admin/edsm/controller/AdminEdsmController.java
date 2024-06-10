package com.cowork.admin.edsm.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.cowork.admin.edsm.model.dto.Draft;
import com.cowork.admin.edsm.model.service.DraftService;

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
	public String edsmList() {
		
		return "admin/edsm/edsmList";
	}
	
	/** 전자결재 문서 관리
	 * @return
	 */
	@GetMapping("edsmCreateDraft")
	public String edsmCreateDraft() {
		
		return "admin/edsm/edsmCreateDraft";
	}
	
	/** 전자결재 문서 관리
	 * @return
	 */
	@PostMapping("edsmCreateDraft")
	public String edsmCreateDraft(
				@RequestParam("draftTitle") String draftTitle,
				@RequestParam("draftContent") String draftContent,
				RedirectAttributes ra
			) {
		
		Draft draft = Draft.builder()
				.draftTitle(draftTitle)
				.draftContent(draftContent)
				.build();
		
		//int result = service.edsmCreateDraft();
		
		return "admin/edsm/edsmCreateDraft";
	}
}
