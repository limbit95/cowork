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
		// 주소록 그룹 코드 조회
		if(map.get("groupCode") == null) {
			int groupCode = mapper.getGroupCode(map);
			map.put("groupCode", groupCode);
		}
		
		// 주소록 그룹의 리스트 개수 조회
		int listCount = mapper.getListCount(map);
		
		Pagination pagination = new Pagination(cp, listCount);
		
		int limit = pagination.getLimit();
		int offset = (cp - 1) * limit;
		RowBounds rowBounds = new RowBounds(offset, limit);
		
		List<Employee2> groupList = mapper.selectMyAddrList(map, rowBounds);
		
		Map<String, Object> map2 = new HashMap<String, Object>();
		map2.put("pagination", pagination);
		map2.put("groupList", groupList);
		map2.put("groupCode", map.get("groupCode"));
		map2.put("empCode", map.get("empCode"));
		
		return map2;
	}

}