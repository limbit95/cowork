package com.cowork.admin.edsm.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
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
				@RequestParam(value="key", required=false) String key
			) {
		
		Map<String, Object> paramMap = new HashMap<>();
		
		if(key != "undefined")  paramMap.put("key", key);
		
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
		
		String content = inputDraft.getDraftContent();
		
		content = content.replaceAll("<div\\s+align=\"\"\\s+style=\"\">|</div><p><br></p>", "");
		
		inputDraft.setDraftContent(content);
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
	@GetMapping("edsmUpdateDraft/{draftNo:[0-9]+}")
	public String edsmUpdateDraft(
				@PathVariable("draftNo") int draftNo,
				Model model
			) {
		
		Draft draft = service.edsmDetailDraft(draftNo);
		
		model.addAttribute("draft", draft);
		
		return "admin/edsm/edsmUpdateDraft";
	}
	
	@PostMapping("edsmUpdateDraft/{draftNo:[0-9]+}")
	public String edsmUpdateDraft(
				@PathVariable("draftNo") int draftNo,
				@ModelAttribute Draft inputDraft,
				RedirectAttributes ra
			) {
		
		String content = inputDraft.getDraftContent();
		
		content = content.replaceAll("<div\\s+align=\"\"\\s+style=\"\">|</div><p><br></p>", "");
		
		inputDraft.setDraftContent(content);
		
		int result = service.edsmUpdateDraft(inputDraft);
		
		String message = null;
		
		if(result > 0) message = "기안 양식이 수정되었습니다";
		else           message = "기안 양식이 수정 실패";
		
		ra.addFlashAttribute("message", message);
		
		return "redirect:../edsmUpdateDraft/" + draftNo;
	}
	
	/** 양식 삭제
	 * @param draftNo
	 * @param ra
	 * @return
	 */
	@GetMapping("edsmDeleteDraft")
	public String edsmDeleteDraft(
				@RequestParam("draftNo") int draftNo,
				RedirectAttributes ra
			) {
		
		int result = service.edsmDeleteDraft(draftNo);
		
		String message = null;
		
		if(result > 0) message = "기안 양식이 삭제되었습니다.";
		else           message = "기안 양식 삭제 실패";
		
		ra.addFlashAttribute("message", message);
		
		return "redirect:edsmList";
	}
}
