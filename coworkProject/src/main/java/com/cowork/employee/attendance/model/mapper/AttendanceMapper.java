package com.cowork.employee.attendance.model.mapper;

import org.apache.ibatis.annotations.Mapper;

import com.cowork.user.model.dto.Employee2;

@Mapper
public interface AttendanceMapper {

	/** 출근 확인
	 * @param loginEmp
	 * @return
	 */
	int arrivalCheck(Employee2 loginEmp);

	/** 출근 기록 저장
	 * @param loginEmp
	 * @return
	 */
	int arrivalrecord(Employee2 loginEmp);

	/** 당일 출근 기록 조회
	 * @param loginEmp
	 * @return
	 */
	String selectArrivalTime(Employee2 loginEmp);

	/** 퇴근 기록 저장
	 * @param loginEmp
	 * @return
	 */
	int departureRecord(Employee2 loginEmp);

	/** 당일 퇴근 기록 조회
	 * @param loginEmp
	 * @return
	 */
	String selectDepartureTime(Employee2 loginEmp);

}