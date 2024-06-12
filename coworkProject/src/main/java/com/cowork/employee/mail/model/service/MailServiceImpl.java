package com.cowork.employee.mail.model.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cowork.employee.mail.model.dto.Mail;
import com.cowork.employee.mail.model.mapper.MailMapper;

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
	public List<Mail> mailList(int empCode) {
		
		return mapper.mailList(empCode);
	}

	// 메일 상세 조회 
	@Override
	public int mailDetail(int mailNo) {
		
		return mapper.mailDetail(mailNo);
	}

	// 전체 메일 개수 조회 
	@Override
	public int mailCount(int empCode) {
		
		return mapper.mailCount(empCode);
	}

	// 안 읽은 메일 개수 조회 
	@Override
	public int noReadCount(int empCode) {
		
		return mapper.noReadCount(empCode);
	}

}
