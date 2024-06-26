package com.cowork.admin.addr.model.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.session.RowBounds;

import com.cowork.admin.companyInfo.model.dto.Department;
import com.cowork.admin.companyInfo.model.dto.Team;
import com.cowork.user.model.dto.Employee2;

@Mapper
public interface AdminAddrMapper {

	/** 회사 부서 조회
	 * @param loginEmp
	 * @return
	 */
	List<Department> selectComAddrList(Employee2 loginEmp);

	/** 회사별 사원 리스트 조회
	 * @param loginEmp
	 * @param rowBounds 
	 * @return
	 */
	List<Employee2> selectComList(Employee2 loginEmp, RowBounds rowBounds);

	/** 회사별 사원 수 조회
	 * @param loginEmp
	 * @return
	 */
	int getComListCount(Employee2 loginEmp);

	/** 부서별 사원 수 조회
	 * @param data
	 * @return
	 */
	int getDeptListCount(Map<String, Object> data);

	/** 부서별 사원 리스트 조회
	 * @param data
	 * @param rowBounds
	 * @return
	 */
	List<Employee2> selectDeptList(Map<String, Object> data, RowBounds rowBounds);

	/** 팀별 사원 수 조회
	 * @param data
	 * @return
	 */
	int getTeamListCount(Map<String, Object> data);

	/** 팀별 사원 리스트 조회
	 * @param data
	 * @param rowBounds
	 * @return
	 */
	List<Employee2> selectTeamList(Map<String, Object> data, RowBounds rowBounds);

	/** 선택한 부서의 하위 팀 리스트만 조회
	 * @param map
	 * @return
	 */
	List<Team> getTeamList2(Map<String, Object> map);

	/** 부서 이름만 업데이트
	 * @param map
	 * @return
	 */
	int changeDeptName(Map<String, Object> map);

	/** 새로운 부서 그룹 insert
	 * @param map
	 * @return
	 */
	int insertDept(Map<String, Object> map);

	/** 부서 삭제
	 * @param map
	 * @return
	 */
	int deleteDeptGroup(Map<String, Object> map);

	/** 부서 그룹 하나만 남았을 때 DEPARTMENT 테이블 전부 비워버리는 쿼리
	 * @param loginEmp
	 * @return
	 */
	int deleteAllDeptGroup(Employee2 loginEmp);

	/** 팀 이름만 업데이트
	 * @param map
	 * @return
	 */
	int changeTeamName(Map<String, Object> map);
	
	/** 새로운 팀 그룹 insert
	 * @param map
	 * @return
	 */
	int insertTeam(Map<String, Object> map);
	
	/** 팀 삭제
	 * @param map
	 * @return
	 */
	int deleteTeamGroup(Map<String, Object> map);

	/** 초대 링크 인증키 삭제
	 * @param data
	 * @return
	 */
	int updateInviteAuthKey(Map<String, Object> data);

	/** TB_AUTH_KEY의 인증키 가져오기
	 * @param data
	 * @return
	 */
	String getTbAuthKey(Map<String, Object> data);

	/** EMPLOYEE의 인증키 가져오기
	 * @param data
	 * @return
	 */
	String getEmpAuthKey(Map<String, Object> data);

	/** 업데이트 된 초대 링크 인증키를 EMPLOYEE 테이블의 INVITE_AUTHKEY 컬럼에 업데이트 
	 * @param data
	 * @return
	 */
	int updateEmpInviteAuthKey(Map<String, Object> data);

	/** 인증키 업데이트 된 EMPLOYEE 정보 가져오기
	 * @param data
	 * @return
	 */
	Employee2 getUpdateEmp(Map<String, Object> data);

	/** 사원 찾기(이름으로)
	 * @param data
	 * @return
	 */
	List<Employee2> findEmp(Map<String, Object> data);

	/** 사원 조직 이동
	 * @param map
	 * @return
	 */
	int groupChange(Map<String, Object> map);
	
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

	/** 회사에 해당 부서가 있는지 확인
	 * @param data
	 * @return
	 */
	int deptIsEmpty(Map<String, Object> data);

	/** 해당 부서에 구성원이 있는지 확인
	 * @param data
	 * @return
	 */
	int empInDeptIsEmpty(Map<String, Object> data);

	/** 부서에 해당 팀이 있는지 확인
	 * @param data
	 * @return
	 */
	int teamIsEmpty(Map<String, Object> data);

	/** 해당 팀에 구성원이 있는지 확인
	 * @param data
	 * @return
	 */
	int empInTeamIsEmpty(Map<String, Object> data);

	/** 선택한 구성원 삭제
	 * @param map
	 * @return
	 */
	int deleteEmployee(Map<String, Object> map);


}