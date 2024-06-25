package com.cowork.employee.usermain.model.service;

import java.util.List;

import org.springframework.context.annotation.PropertySource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cowork.admin.authority.dto.AuthorityMember;
import com.cowork.employee.notice.model.dto.Notice;
import com.cowork.employee.usermain.model.mapper.UserMainMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Transactional(rollbackFor = Exception.class)
@PropertySource("classpath:/config.properties")
@Slf4j
public class UserMainServiceImpl implements UserMainService {
	
	public final UserMainMapper mapper;
	
	// 사용자 권한 여부
	@Override
	public int authorityCnt(int empCode) {
		// TODO Auto-generated method stub
		return mapper.authorityCnt(empCode);
	}

	// 관리자 권한 조회
	@Override
	public List<AuthorityMember> authorityList(int empCode) {
		// TODO Auto-generated method stub
		return mapper.authorityList(empCode);
	}

	// 공지사항 조회
	@Override
	public List<Notice> noticeList(int comNo) {
		// TODO Auto-generated method stub
		return mapper.noticeList(comNo);
	}

}
