package com.cowork.admin.notice.model.service;

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

import com.cowork.admin.notice.mapper.AdminNoticeMapper;
import com.cowork.admin.notice.model.exception.BoardFileDeleteException;
import com.cowork.admin.notice.model.exception.BoardInsertException;
import com.cowork.common.utility.Utility;
import com.cowork.common.utility.model.dto.Pagination;
import com.cowork.employee.notice.model.dto.BoardFile;
import com.cowork.employee.notice.model.dto.Notice;

import lombok.RequiredArgsConstructor;
import lombok.extern.java.Log;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Transactional(rollbackFor = Exception.class)
@PropertySource("classpath:/config.properties")
@Slf4j
public class AdminNoticeServiceImpl implements AdminNoticeService {
	
	private final AdminNoticeMapper mapper;
	
	@Value("${board.file.web-path}")
	private String webPath;
	
	@Value("${board.file.folder-path}")
	private String folderPath;

	// 공지사항 목록
	@Override
	public Map<String, Object> noticeList(Map<String, Object> paramMap, int cp) {
		// 게시글 수 조회
		int listCount = mapper.getNoticeListCount(paramMap);
		
		// pagination
		Pagination pagination = new Pagination(cp, listCount);
		
		// 지정된 크기 만큼 건너띄고(offset) 제한된 크기(limit)만큼의 행을 조회
		int limit = pagination.getLimit();
		int offset = (cp - 1) * limit;
		RowBounds rowBounds = new RowBounds(offset, limit);
		
		List<Notice> noticeList = mapper.noticeList(paramMap, rowBounds);
		
		Map<String, Object> map = new HashMap<>();
		
		map.put("pagination", pagination);
		map.put("noticeList", noticeList);
		
		return map;
	}

	// 공지사항 상세
	@Override
	public Map<String, Object> noticeDetail(int noticeNo) {
		
		Map<String, Object> map = new HashMap<>();
		Map<String, Object> boardFileMap = new HashMap<>();
		
		boardFileMap.put("noticeNo", noticeNo);
		boardFileMap.put("boardNm", "NOTICE");
		
		Notice notice = mapper.noticeDetail(noticeNo);
		List<BoardFile> fileList = mapper.boardFileList(boardFileMap);
		
		map.put("notice", notice);
		map.put("fileList", fileList);
		
		return map;
	}

	// 공지사항 등록
	@Override
	public int noticeInsert(Notice inputNotice, List<MultipartFile> files) throws IllegalStateException, IOException {
		
		// 공지사항 등록
		int result = mapper.noticeInsert(inputNotice);
		
		if(result == 0) return 0;
		
		int noticeNo = inputNotice.getNoticeNo(); // 삽입된 공시사항 번호를 변수로 저장
		
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
								.boardNo(noticeNo)
								.boardNm("NOTICE")
								.uploadFile(files.get(i))
								.build();
					
					uploadList.add(file);
				}
			}
			
			if(uploadList.isEmpty()) return noticeNo;
			
			result = mapper.boardFileinsert(uploadList);
			
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
		
		//log.info("서비스 게시글 번호 : " + noticeNo);
		
		return noticeNo;
	}

	// 공지사항 삭제
	@Override
	public int noticeDelete(int noticeNo) {
		
		return mapper.noticeDelete(noticeNo);
	}

	// 공지사항 수정
	@Override
	public int noticeUpdate(Notice inputNotice, List<MultipartFile> files, String deleteOrder, String updateOrder) throws IllegalStateException, IOException {
		
		// 공지사항 수정
		int result = mapper.noticeUpdate(inputNotice);
		
		//if(result == 0) return 0;
		
		int noticeNo = inputNotice.getNoticeNo();
		
		// 삭제된 파일이 있는 경우
		if(deleteOrder != null && !deleteOrder.equals("")) {
			
			Map<String, Object> map = new HashMap<>();
			
			map.put("deleteOrder", deleteOrder);
			map.put("noticeNo", noticeNo);
			map.put("boardNm", "NOTICE");
			
			result = mapper.boardFileDelete(map);
			
			if(result == 0) throw new BoardFileDeleteException();
			
			// 기존 파일이 있는 경우
			if(updateOrder != null && !updateOrder.equals("")) {
				
				String[] updateArr = updateOrder.split(",");
				
				for(int i=0; i<updateArr.length; i++) {
					
					log.info("i : " + i);
					log.info("updateArr[i] : " + updateArr[i]);
					log.info("noticeNo : " + noticeNo);
					
					BoardFile updFile = BoardFile.builder()
							.fileOrder(i)
							.boardNo(noticeNo)
							.boardNm("NOTICE")
							.fileOrderUpd(updateArr[i])
							.build();
					
					result = mapper.BoardFileUpdate(updFile);
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
								.boardNo(noticeNo)
								.boardNm("NOTICE")
								.uploadFile(files.get(i))
								.build();
					
					uploadList.add(file);
				}
			}
			
			if(uploadList.isEmpty()) return noticeNo;
			
			result = mapper.boardFileinsert(uploadList);
			
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

}
