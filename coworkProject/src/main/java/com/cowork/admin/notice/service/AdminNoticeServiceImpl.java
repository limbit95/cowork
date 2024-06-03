package com.cowork.admin.notice.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.RowBounds;
import org.springframework.stereotype.Service;

import com.cowork.admin.notice.mapper.AdminNoticeMapper;
import com.cowork.common.utility.model.dto.Pagination;
import com.cowork.employee.notice.model.dto.Notice;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdminNoticeServiceImpl implements AdminNoticeService {
	
	private final AdminNoticeMapper mapper;

	@Override
	public Map<String, Object> noticeList(int cp) {
		// 게시글 수 조회
		int listCount = mapper.getNoticeListCount();
		
		// pagination
		Pagination pagination = new Pagination(cp, listCount);
		
		// 지정된 크기 만큼 건너띄고(offset) 제한된 크기(limit)만큼의 행을 조회
		int limit = pagination.getLimit();
		int offset = (cp - 1) * limit;
		RowBounds rowBounds = new RowBounds(offset, limit);
		
		List<Notice> noticeList = mapper.noticeList(rowBounds);
		
		Map<String, Object> map = new HashMap<>();
		
		map.put("pagination", pagination);
		map.put("noticeList", noticeList);
		
		return map;
	}

}
