package com.cowork.admin.notice.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import lombok.extern.slf4j.Slf4j;

@Controller
@Slf4j
@RequestMapping("admin/notice")
public class AdminNoticeController {

	/** 공지사항 목록
	 * @return
	 */
	@GetMapping("noticeList")
	public String noticeList(
				
			) {
		
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
