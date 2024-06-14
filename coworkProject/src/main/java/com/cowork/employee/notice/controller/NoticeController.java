package com.cowork.employee.notice.controller;

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
import com.cowork.employee.notice.model.dto.Notice;
import com.cowork.user.model.dto.Employee2;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Controller
@Slf4j
@RequiredArgsConstructor
@RequestMapping("employee/notice")
public class NoticeController {
	
	private final AdminNoticeService service;

	/** 공지사항 목록
	 * @return
	 */
	@GetMapping("noticeList")
	public String noticeList(
				@SessionAttribute("loginEmp") Employee2 loginEmp,
				@RequestParam(value="cp", required=false, defaultValue="1") int cp,
				Model model,
				@RequestParam Map<String, Object> paramMap
			) {
		
		paramMap.put("comNo", loginEmp.getComNo());
		
		// 조회 서비스 호출 후 결과 반환
		Map<String, Object> map = service.noticeList(paramMap, cp);
		
		model.addAttribute("pagination", map.get("pagination"));
		model.addAttribute("noticeList", map.get("noticeList"));
		
		return "employee/notice/noticeList";
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
		
		Map<String, Object> map = service.noticeDetail(noticeNo);
		
		String path = null;
		
		if(map.get("notice") == null) {
			
			path = "redirect:/noticeList";
			ra.addFlashAttribute("message", "게시글이 존재하지 않습니다");
		} else {
			
			path = "employee/notice/noticeDetail";
			
			model.addAttribute("notice", map.get("notice"));
			model.addAttribute("fileList", map.get("fileList"));
		}
		
		return "employee/notice/noticeDetail";
	}
	
	
	
}
