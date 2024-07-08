package com.cowork.employee.attendance.model.service;

import java.util.Map;

import com.cowork.employee.attendance.model.dto.TodayIsAttendence;
import com.cowork.user.model.dto.Employee2;

public interface AttendanceService {
 
	/** 출근 확인
	 * @param data
	 * @return
	 */
	int arrivalCheck(Map<String, Object> data);

	/** 출근 기록 저장
	 * @param data
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

	/** 당일 퇴근 기록 조회 후 있으면 문자열
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