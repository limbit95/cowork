package com.cowork.admin.attendance.model.mapper;

import java.util.List;
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

	/** 서비스 내 존재하는 회사별 근태 기준 요일 조회
	 * @return
	 */
	List<StandardAttendence> selectAllDayOfWeek();

	/** 근태 기준 요일 변경(일요일 기점으로 자동 일괄 변경)
	 * @return
	 */
	int updateDayOfWeek(StandardAttendence standardAttendence);

}