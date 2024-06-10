package com.cowork.employee.notice.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import com.cowork.admin.notice.model.service.AdminNoticeService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Controller
@Slf4j
@RequiredArgsConstructor
@RequestMapping("employee/notice")
public class NoticeController {
	
	//private final NoticeService service;

	/** 공지사항 목록
	 * @return
	 */
	@GetMapping("noticeList")
	public String noticeList() {
		
		return "employee/notice/noticeList";
	}
	
	/** 공지사항 등록
	 * @return
	 */
	@GetMapping("noticeInsert")
	public String noticeInsert() {
		
		return "employee/notice/noticeInsert";
	}
	
	/** 공지사항 등록
	 * @return
	 */
	@GetMapping("noticeUpdate")
	public String noticeUpdate() {
		
		return "employee/notice/noticeUpdate";
	}
	
	/** 공지사항 상세
	 * @return
	 */
	@GetMapping("noticeDetail")
	public String noticeDetail() {
		
		return "employee/notice/noticeDetail";
	}
}
