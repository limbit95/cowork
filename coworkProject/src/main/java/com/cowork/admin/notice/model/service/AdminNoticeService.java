package com.cowork.admin.notice.model.service;

import java.io.IOException;
import java.util.List;
import java.util.Map;

import org.springframework.web.multipart.MultipartFile;

import com.cowork.employee.notice.model.dto.Notice;

public interface AdminNoticeService {

	/** 공지사항 조회
	 * @param paramMap 
	 * @param cp
	 * @return
	 */
	Map<String, Object> noticeList(Map<String, Object> paramMap, int cp);

	/** 공지사항 상세
	 * @param noticeNo
	 * @return
	 */
	Map<String, Object> noticeDetail(int noticeNo);

	/** 공지사항 등록
	 * @param inputNotice
	 * @param files
	 * @return
	 */
	int noticeInsert(Notice inputNotice, List<MultipartFile> files) throws IllegalStateException, IOException;

}
