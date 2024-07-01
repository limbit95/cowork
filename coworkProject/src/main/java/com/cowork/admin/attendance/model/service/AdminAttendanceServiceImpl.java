package com.cowork.admin.attendance.model.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.RowBounds;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cowork.admin.attendance.model.mapper.AdminAttendanceMapper;
import com.cowork.common.utility.model.dto.Pagination;
import com.cowork.user.model.dto.Employee2;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
@Slf4j
public class AdminAttendanceServiceImpl implements AdminAttendanceService {
	
	private final AdminAttendanceMapper mapper;

	// 이름으로 사원 찾기
	@Override
	public List<Employee2> findEmp(String name, Employee2 loginEmp) {
		Map<String, Object> data = new HashMap<String, Object>();
		data.put("name", name);
		data.put("comNo", loginEmp.getComNo());
		
		return mapper.findEmp(data);
	}

	// 회사별 사원 리스트 조회
	@Override
	public Map<String, Object> selectComList(Employee2 loginEmp, int cp) {
		
		// 회사 전체 사원 수 조회
		int listCount = mapper.getComListCount(loginEmp);
		
		Pagination pagination = new Pagination(cp, listCount);
		
		int limit = pagination.getLimit();
		int offset = (cp - 1) * limit;
		RowBounds rowBounds = new RowBounds(offset, limit);
		
		List<Employee2> comList = mapper.selectComList(loginEmp, rowBounds);
		
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("pagination", pagination);
		map.put("comList", comList);
		
		return map;
	}

	// 부서별 사원 리스트 조회
	@Override
	public Map<String, Object> selectDeptList(Map<String, Object> data, int cp) {

		// 부서별 사원 수 조회
		int listCount = mapper.getDeptListCount(data);
		
		Pagination pagination = new Pagination(cp, listCount);
		
		int limit = pagination.getLimit();
		int offset = (cp - 1) * limit;
		RowBounds rowBounds = new RowBounds(offset, limit);
		
		List<Employee2> deptList = mapper.selectDeptList(data, rowBounds);
		
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("pagination", pagination);
		map.put("deptList", deptList);
		
		return map;
	}

	// 팀별 사원 리스트 조회
	@Override
	public Map<String, Object> selectTeamList(Map<String, Object> data, int cp) {

		// 팀별 사원 수 조회
		int listCount = mapper.getTeamListCount(data);
		
		Pagination pagination = new Pagination(cp, listCount);
		
		int limit = pagination.getLimit();
		int offset = (cp - 1) * limit;
		RowBounds rowBounds = new RowBounds(offset, limit);
		
		List<Employee2> teamList = mapper.selectTeamList(data, rowBounds);
		
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("pagination", pagination);
		map.put("teamList", teamList);
		
		return map;
	}

}