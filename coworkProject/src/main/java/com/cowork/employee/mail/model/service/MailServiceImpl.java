package com.cowork.employee.mail.model.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.RowBounds;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cowork.common.utility.model.dto.Pagination;
import com.cowork.employee.mail.model.dto.Mail;
import com.cowork.employee.mail.model.dto.MailFile;
import com.cowork.employee.mail.model.mapper.MailMapper;
import com.cowork.employee.notice.model.dto.Notice;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class MailServiceImpl implements MailService {
	
	private final MailMapper mapper; 

	// 전체 메일함 조회 
	@Override
	public Map<String, Object> mailList(Map<String, Object> paramMap, int cp) {
		
		int empCode = (int) paramMap.get("empCode"); 
		log.info("empCode 넘어왔니? : " + empCode);
		
		int listCount = mapper.listCount(paramMap);				
		int mailCount = mapper.mailCount(empCode); 				
		int noReadCount = mapper.noReadCount(empCode); 
		
		Pagination pagination = new Pagination(cp, listCount); 
		
		int limit = pagination.getLimit();
		int offset = (cp - 1) * limit;
		RowBounds rowBounds = new RowBounds(offset, limit);
		
		List<Mail> mailList = mapper.mailList(paramMap, rowBounds);
		
		Map<String, Object> map = new HashMap<>(); 
		
		map.put("pagination", pagination); 
		map.put("mailList", mailList); 
		map.put("mailCount", mailCount); 
		map.put("noReadCount", noReadCount); 
		
		return map;
	}

	// 메일 상세 조회 
	@Override
	public Map<String, Object> mailDetail(int mailNo) {
		
		Map<String, Object> map = new HashMap<>(); 
		Map<String, Object> fileMap = new HashMap<>(); 
		
		fileMap.put("mailNo", mailNo); 
		
		Mail mail = mapper.mailDetail(mailNo);
		List<MailFile> fileList = mapper.fileList(fileMap); 
		
		map.put("mail", mail); 
		map.put("fileList", fileList);
		
		return map;
	}

	// 전체 메일 개수 조회 
/*	@Override
	public int mailCount(int empCode) {
		
		return mapper.mailCount(empCode);
	} */

	// 안 읽은 메일 개수 조회 
	@Override
	public int noReadCount(int empCode) {
		
		return mapper.noReadCount(empCode);
	}

	// 파일 조회 
	@Override
	public List<MailFile> getMailFiles(int mailNo) {
		
		return mapper.getMailFiles(mailNo);
	}

	// 보낸 메일 리스트 
	@Override
	public Map<String, Object> sentMailList (Map<String, Object> paramMap, int cp) {
		
		int empCode = (int) paramMap.get("empCode"); 
		log.info("empCode 넘어왔니? : " + empCode);
		
		int sentListCount = mapper.sentListCount(paramMap);				
		int sentMailCount = mapper.sentMailCount(empCode); 				
		int sentMailNoReadCount = mapper.sentMailNoReadCount(empCode); 
		
		Pagination pagination = new Pagination(cp, sentListCount); 
		
		int limit = pagination.getLimit();
		int offset = (cp - 1) * limit;
		RowBounds rowBounds = new RowBounds(offset, limit);
		
		List<Mail> sentMailList = mapper.sentMailList(paramMap, rowBounds);
		
		Map<String, Object> map = new HashMap<>(); 
		
		map.put("pagination", pagination); 
		map.put("sentMailList", sentMailList); 
		map.put("sentMailCount", sentMailCount); 
		map.put("sentMailNoReadCount", sentMailNoReadCount); 
		
		return map;
	}

	// 보낸 메일 개수 
	@Override
	public int sentMailCount(int empCode) {
		
		return mapper.sentMailCount(empCode);
	}
	
	// 보낸 메일 안 읽은 개수 
	@Override
	public int sentMailNoReadCount(int empCode) {
		
		return mapper.sentMailNoReadCount(empCode);
	}

	// 받은 메일 리스트 
	@Override
	public Map<String, Object> inMailList (Map<String, Object> paramMap, int cp) {
		
		int empCode = (int) paramMap.get("empCode"); 
		log.info("empCode 넘어왔니? : " + empCode);
		
		int inListCount = mapper.inListCount(paramMap);				
		int inMailCount = mapper.inMailCount(empCode); 				
		int inMailNoReadCount = mapper.inMailNoReadCount(empCode); 
		
		Pagination pagination = new Pagination(cp, inListCount); 
		
		int limit = pagination.getLimit();
		int offset = (cp - 1) * limit;
		RowBounds rowBounds = new RowBounds(offset, limit);
		
		List<Mail> inMailList = mapper.inMailList(paramMap, rowBounds);
		
		Map<String, Object> map = new HashMap<>(); 
		
		map.put("pagination", pagination); 
		map.put("inMailList", inMailList); 
		map.put("inMailCount", inMailCount); 
		map.put("inMailNoReadCount", inMailNoReadCount); 
		
		return map;
		
	}

	// 받은 메일 전체 개수 
	@Override
	public int inMailCount(int empCode) {
		
		return mapper.inMailCount(empCode);
	}

	// 받은 메일 안 읽은 개수 
	@Override
	public int inMailNoReadCount(int empCode) {
		
		return mapper.inMailNoReadCount(empCode);
	}

	@Override
	public int mailCount(int empCode) {
		// TODO Auto-generated method stub
		return 0;
	}

	

	

}
