package com.cowork.employee.reservation.model.service;

import java.util.List;

import com.cowork.employee.reservation.model.dto.ReserveInfo;

public interface ReservationService {

	/** 회의실 예약
	 * @param inputReserveInfo
	 * @return result
	 */
	int reservationInsert(ReserveInfo inputReserveInfo);

	/** 회의실 리스트 조회
	 * @param comNo
	 * @return reserveInfoList
	 */
	List<ReserveInfo> selectReserveInfoList(int comNo);

	/** deptNo으로 deptNm 조회
	 * @param string
	 * @return deptNm
	 */
	String selectDeptNm(String deptNo);

	/** teamNo으로 teamNm 조회
	 * @param string
	 * @return teamNm
	 */
	String selectTeamNm(String teamNo);

	/** 회의실 이용 시간 체크
	 * @param inputReserveInfo
	 * @return count
	 */
	int checkMeetingRoom(ReserveInfo inputReserveInfo);

}
