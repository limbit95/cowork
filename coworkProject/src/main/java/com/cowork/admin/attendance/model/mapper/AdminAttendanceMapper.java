package com.cowork.admin.attendance.model.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.session.RowBounds;

import com.cowork.user.model.dto.Employee2;

@Mapper
public interface AdminAttendanceMapper {

	/** 이름으로 사원 찾기
	 * @param data
	 * @return
	 */
	List<Employee2> findEmp(Map<String, Object> data);

	/** 회사별 사원 수 조회
	 * @param loginEmp
	 * @return
	 */
	int getComListCount(Employee2 loginEmp);

	/** 회사별 사원 리스트 조회
	 * @param loginEmp
	 * @param rowBounds
	 * @return
	 */
	List<Employee2> selectComList(Employee2 loginEmp, RowBounds rowBounds);

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

	
	
}