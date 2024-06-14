package com.cowork.admin.addr.model.service;

import java.util.List;
import java.util.Map;

import com.cowork.admin.companyInfo.model.dto.Department;
import com.cowork.admin.companyInfo.model.dto.Team;
import com.cowork.user.model.dto.Employee2;

public interface AdminAddrService {

	/** 회사 주소록 그룹만 조회
	 * @param loginEmp
	 * @return
	 */
	List<Department> selectComAddrList(Employee2 loginEmp);

	/** 회사별 사원 리스트 조회
	 * @param loginEmp
	 * @param cp 
	 * @return
	 */
	Map<String, Object> selectComList(Employee2 loginEmp, int cp);

	/** 부서별 사원 리스트 조회
	 * @param data
	 * @param cp
	 * @return
	 */
	Map<String, Object> selectDeptList(Map<String, Object> data, int cp);

	/** 팀별 사원 리스트 조회
	 * @param data
	 * @param cp
	 * @return
	 */
	Map<String, Object> selectTeamList(Map<String, Object> data, int cp);

	/** 선택한 부서의 하위 팀 리스트만 조회
	 * @param map
	 * @return
	 */
	List<Team> getTeamList(Map<String, Object> map);

	/** 회사 주소록 CRUD
	 * @param data
	 * @param loginEmp 
	 * @return
	 */
	int insertGroupList(List<List<Map<String, Object>>> data, Employee2 loginEmp);

	/** 초대 링크 인증키 업데이트
	 * @param empCode
	 * @return
	 */
	int updateInviteAuthKey(int empCode);

}