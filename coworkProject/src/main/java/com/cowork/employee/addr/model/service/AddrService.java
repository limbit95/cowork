package com.cowork.employee.addr.model.service;

import java.util.List;
import java.util.Map;

import com.cowork.user.model.dto.Employee2;

public interface AddrService {

	/** 개인 주소록 그룹 조회
	 * @param loginEmp 
	 * @return
	 */
	List<String> selectGroupList(Employee2 loginEmp);

	/** 주소록 그룹에 속한 정보 리스트 조회
	 * @param map
	 * @param cp
	 * @return
	 */
	Map<String, Object> selectMyAddrList(Map<String, Object> map, int cp);

}