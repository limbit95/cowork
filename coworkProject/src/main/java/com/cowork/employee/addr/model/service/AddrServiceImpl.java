package com.cowork.employee.addr.model.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.RowBounds;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cowork.common.utility.model.dto.Pagination;
import com.cowork.employee.addr.model.mapper.AddrMapper;
import com.cowork.user.model.dto.Employee2;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Transactional(rollbackFor = Exception.class)
@Slf4j
@RequiredArgsConstructor
public class AddrServiceImpl implements AddrService {
	
	private final AddrMapper mapper;

	// 개인 주소록 그룹 조회
	@Override
	public List<String> selectGroupList(Employee2 loginEmp) {
		return mapper.selectGroupList(loginEmp);
	}

	// 주소록 그룹에 속한 정보 리스트 조회
	@Override
	public Map<String, Object> selectMyAddrList(Map<String, Object> map, int cp) {
		// 주소록 그룹의 리스트 개수 조회
		int listCount = mapper.getListCount(map);
		
		Pagination pagination = new Pagination(cp, listCount);
		
		int limit = pagination.getLimit();
		int offset = (cp - 1) * limit;
		RowBounds rowBounds = new RowBounds(offset, limit);
		
		// Mapper 메서드 호출 시
		// - 첫 번째 매개변수 -> SQL에 전달할 파라미터
		// - 두 번째 매개변수 -> RowsBounds 객체만 대입가능
		List<Employee2> groupList = mapper.selectMyAddrList(map, rowBounds);
		
		Map<String, Object> map2 = new HashMap<String, Object>();
		map.put("pagination", pagination);
		map.put("groupList", groupList);
		
		return map2;
	}

}