package com.cowork.employee.teamBoard.model.service;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.RowBounds;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.cowork.admin.authority.dto.AuthorityMember;
import com.cowork.admin.notice.model.exception.BoardFileDeleteException;
import com.cowork.admin.notice.model.exception.BoardInsertException;
import com.cowork.admin.notice.model.mapper.AdminNoticeMapper;
import com.cowork.common.utility.Utility;
import com.cowork.common.utility.model.dto.Pagination;
import com.cowork.employee.notice.model.dto.BoardFile;
import com.cowork.employee.notice.model.dto.Notice;
import com.cowork.employee.teamBoard.model.dto.Comment;
import com.cowork.employee.teamBoard.model.dto.TeamBoard;
import com.cowork.employee.teamBoard.model.mapper.TeamBoardMapper;
import com.cowork.user.model.dto.Employee2;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Transactional(rollbackFor = Exception.class)
@PropertySource("classpath:/config.properties")
@Slf4j
public class TeamBoardServiceImpl implements TeamBoardService {

	private final TeamBoardMapper mapper;
	private final AdminNoticeMapper mapper2;
	
	@Value("${board.file.web-path}")
	private String webPath;
	
	@Value("${board.file.folder-path}")
	private String folderPath;
	
	// 팀게시판 목록
	@Override
	public Map<String, Object> teamBoardList(Map<String, Object> paramMap, int cp) {
		// 게시글 수 조회
		int listCount = mapper.getTeamBoardListCount(paramMap);
		
		// pagination
		Pagination pagination = new Pagination(cp, listCount);
		
		// 지정된 크기 만큼 건너띄고(offset) 제한된 크기(limit)만큼의 행을 조회
		int limit = pagination.getLimit();
		int offset = (cp - 1) * limit;
		RowBounds rowBounds = new RowBounds(offset, limit);
		
		// 팀게시판 조회
		List<TeamBoard> teamBoardList = mapper.teamBoardList(paramMap, rowBounds);
		
		// 팀게시판 권한여부
		int authorityCnt = mapper.authorityCnt(paramMap);
		
		// 팀내에 최고 레벨
		int levelCnt = mapper.levelCnt(paramMap);
		
		// 팀게시판 권한 조회
		List<Employee2> teamAuthorityList = mapper.teamAuthorityList(paramMap);
		
		Map<String, Object> map = new HashMap<>();
		
		map.put("pagination", pagination);
		map.put("teamBoardList", teamBoardList);
		map.put("authorityCnt", authorityCnt);
		map.put("levelCnt", levelCnt);
		map.put("teamAuthorityList", teamAuthorityList);
		
		return map;
	}
	
	// 팀게시판 상세
	@Override
	public Map<String, Object> teamBoardDetail(int teamBoardNo) {
		
		Map<String, Object> map = new HashMap<>();
		Map<String, Object> boardFileMap = new HashMap<>();
		
		boardFileMap.put("noticeNo", teamBoardNo);
		boardFileMap.put("boardNm", "TEAM");
		
		TeamBoard teamBoard = mapper.teamBoardDetail(teamBoardNo);
		List<BoardFile> fileList = mapper2.boardFileList(boardFileMap);
		
		map.put("teamBoard", teamBoard);
		map.put("fileList", fileList);
		
		return map;
	}

	// 팀게시판 등록
	@Override
	public int teamBoardInsert(TeamBoard inputTeamBoard, List<MultipartFile> files) throws IllegalStateException, IOException{
		
		// 팀게시판 등록
		int result = mapper.teamBoardInsert(inputTeamBoard);
		
		if(result == 0) return 0;
		
		int teamBoardNo = inputTeamBoard.getTeamBoardNo();
		
		if(files != null) {
			List<BoardFile> uploadList = new ArrayList<>(); // 실제 업로드된 파일의 정보를 모아둘 List 생성
			
			
			for(int i=0; i<files.size(); i++) {
				
				if(!files.get(i).isEmpty()) {
					String originalName = files.get(i).getOriginalFilename(); // 원본명
					String rename = Utility.fileRename(originalName);
					
					BoardFile file = BoardFile.builder()
								.filePath(webPath)
								.fileOriginName(originalName)
								.fileRename(rename)
								.fileOrder(i)
								.boardNo(teamBoardNo)
								.boardNm("TEAM")
								.uploadFile(files.get(i))
								.build();
					
					uploadList.add(file);
				}
			}
			
			if(uploadList.isEmpty()) return teamBoardNo;
			
			result = mapper2.boardFileInsert(uploadList);
			
			// 다중 파일 성공확인
			if(result == uploadList.size()) {
				
				// 서버에 파일 저장
				for(BoardFile file : uploadList) {
					file.getUploadFile().transferTo(new File(folderPath + file.getFileRename()));
				}
			} else {
				throw new BoardInsertException("공지사항 파일이 정상 삽입되지 않음");
			}
		
		}
		
		return teamBoardNo;
	}

	// 팀게시판 수정
	@Override
	public int teamBoardUpdate(TeamBoard inputTeamBoard, List<MultipartFile> files, String deleteOrder,
			String updateOrder) throws IllegalStateException, IOException {
		
		// 팀게시판 수정;
		int result = mapper.teamBoardUpdate(inputTeamBoard);
		
		int teamBoardNo = inputTeamBoard.getTeamBoardNo();
		
		log.info(deleteOrder);
		
		// 삭제된 파일이 있는 경우
		if(deleteOrder != null && !deleteOrder.equals("")) {
			
			Map<String, Object> map = new HashMap<>();
			
			map.put("deleteOrder", deleteOrder);
			map.put("noticeNo", teamBoardNo);
			map.put("boardNm", "TEAM");
			
			result = mapper2.boardFileDelete(map);
			
			if(result == 0) throw new BoardFileDeleteException();
			
			// 기존 파일이 있는 경우
			if(updateOrder != null && !updateOrder.equals("")) {
				
				String[] updateArr = updateOrder.split(",");
				
				for(int i=0; i<updateArr.length; i++) {
					
					BoardFile updFile = BoardFile.builder()
							.fileOrder(i)
							.boardNo(teamBoardNo)
							.boardNm("TEAM")
							.fileOrderUpd(updateArr[i])
							.build();
					
					result = mapper2.BoardFileUpdate(updFile);
				}
				
			}
			
		}
		
		// 파일 업로드
		if(files != null) {
			List<BoardFile> uploadList = new ArrayList<>();
			
			// 기존 파일이 있는 경우
			int fileOrder = 0;
			
			String[] updateArr = null;
			
			if(updateOrder != null && updateOrder.equals("")) {
				
				updateArr = updateOrder.split(",");
				fileOrder = updateArr.length;
			}
			
			for(int i=0; i<files.size(); i++) {
				
				if(updateOrder != null ) fileOrder += 1;
				else fileOrder = i;
				
				if(!files.get(i).isEmpty()) {
					String originalName = files.get(i).getOriginalFilename(); // 원본명
					String rename = Utility.fileRename(originalName);
					
					BoardFile file = BoardFile.builder()
								.filePath(webPath)
								.fileOriginName(originalName)
								.fileRename(rename)
								.fileOrder(fileOrder)
								.boardNo(teamBoardNo)
								.boardNm("TEAM")
								.uploadFile(files.get(i))
								.build();
					
					uploadList.add(file);
				}
			}
			
			if(uploadList.isEmpty()) return teamBoardNo;
			
			result = mapper2.boardFileInsert(uploadList);
			
			// 다중 파일 성공확인
			if(result == uploadList.size()) {
				
				// 서버에 파일 저장
				for(BoardFile file : uploadList) {
					file.getUploadFile().transferTo(new File(folderPath + file.getFileRename()));
				}
			} else {
				throw new BoardInsertException("이미지가 정상 삽입되지 않음");
			}
		
		}
		
		return result;
	}

	// 팀게시판 삭제
	@Override
	public int teamBoardDelete(int teamBoardNo) {
		// TODO Auto-generated method stub
		return mapper.teamBoardDelete(teamBoardNo);
	}
	
	/*******************/
	
	// 댓글 목록 조회
	@Override
	public List<Comment> commentList(int teamBoardNo) {
		// TODO Auto-generated method stub
		return mapper.commentList(teamBoardNo);
	}

	// 댓글/답글 등록
	@Override
	public int commentInsert(Comment comment) {
		// TODO Auto-generated method stub
		return mapper.commentInsert(comment);
	}

	// 댓글/답글 수정
	@Override
	public int commentUpdate(Comment comment) {
		// TODO Auto-generated method stub
		return mapper.commentUpdate(comment);
	}

	// 댓글/답글 삭제
	@Override
	public int commentDelete(int commentNo) {
		// TODO Auto-generated method stub
		return mapper.commentDelete(commentNo);
	}
	
}
