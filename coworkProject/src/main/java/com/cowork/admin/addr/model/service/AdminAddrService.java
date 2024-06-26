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
 
	/** TB_AUTH_KEY의 인증키와 EMPLOYEE의 인증키 비교
	 * @param loginEmp
	 * @return
	 */
	int checkInviteAuthKey(Employee2 loginEmp);

	/** 업데이트 된 초대 링크 인증키를 EMPLOYEE 테이블의 INVITE_AUTHKEY 컬럼에 업데이트 
	 * @param loginEmp
	 * @return
	 */
	Employee2 updateEmpInviteAuthKey(Employee2 loginEmp);

	/** 사원 찾기(이름으로)
	 * @param name
	 * @param loginEmp
	 * @return
	 */
	List<Employee2> findEmp(String name, Employee2 loginEmp);

	/** 사원 조직 이동
	 * @param data
	 * @return
	 */
	int groupChange(List<Map<String, Object>> data);
	
	/** 회사별 직급 리스트 조회
	 * @param loginEmp
	 * @return
	 */
	List<Map<String, Object>> getpositionList(Employee2 loginEmp);

	/** 구성원 정보 수정
	 * @param data
	 * @return
	 */
	int employeeUpdate(Map<String, Object> data);

	/** 부서에 사원이 한 명이라도 존재하는지 확인
	 * @param data
	 * @return
	 */
	int empInDeptIsEmpty(Map<String, Object> data);

	/** 팀에 사원이 한 명이라도 존재하는지 확인
	 * @param data
	 * @return
	 */
	int empInTeamIsEmpty(Map<String, Object> data);

	/** 선택한 구성원 삭제
	 * @param data
	 * @return
	 */
	int deleteEmployee(List<Map<String, Object>> data);

}