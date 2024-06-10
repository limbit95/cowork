package com.cowork.admin.notice.model.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.session.RowBounds;

import com.cowork.employee.notice.model.dto.BoardFile;
import com.cowork.employee.notice.model.dto.Notice;

@Mapper
public interface AdminNoticeMapper {

	/** 게시글 수 조회
	 * @param paramMap 
	 * @return
	 */
	int getNoticeListCount(Map<String, Object> paramMap);

	/** 공지사항 조회
	 * @param paramMap 
	 * @param rowBounds
	 * @return
	 */
	List<Notice> noticeList(Map<String, Object> paramMap, RowBounds rowBounds);

	/** 공지사항 상세
	 * @param noticeNo
	 * @return
	 */
	Notice noticeDetail(int noticeNo);

	/** 공지사항 등록
	 * @param inputNotice
	 * @return
	 */
	int noticeInsert(Notice inputNotice);

	/** 게시판 다중 이미지 등록
	 * @param uploadList
	 * @return
	 */
	int boardFileinsert(List<BoardFile> uploadList);

	/** 게시판 파일 목록
	 * @param boardFileMap
	 * @return
	 */
	List<BoardFile> boardFileList(Map<String, Object> boardFileMap);

	/** 공지사항 삭제
	 * @param noticeNo
	 * @return
	 */
	int noticeDelete(int noticeNo);

	/** 공지사항 수정
	 * @param inputNotice
	 * @return
	 */
	int noticeUpdate(Notice inputNotice);

	/** 게시판 파일 삭제
	 * @param map
	 * @return
	 */
	int boardFileDelete(Map<String, Object> map);

	/** 게시판 파일 순서 수정
	 * @param updMap
	 * @return
	 */
	int BoardFileUpdate(BoardFile updFile);

}
