package com.cowork.employee.edsm.controller;

import java.io.IOException;
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
import com.cowork.admin.edsm.model.service.AdminEdsmService;
import com.cowork.employee.edsm.model.dto.DraftKeep;
import com.cowork.employee.edsm.model.dto.Edsm;
import com.cowork.employee.edsm.model.service.EdsmService;
import com.cowork.user.model.dto.Employee2;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Controller
@Slf4j
@RequiredArgsConstructor
@RequestMapping("employee/edsm")
public class EdsmController {
	
	private final EdsmService service;

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
		paramMap.put("empCode", loginEmp.getEmpCode());
		
		// 조회 서비스 호출 후 결과 반환
		Map<String, Object> map = service.edsmDraftList(paramMap);
		
		model.addAttribute("draftList", map.get("draftList"));
		model.addAttribute("draftKeepList", map.get("draftKeepList"));
		
		return "employee/edsm/edsmDraftList";
	}
	
	/** 자주쓰는 결재
	 * @param draftNo
	 * @param keepYn
	 * @param loginEmp
	 * @param ra
	 * @return
	 */
	@GetMapping("draftKeepYn/{draftNo:[0-9]+}")
	public String draftKeepYn(
				@PathVariable("draftNo") int draftNo,
				@RequestParam("keepYn") String keepYn,
				@SessionAttribute("loginEmp") Employee2 loginEmp,
				RedirectAttributes ra
			) {
		
		if(keepYn.equals("Y")) keepYn = "N";
		else if(keepYn.equals("N")) keepYn = "Y";
		
		DraftKeep draftKeep = DraftKeep.builder()
						.draftNo(draftNo)
						.empCode(loginEmp.getEmpCode())
						.keepYn(keepYn)
						.build();
		
		int result = service.draftKeepYn(draftKeep);
		
		if(result == 0) ra.addFlashAttribute("message", "자주찾는 결제 수정 실패");
		
		return "redirect:../edsmDraftList";
	}
	
	/** 전자결재 신청 화면
	 * @return
	 */
	@GetMapping("edsmRequest/{draftNo:[0-9]+}")
	public String edsmRequest(
				@PathVariable("draftNo") int draftNo,
				@SessionAttribute("loginEmp") Employee2 loginEmp,
				Model model
			) {
		
		Map<String, Object> map = service.edsmDetailDraft(draftNo, loginEmp.getComNo());
		
		model.addAttribute("draft", map.get("draft"));
		model.addAttribute("employeeList", map.get("employeeList"));
		
		return "employee/edsm/edsmRequest";
	}
	
	public Model edsmSerach(
				@RequestParam("empFirstName") String empFirstName,
				Model model
			) {
		
		Employee2 employeeList = service.edsmSerach(empFirstName);
		
		model.addAttribute("employeeList", employeeList);
		
		return model;
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
				@RequestParam("edsmTitle") String edsmTitle,
	            @RequestParam("edsmContent") String edsmContent,
	            @RequestParam("draftNo") int draftNo,
	            @RequestParam("approver") String approver, /* 결재자 */
	            @RequestParam("referrer") String referrer, /* 참조자 */
	            //@RequestParam("approvers") Map<Integer, String> approverMap,
	            @SessionAttribute("loginEmp") Employee2 loginEmp, 
				@RequestParam(value="files", required=false) List<MultipartFile> files,
				RedirectAttributes ra
			) throws IllegalStateException, IOException {
		
		edsmContent = edsmContent.replaceAll("<div\\s+align=\"\"\\s+style=\"\">|</div><p><br></p>", "");
		
		Edsm inputEdsm = Edsm.builder()
				.edsmTitle(edsmTitle)
				.edsmContent(edsmContent)
				.empCode(loginEmp.getEmpCode())
				.draftNo(draftNo)
				.build();
		
		int result = service.edsmRequest(inputEdsm, files, approver , referrer);
		
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
