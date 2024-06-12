package com.cowork.employee.addr.model.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.RowBounds;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cowork.common.utility.model.dto.Pagination;
import com.cowork.employee.addr.model.dto.MyAddr;
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
	public List<MyAddr> selectGroupList(Employee2 loginEmp) {
		return mapper.selectGroupList(loginEmp);
	}

	// 주소록 그룹에 속한 정보 리스트 조회
	@Override
	public Map<String, Object> selectAddrList(Map<String, Object> map, int cp) {
		log.info("getGroupCode : " + map);
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
		
		List<Employee2> addrList = mapper.selectAddrList(map, rowBounds);
		
		Map<String, Object> map2 = new HashMap<String, Object>();
		map2.put("pagination", pagination);
		map2.put("addrList", addrList);
		map2.put("groupCode", map.get("groupCode"));
		map2.put("empCode", map.get("empCode"));
		
		return map2;
	}

	// 개인 주소록 전체 리스트 조회
	@Override
	public Map<String, Object> selectAllAddrList(Map<String, Object> map, int cp) {
		// 주소록 그룹의 리스트 개수 조회
		List<String> fullListCount = mapper.getFullListCount(map);
		
		Pagination pagination = new Pagination(cp, fullListCount.size());
		
		int limit = pagination.getLimit();
		int offset = (cp - 1) * limit;
		RowBounds rowBounds = new RowBounds(offset, limit);
		
		List<Employee2> selectAllAddrList = mapper.selectAllAddrList(map, rowBounds);
		
		Map<String, Object> map2 = new HashMap<String, Object>();
		map2.put("pagination", pagination);
		map2.put("addrList", selectAllAddrList);
		map2.put("groupCode", "myAll");
		
		return map2;
	}

	// 개인 주소록 그룹 저장
	@Override
	public int insertGroupList(List<Map<String, String>> map, String loginEmpCode) {
		// -1 : 그룹이 하나도 없음
		// -2 : 중복된 이름의 주소록이 있음
		// 1 : 그룹 저장 성공
		// 2 : 그룹명 변경 실패
		// 3 : 그룹 insert 실패
		
		if(map.size() == 0) {
			return -1;
		}
		for(int i = 0; i < map.size(); i++) {
			if(map.get(i).get("addrBookNo").equals("null")) {
				int checkAddrName = mapper.checkAddrName(map.get(i));
				
				if(checkAddrName > 0) {
					return -2;
				}
			}
		}
		
		String idx = "";
		
		for(int i = 0; i < map.size(); i++) {
			if(!map.get(i).get("addrBookNo").equals("null")) {
				if(i == map.size() - 1) {
					idx += "'" + map.get(i).get("addrBookNo") + "'";
					break;
				}
				idx += "'" + map.get(i).get("addrBookNo") + "',";
			}
		}
		
		if(idx.charAt(idx.length()-1) == ',') {
			idx = idx.substring(0, idx.length()-1);
			log.info("idx : " + idx);
		}
		
		log.info("idx : " + idx);
		Map<String, Object> deleteMap = new HashMap<String, Object>();
		deleteMap.put("groupIdx", idx);
		deleteMap.put("loginEmpCode", loginEmpCode);
		
		int deleteResult = mapper.deleteGroup(deleteMap);
		
		for(int i = 0; i < map.size(); i++) {
			// DB에 있는 주소록은 수정되었을 수도 있는 이름만 변경
			if(!map.get(i).get("addrBookNo").equals("null")) {
				int changeResult = mapper.changeGroupName(map.get(i));
				
				if(changeResult == 0) {
					return 2;
				}
			}
			
			// DB에 없는 주소록(새로 생성한 주소록)들은 insert
			if(map.get(i).get("addrBookNo").equals("null")) {
				int insertResult = mapper.insertGroup(map.get(i));
				
				if(insertResult == 0) {
					return 3;
				}
			}
		}
		
		return 1;
	}

	// 주소록에 등록된 사원 정보 상세 조회
	@Override
	public Employee2 empDetail(Map<String, Object> map) {
		return mapper.empDetail(map);
	}

	// 개인 주소록에 등록된 사원 삭제
	@Override
	public int deleteAddr(List<Map<String, String>> map) {
		int result = 0;
		for(int i = 0; i < map.size(); i++) {
			result = mapper.deleteAddr(map.get(i));
			
			if(result == 0) {
				return 0;
			}
		}
		
		
		return result;
	}

}