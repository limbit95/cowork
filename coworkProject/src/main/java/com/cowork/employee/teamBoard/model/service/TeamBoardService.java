package com.cowork.employee.teamBoard.model.service;

import java.io.IOException;
import java.util.List;
import java.util.Map;

import org.springframework.web.multipart.MultipartFile;

import com.cowork.employee.teamBoard.model.dto.Comment;
import com.cowork.employee.teamBoard.model.dto.TeamBoard;

public interface TeamBoardService {
	
	/** 팀게시판 목록
	 * @param paramMap
	 * @param cp
	 * @return
	 */
	Map<String, Object> teamBoardList(Map<String, Object> paramMap, int cp);
	
	/** 권한 조회
	 * @param paramMap
	 * @return
	 */
	Map<String, Object> teamAuthorityList(Map<String, Object> paramMap);
	
	/** 팀게시판 상세
	 * @param teamBoardNo
	 * @return
	 */
	Map<String, Object> teamBoardDetail(int teamBoardNo);

	/** 팀게시판 등록
	 * @param inputTeamBoard
	 * @param files
	 * @return
	 */
	int teamBoardInsert(TeamBoard inputTeamBoard, List<MultipartFile> files) throws IllegalStateException, IOException;

	/** 팀게시판 수정
	 * @param inputTeamBoard
	 * @param files
	 * @param deleteOrder
	 * @param updateOrder
	 * @return
	 */
	int teamBoardUpdate(TeamBoard inputTeamBoard, List<MultipartFile> files, String deleteOrder, String updateOrder) throws IllegalStateException, IOException;

	/** 팀게시판 삭제
	 * @param teamBoardNo
	 * @return
	 */
	int teamBoardDelete(int teamBoardNo);
	
	/*******************/

	/** 댓글 목록 조회
	 * @param teamBoardNo
	 * @return
	 */
	List<Comment> commentList(int teamBoardNo);
	
	/** 댓글/답글 등록
	 * @param comment
	 * @return
	 */
	int commentInsert(Comment comment);

	/** 댓글/답글 수정
	 * @param comment
	 * @return
	 */
	int commentUpdate(Comment comment);

	/** 댓글/답글 삭제
	 * @param commentNo
	 * @return
	 */
	int commentDelete(int commentNo);

}
