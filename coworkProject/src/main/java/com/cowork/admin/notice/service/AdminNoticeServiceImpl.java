package com.cowork.admin.notice.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.RowBounds;
import org.eclipse.angus.mail.imap.Utility;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.cowork.admin.notice.mapper.AdminNoticeMapper;
import com.cowork.common.utility.model.dto.Pagination;
import com.cowork.employee.notice.model.dto.BoardFile;
import com.cowork.employee.notice.model.dto.Notice;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(rollbackFor = Exception.class)
@PropertySource("classpath:/config.properties")
public class AdminNoticeServiceImpl implements AdminNoticeService {
	
	private final AdminNoticeMapper mapper;
	
	@Value("${board.file.web-path}")
	private String webPath;
	
	@Value("${board.file.folder-path}")
	private String folderPath;

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

	/** 공지사항 상세
	 *
	 */
	@Override
	public Notice noticeDetail(int noticeNo) {
		// TODO Auto-generated method stub
		return mapper.noticeDetail(noticeNo);
	}

	/** 공지사항 등록
	 *
	 */
	@Override
	public int noticeInsert(Notice inputNotice, List<MultipartFile> files) {
		
		// 공지사항 등록
		int result = mapper.noticeInsert(inputNotice);
		
		if(result == 0) return 0;
		
		int noticeNo = inputNotice.getNoticeNo(); // 삽입된 공시사항 번호를 변수로 저장
		List<BoardFile> uploadList = new ArrayList<>(); // 실제 업로드된 파일의 정보를 모아둘 List 생성
		
		for(int i=0; i<files.size(); i++) {
			
			if(!files.get(i).isEmpty()) {
				String originalName = files.get(i).getOriginalFilename(); // 원본명
				String rename = ""; //Utility.fileRename(originalName);
				
				BoardFile file = BoardFile.builder()
							.filePath(webPath)
							.fileOriginName(originalName)
							.fileRename(rename)
							.fileOrder(i)
							.boardNo(noticeNo)
							.boardNm("NOTICE")
							.build();
				
				uploadList.add(file);
			}
		}
		
		if(uploadList.isEmpty()) return noticeNo;
		
		result = mapper.boardFileinsert(uploadList);
		
		return 0;
	}

}
