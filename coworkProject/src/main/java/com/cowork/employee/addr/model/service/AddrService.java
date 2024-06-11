package com.cowork.employee.addr.model.service;

import java.util.List;
import java.util.Map;

import com.cowork.employee.addr.model.dto.MyAddr;
import com.cowork.user.model.dto.Employee2;

public interface AddrService {

	/** 개인 주소록 그룹 조회
	 * @param loginEmp 
	 * @return
	 */
	List<MyAddr> selectGroupList(Employee2 loginEmp);

	/** 주소록 그룹에 속한 정보 리스트 조회
	 * @param map
	 * @param cp
	 * @return
	 */
	Map<String, Object> selectAddrList(Map<String, Object> map, int cp);

	/** 개인 주소록 리스트 전체 조회
	 * @param map
	 * @param cp
	 * @return
	 */
	Map<String, Object> selectAllAddrList(Map<String, Object> map, int cp);

	/** 개인 주소록 그룹 저장
	 * @param map
	 * @param loginEmpCode 
	 * @return
	 */
	int insertGroupList(List<Map<String, String>> map, String loginEmpCode);

	/** 주소록에 등록된 사원 정보 상세 조회
	 * @param map
	 * @return
	 */
	Employee2 empDetail(Map<String, Object> map);

}