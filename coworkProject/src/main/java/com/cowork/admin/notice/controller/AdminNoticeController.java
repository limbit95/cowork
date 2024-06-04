package com.cowork.admin.notice.controller;

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
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.cowork.admin.notice.service.AdminNoticeService;
import com.cowork.employee.chatting.model.dto.Employee;
import com.cowork.employee.notice.model.dto.Notice;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Controller
@Slf4j
@RequiredArgsConstructor
@RequestMapping("admin/notice")
public class AdminNoticeController {
	
	private final AdminNoticeService service;

	/** 공지사항 목록
	 * @return
	 */
	@GetMapping("noticeList")
	public String noticeList(
				@RequestParam(value="cp", required=false, defaultValue="1") int cp,
				Model model,
				@RequestParam Map<String, Object> paramMap
			) {
		
		// 조회 서비스 호출 후 결과 반환
		Map<String, Object> map = service.noticeList(paramMap, cp);
		
		model.addAttribute("pagination", map.get("pagination"));
		model.addAttribute("noticeList", map.get("noticeList"));
		
		return "admin/notice/noticeList";
	}
	
	/** 공지사항 상세
	 * @return
	 */
	@GetMapping("noticeDetail/{noticeNo:[0-9]+}")
	public String noticeDetail(
				@PathVariable("noticeNo") int noticeNo,
				Model model,
				RedirectAttributes ra
			) {
		
		Notice notice = service.noticeDetail(noticeNo);
		
		String path = null;
		
		if(notice == null) {
			
			path = "redirect:admin/notice/noticeList";
			ra.addAttribute("message", "게시글이 존재하지 않습니다");
		} else {
			
			path = "admin/notice/noticeDetail";
			
			model.addAttribute("notice", notice);
		}
		
		return path;
	}
	
	/** 공지사항 등록
	 * @return
	 */
	@GetMapping("noticeInsert")
	public String noticeInsert() {
		
		return "admin/notice/noticeInsert";
	}
	
	/** 공지사항 등록
	 * @return
	 */
	@PostMapping("noticeInsert")
	public String noticeInsert(
				@ModelAttribute Notice inputNotice,
				/*@SeesionAttribute("loginEmployee") Employee loginEmployee,*/
				@RequestParam("files") List<MultipartFile> files,
				RedirectAttributes ra
			) {
		
		inputNotice.setEmpCode(1); /*loginEmployee.getEmpCode()*/
		
		int empNo = service.noticeInsert(inputNotice, files);
		
		return "admin/notice/noticeInsert";
	}
	
	/** 공지사항 수정
	 * @return
	 */
	@GetMapping("noticeUpdate")
	public String noticeUpdate() {
		
		return "admin/notice/noticeUpdate";
	}
	
	
}
