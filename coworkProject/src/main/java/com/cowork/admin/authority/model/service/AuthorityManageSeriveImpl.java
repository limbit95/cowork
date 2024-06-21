package com.cowork.admin.authority.model.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.RowBounds;
import org.springframework.context.annotation.PropertySource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cowork.admin.authority.model.mapper.AuthorityManageMapper;
import com.cowork.common.utility.model.dto.Pagination;
import com.cowork.user.model.dto.Employee2;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Transactional(rollbackFor = Exception.class)
@PropertySource("classpath:/config.properties")
@Slf4j
public class AuthorityManageSeriveImpl implements AuthorityManageSerive {
	
	private final AuthorityManageMapper mapper;
	
	// 사원별 권한 목록 조회
	@Override
	public Map<String, Object> authorityList(int comNo, int cp) {
		
		Map<String, Object> empInfo = new HashMap<>();
				
		empInfo.put("comNo", comNo); // 회사번호
		
		// 사원 수 조회
		int listCount = mapper.getAuthorityListCount(empInfo);
		
		// paingnation
		Pagination pagination = new Pagination(cp, listCount);
		
		// 지정된 크기 만큼 건너띄고(offset) 제한된 크기(limit)만큼의 행을 조회
		int limit = pagination.getLimit();
		int offset = (cp - 1) * limit;
		RowBounds rowBounds = new RowBounds(offset, limit);
		
		// 사원별 권한 목록 조회
		List<Employee2> authorityList = mapper.authorityList(empInfo, rowBounds);
		
		Map<String, Object> map = new HashMap<>();
		
		map.put("pagination", pagination);
		map.put("authorityList", authorityList);
		
		return map;
	}

}
