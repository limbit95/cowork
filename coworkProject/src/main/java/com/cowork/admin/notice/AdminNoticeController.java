package com.cowork.admin.notice;

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
	public String noticeList() {
		
		return "admin/notice/noticeList";
	}
	
	/** 공지사항 등록
	 * @return
	 */
	@GetMapping("noticeInsert")
	public String noticeInsert() {
		
		return "admin/notice/noticeInsert";
	}
}
