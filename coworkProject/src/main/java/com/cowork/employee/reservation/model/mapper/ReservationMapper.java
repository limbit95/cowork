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

}
