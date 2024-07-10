package com.cowork.admin.attendance.model.service;

import java.util.List;
import java.util.Map;

import com.cowork.user.model.dto.Employee2;

public interface AdminAttendanceService {

	/** 이름으로 사원 찾기
	 * @param name
	 * @param loginEmp
	 * @return
	 */
	List<Employee2> findEmp(Map<String, Object> data);

	/** 회사별 사원 리스트 조회
	 * @param loginEmp
	 * @param cp
	 * @param date 
	 * @return
	 */
	Map<String, Object> selectComList(Employee2 loginEmp, int cp, String date);

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

	/** 회사 생성일 조회
	 * @param loginEmp
	 * @return
	 */
	String getCompanyCreateDate(Employee2 loginEmp);

	String sysdate();
	String currentDate ();
	String sysTimeStamp ();
	String currentTimeStamp ();
	String localTimeStamp ();
	
}