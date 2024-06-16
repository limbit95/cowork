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

	/** 회의실 일정 삭제
	 * @param reservationInfoNo
	 * @return result
	 */
	int reservationDelete(int reservationInfoNo);

	/** 회의실 일정 수정
	 * @param updateReserve
	 * @return result
	 */
	int reservationUpdate(ReserveInfo updateReserve);

	/** 예약 기본키로 한개 선택
	 * @param reserveInfoNo
	 * @return reserveInfo
	 */
	ReserveInfo selectOneReserve(int reserveInfoNo);

	/** 내가 클릭한 미팅룸 빼고 겹치는 거 있는지
	 * @param inputReserveInfo
	 * @return result
	 */
	int checkUpdateMeetingRoom(ReserveInfo updateReserve);

}
