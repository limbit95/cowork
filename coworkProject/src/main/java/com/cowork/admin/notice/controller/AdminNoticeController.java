package com.cowork.admin.notice.controller;

import java.util.Map;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.cowork.admin.notice.service.AdminNoticeService;

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
				Model model
			) {
		
		// 조회 서비스 호출 후 결과 반환
		Map<String, Object> map = service.noticeList(cp);
		
		model.addAttribute("pagination", map.get("pagination"));
		model.addAttribute("noticeList", map.get("noticeList"));
		
		return "admin/notice/noticeList";
	}
	
	/** 공지사항 등록
	 * @return
	 */
	@GetMapping("noticeInsert")
	public String noticeInsert() {
		
		return "admin/notice/noticeInsert";
	}
	
	/** 공지사항 수정
	 * @return
	 */
	@GetMapping("noticeUpdate")
	public String noticeUpdate() {
		
		return "admin/notice/noticeUpdate";
	}
	
	/** 공지사항 수정
	 * @return
	 */
	@GetMapping("noticeDetail")
	public String noticeDetail() {
		
		return "admin/notice/noticeDetail";
	}
}
