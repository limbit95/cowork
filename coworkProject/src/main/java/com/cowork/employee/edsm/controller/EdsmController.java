package com.cowork.employee.edsm.controller;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.SessionAttribute;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.cowork.admin.edsm.model.dto.Draft;
import com.cowork.admin.edsm.model.service.AdminEdsmService;
import com.cowork.employee.edsm.model.dto.Approver;
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
	
	/** 결재자, 참조자 검색
	 * @param empFirstName
	 * @param model
	 * @return
	 */
	@ResponseBody
	@GetMapping("edsmSerach")
	public List<Employee2> edsmSerach(
				@RequestParam("empFirstName") String empFirstName,
				@SessionAttribute("loginEmp") Employee2 loginEmp,
				Model model
			) {
		
		return service.edsmSerach(empFirstName, loginEmp.getComNo());
	}
	
	/** 전자결재 신청
	 * @param noticeTitle
	 * @param noticeContent
	 * @param loginEmp
	 * @param files
	 * @param ra
	 * @return
	 */
	@ResponseBody
	@PostMapping("edsmRequest/{draftNo:[0-9]+}")
	public int edsmRequest(
				@RequestParam("edsmTitle") String edsmTitle,
	            @RequestParam("edsmContent") String edsmContent,
	            @PathVariable("draftNo") int draftNo,
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
	
	/** 전자결재 내역
	 * @return
	 */
	@GetMapping("edsmHistory")
	public String edsmHistory(
				@SessionAttribute("loginEmp") Employee2 loginEmp,
				Model model,
				@RequestParam(value="key", required=false) String key
			) {
		
		Map<String, Object> paramMap = new HashMap<>();
		
		if(key != "undefined")  paramMap.put("key", key);
		
		paramMap.put("comNo", loginEmp.getComNo());
		paramMap.put("empCode", loginEmp.getEmpCode());
		
		// 조회 서비스 호출 후 결과 반환
		Map<String, Object> map = service.edsmHistory(paramMap);
		
		model.addAttribute("edsmList", map.get("edsmList"));
		model.addAttribute("draftKeepList", map.get("draftKeepList"));
		
		return "employee/edsm/edsmHistory";
	}
	
	/** 결재 수신
	 * @return
	 */
	@GetMapping("edsmConfirm")
	public String edsmConfirm(
				@SessionAttribute("loginEmp") Employee2 loginEmp,
				Model model,
				@RequestParam(value="key", required=false) String key
			) {
		
		Map<String, Object> paramMap = new HashMap<>();
		
		if(key != "undefined")  paramMap.put("key", key);
		
		paramMap.put("empCode", loginEmp.getEmpCode());
		
		// 조회 서비스 호출 후 결과 반환
		List<Edsm> edsmList = service.edsmConfirm(paramMap);
		
		model.addAttribute("edsmList", edsmList);
		
		return "employee/edsm/edsmConfirm";
	}
	
	/** 전자결재 상세
	 * @return
	 */
	@GetMapping("edsmDetail/{edsmNo:[0-9]+}")
	public String edsmDetail(
				@PathVariable("edsmNo") int edsmNo,
				@RequestParam("approverCode") int approverCode,
				@RequestParam("hrefName") String hrefName,
				@SessionAttribute("loginEmp") Employee2 loginEmp,
				Model model,
				RedirectAttributes ra
			) {
		
		Map<String, Object> map = service.edsmDetail(edsmNo, approverCode, loginEmp.getEmpCode());
		
		String path = null;
		
		if(map.get("edsm") == null) {
			
			path = "redirect:/" + hrefName;
			ra.addFlashAttribute("message", "전자결재가 존재하지 않습니다");
		} else {
			
			path = "employee/edsm/edsmDetail";
			
			model.addAttribute("referrerList", map.get("referrerList"));
			model.addAttribute("approverList", map.get("approverList"));
			model.addAttribute("rejectedContent", map.get("rejectedContent")); 
			model.addAttribute("edsm", map.get("edsm"));
			model.addAttribute("fileList", map.get("fileList"));
			model.addAttribute("hrefName", hrefName);
		}
		
		return path;
	}
	
	/** 전자결재 회수
	 * @return
	 */
	@ResponseBody
	@GetMapping("edsmDelete")
	public int edsmDelete(
				@RequestParam("edsmNo") int edsmNo
			) {
		
		return service.edsmDelete(edsmNo);
	}
	
	/** 전자결재 반려
	 * @param edsmNo
	 * @param loginEmp
	 * @param ra
	 * @return
	 */
	@ResponseBody
	@PostMapping("edsmRejected")
	public int edsmRejected(
				@RequestBody Approver inputApprover,
				@SessionAttribute("loginEmp") Employee2 loginEmp
			) {
		
		inputApprover.setEmpCode(loginEmp.getEmpCode());
		inputApprover.setApproveFlag("2");
		
		return service.edsmRejected(inputApprover);
	}
	
	/** 전자결재 승인
	 * @param edsmNo
	 * @param approverYn
	 * @param loginEmp
	 * @param ra
	 * @return
	 */
	@ResponseBody
	@GetMapping("edsmApprove")
	public int edsmApprove(
				@RequestParam("edsmNo") int edsmNo,
				@RequestParam("approverYn") String approverYn,
				@SessionAttribute("loginEmp") Employee2 loginEmp
			) {
		
		return service.edsmApprove(edsmNo, approverYn, loginEmp.getEmpCode());
	}
	
	/** 결재 완료 화면
	 * @param loginEmp
	 * @param model
	 * @return
	 */
	@GetMapping("edsmApproved")
	public String edsmApproved(
				@SessionAttribute("loginEmp") Employee2 loginEmp,
				Model model
			) {
		
		List<Edsm> edsmList = service.edsmApproved(loginEmp.getEmpCode());
		
		model.addAttribute("edsmList", edsmList);
		
		return "employee/edsm/edsmApproved"; 
	}
}
