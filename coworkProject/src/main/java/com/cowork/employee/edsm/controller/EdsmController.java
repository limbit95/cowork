package com.cowork.employee.edsm.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.SessionAttribute;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.cowork.admin.edsm.model.dto.Draft;
import com.cowork.admin.edsm.model.service.DraftService;
import com.cowork.user.model.dto.Employee2;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Controller
@Slf4j
@RequiredArgsConstructor
@RequestMapping("employee/edsm")
public class EdsmController {
	
	private final DraftService service;

	/** 전자결재 기안서 양식 목록
	 * @return
	 */
	@GetMapping("edsmDraftList")
	public String edsmDraftList(
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
		
		return "employee/edsm/edsmDraftList";
	}
	
	/** 전자결재 신청 화면
	 * @return
	 */
	@GetMapping("edsmRequest/{draftNo:[0-9]+}")
	public String edsmRequest(
				@PathVariable("draftNo") int draftNo,
				Model model
			) {
		
		Draft draft = service.edsmDetailDraft(draftNo);
		
		model.addAttribute("draft", draft);
		
		return "employee/edsm/edsmRequest";
	}
	
	/** 전자결재 신청
	 * @param noticeTitle
	 * @param noticeContent
	 * @param loginEmp
	 * @param files
	 * @param ra
	 * @return
	 */
	@PostMapping("edsmRequest/{draftNo:[0-9]+}")
	public int edsmRequest(
				@RequestParam("noticeTitle") String noticeTitle,
	            @RequestParam("noticeContent") String noticeContent,
	            @SessionAttribute("loginEmp") Employee2 loginEmp, 
				@RequestParam(value="files", required=false) List<MultipartFile> files,
				RedirectAttributes ra
			) {
		
		int result = 0;
		
		return result;
	}
	
	/** 전자결재 상세
	 * @return
	 */
	@GetMapping("edsmDetail")
	public String edsmDetail() {
		
		return "employee/edsm/edsmDetail";
	}
	
	/** 전자결재 내역
	 * @return
	 */
	@GetMapping("edsmHistory")
	public String edsmHistory() {
		
		return "employee/edsm/edsmHistory";
	}
}
