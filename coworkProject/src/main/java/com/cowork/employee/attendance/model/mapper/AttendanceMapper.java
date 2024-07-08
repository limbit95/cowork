package com.cowork.employee.attendance.model.mapper;

import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import com.cowork.employee.attendance.model.dto.TodayIsAttendence;
import com.cowork.user.model.dto.Employee2;

@Mapper
public interface AttendanceMapper {

	/** 출근 확인
	 * @param loginEmp
	 * @return
	 */
	int arrivalCheck(Map<String, Object> data);

	/** 출근 기록 저장
	 * @param loginEmp
	 * @return
	 */
	int arrivalrecord(Map<String, Object> data);

	/** 당일 출근 기록 조회
	 * @param loginEmp
	 * @return
	 */
	String selectArrivalTime(Map<String, Object> data);

	/** 퇴근 기록 저장
	 * @param loginEmp
	 * @return
	 */
	int departureRecord(Map<String, Object> data);

	/** 당일 퇴근 기록 조회
	 * @param loginEmp
	 * @return
	 */
	String selectDepartureTime(Map<String, Object> data);

	/** 출퇴근 기록 불러오기
	 * @param data
	 * @return
	 */
	TodayIsAttendence attendenceCheck(Map<String, Object> data);

}