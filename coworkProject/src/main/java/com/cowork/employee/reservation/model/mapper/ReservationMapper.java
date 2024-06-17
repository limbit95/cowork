package com.cowork.employee.reservation.model.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.cowork.employee.reservation.model.dto.ReserveInfo;

@Mapper
public interface ReservationMapper {

	/** 회의실 예약
	 * @param inputReserveInfo
	 * @return result
	 */
	int reservationInsert(ReserveInfo inputReserveInfo);

	/** 회의실 예약 목록 조회
	 * @param comNo
	 * @return reserveInfoList
	 */
	List<ReserveInfo> selectReserveInfoList(int comNo);

	/** deptNo 으로 deptNm 조회
	 * @param deptNo
	 * @return deptNm
	 */
	String selectDeptNm(String deptNo);

	/** teamNo 으로 teamNm 조회
	 * @param teamNo
	 * @return teamNm
	 */
	String selectTeamNm(String teamNo);

	/** 회의실 이용 시간 체크
	 * @param inputReserveInfo
	 * @return count
	 */
	int checkMeetingRoom(ReserveInfo inputReserveInfo);

	/** 회의실 예약 삭제
	 * @param reservationInfoNo
	 * @return
	 */
	int reservationDelete(int reservationInfoNo);

	/** 회의실 수정
	 * @param updateReserve
	 * @return result
	 */
	int reservationUpdate(ReserveInfo updateReserve);

	/** 한개 선택
	 * @param reserveInfoNo
	 * @return
	 */
	ReserveInfo selectOneReserve(int reserveInfoNo);

	/** 겹치는 회의실 조회 내가 클릭한 거 제외
	 * @param updateReserve
	 * @return count
	 */
	int checkUpdateMeetingRoom(ReserveInfo updateReserve);

}
