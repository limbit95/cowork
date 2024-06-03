package com.cowork.admin.notice.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.session.RowBounds;

import com.cowork.employee.notice.model.dto.Notice;

@Mapper
public interface AdminNoticeMapper {

	/** 게시글 수 조회
	 * @return
	 */
	int getNoticeListCount();

	/** 공지사항 조회
	 * @param rowBounds
	 * @return
	 */
	List<Notice> noticeList(RowBounds rowBounds);

}
