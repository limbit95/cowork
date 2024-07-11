package com.cowork.admin.attendance.model.service;

import java.util.List;
import java.util.Map;

import com.cowork.admin.attendance.model.dto.StandardAttendence;
import com.cowork.user.model.dto.Employee2;

public interface StandardAttendenceService {

	/** 설정 타입 조회
	 * @param loginEmp
	 * @return
	 */
	StandardAttendence getStandardAtd(Employee2 loginEmp);
	
	/** 설정 안함
	 * @param loginEmp 
	 * @return
	 */
	int offSet(Employee2 loginEmp);

	/** 지정된 시간으로 설정
	 * @param loginEmp
	 * @param data 
	 * @return
	 */
	int setTime(Employee2 loginEmp, List<Map<String, Object>> data);
	
	/** 초기 설정 페이지에서의 설정 안함
	 * @param loginEmp 
	 * @return
	 */
	int initOffSet(Employee2 loginEmp);
	
	/** 초기 설정 페이지에서의 지정된 시간으로 설정
	 * @param loginEmp
	 * @param data 
	 * @return
	 */
	int initSetTime(Employee2 loginEmp, List<Map<String, Object>> data);

}
