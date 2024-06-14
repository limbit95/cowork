package com.cowork.admin.addr.model.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.RowBounds;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cowork.admin.addr.model.mapper.AdminAddrMapper;
import com.cowork.admin.companyInfo.model.dto.Department;
import com.cowork.admin.companyInfo.model.dto.Team;
import com.cowork.common.utility.model.dto.Pagination;
import com.cowork.user.model.dto.Employee2;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Transactional(rollbackFor = Exception.class)
@Slf4j
@RequiredArgsConstructor
public class AdminAddrServiceImpl implements AdminAddrService {
	
	private final AdminAddrMapper mapper;

	// 회사 주소록 그룹만 조회
	@Override
	public List<Department> selectComAddrList(Employee2 loginEmp) {
		List<Department> selectComAddrList = mapper.selectComAddrList(loginEmp);
		
		return selectComAddrList;
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

	// 선택한 부서의 하위 팀 리스트만 조회
	@Override
	public List<Team> getTeamList(Map<String, Object> map) {
		return mapper.getTeamList2(map);
	} 
	
	// 회사 주소록 CRUD
	@Override
	public int insertGroupList(List<List<Map<String, Object>>> data, Employee2 loginEmp) {
		// -----------------------------------------------------------------------------
		// -----------------------------------------------------------------------------
		// -----------------------------------------------------------------------------
		// 부서 그룹 CRUD
		
		// 부서 그룹 삭제
		String idx = "";
		for(int i = 0; i < data.get(0).size(); i++) {
			
			if(!data.get(0).get(i).get("deptNo").equals("null")) {
				if(data.get(0).get(i).size() == 1) {
					idx += "'" + data.get(0).get(i).get("deptNo") + "'";
					continue;
				}
				
				if(i == data.get(0).size() - 1) {
					idx += "'" + data.get(0).get(i).get("deptNo") + "'";
					continue;
				}
				idx += "'" + data.get(0).get(i).get("deptNo") + "',";
			}
		}
		// 부서 그룹이 하나 이상 존재할 때
		if(idx.length() > 0) {
			if(idx.charAt(idx.length()-1) == ',') {
				idx = idx.substring(0, idx.length()-1);
			}
			
			data.get(0).get(0).put("groupIdx", idx);
			
			int deleteResult = mapper.deleteDeptGroup(data.get(0).get(0));
		} 
		if(idx.length() == 0) {
			int deleteResult = mapper.deleteAllDeptGroup(loginEmp);
		}
		
		// 부서 그룹 삽입 및 수정
		for(int i = 0; i < data.get(0).size(); i++) {
			// 기존에 있던 부서 그룹이면 이름만 업데이트
			// 기존과 같은 이름이면 같은 이름을 업데이트 하므로 변동사항 없음
			if(!data.get(0).get(i).get("deptNo").equals("null")) {
				int changeResult = mapper.changeDeptName(data.get(0).get(i));
			}
			if(data.get(0).get(i).get("deptNo").equals("null")) {
				int insertResult = mapper.insertDept(data.get(0).get(i));
			}
		}
		
		// -----------------------------------------------------------------------------
		// -----------------------------------------------------------------------------
		// -----------------------------------------------------------------------------
		// 팀 그룹 CRUD 
		
		// 팀 그룹 삭제
		for(int i = 0; i < data.get(0).size(); i++) {
			String idx2 = "";
			
			for(int x = 0; x < data.get(1).size(); x++) {
				if(data.get(1).get(x).get("teamNo").equals("null")) {
					continue;
				}
				if(data.get(0).get(i).get("deptNo").equals(data.get(1).get(x).get("deptNo"))) {
					idx2 += "'" + data.get(1).get(x).get("teamNo") + "',";
				}
			}
			// 팀 그룹이 하나 이상 존재할 때
			if(idx2.length() > 0) {
				idx2 = idx2.substring(0, idx2.length()-1);
				
				Map<String, Object> deleteMap = new HashMap<String, Object>();
				deleteMap.put("deptNo", data.get(0).get(i).get("deptNo"));
				deleteMap.put("groupIdx", idx2);
				
				int deleteResult = mapper.deleteTeamGroup(deleteMap);
			} 
		}
		
		// 팀 그룹 삽입 및 수정
		for(int i = 0; i < data.get(1).size(); i++) {
			// 기존에 있던 팀 그룹이면 이름만 업데이트
			// 기존과 같은 이름이면 같은 이름을 업데이트 하므로 변동사항 없음
			if(!data.get(1).get(i).get("teamNo").equals("null")) {
				int changeResult = mapper.changeTeamName(data.get(1).get(i));
			}
			if(data.get(1).get(i).get("teamNo").equals("null")) {
				int insertResult = mapper.insertTeam(data.get(1).get(i));
			}
		}
		
		return 1;
	}
	
}