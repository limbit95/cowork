package com.cowork.admin.notice.service;

import java.util.Map;

public interface AdminNoticeService {

	/** 공지사항 조회
	 * @param cp
	 * @return
	 */
	Map<String, Object> noticeList(int cp);

}
