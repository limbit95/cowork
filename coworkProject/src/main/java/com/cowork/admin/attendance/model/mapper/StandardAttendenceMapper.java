package com.cowork.admin.attendance.model.mapper;

import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import com.cowork.admin.attendance.model.dto.StandardAttendence;
import com.cowork.user.model.dto.Employee2;

@Mapper
public interface StandardAttendenceMapper {

	/** 설정 타입 조회
	 * @param loginEmp
	 * @return
	 */
	StandardAttendence getStandardAtd(Employee2 loginEmp);
	
	/** 설정 안함
	 * @return
	 */
	int offSet(Employee2 loginEmp);

	/** 지정된 시간으로 설정
	 * @param loginEmp
	 * @return
	 */
	int setTime(Map<String, Object> newData);
	
	/** 초기 설정 페이지에서의 설정 안함
	 * @return
	 */
	int initOffSet(Employee2 loginEmp);
	
	/** 초기 설정 페이지에서의 지정된 시간으로 설정
	 * @param loginEmp
	 * @return
	 */
	int initSetTime(Map<String, Object> newData);

}