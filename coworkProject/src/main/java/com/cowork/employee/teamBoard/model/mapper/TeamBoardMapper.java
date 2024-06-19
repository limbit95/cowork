package com.cowork.employee.teamBoard.model.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.session.RowBounds;

import com.cowork.employee.teamBoard.model.dto.TeamBoard;

@Mapper
public interface TeamBoardMapper {

	/** 게시글 수 조회
	 * @param paramMap
	 * @return
	 */
	int getTeamBoardListCount(Map<String, Object> paramMap);

	/** 팀게시판 조회
	 * @param paramMap
	 * @param rowBounds
	 * @return
	 */
	List<TeamBoard> teamBoardList(Map<String, Object> paramMap, RowBounds rowBounds);
	
	/** 팀게시판 상세
	 * @param teamBoardNo
	 * @return
	 */
	TeamBoard teamBoardDetail(int teamBoardNo);
	
	/** 팀게시판 등록
	 * @param inputTeamBoard
	 * @return
	 */
	int teamBoardInsert(TeamBoard inputTeamBoard);

}