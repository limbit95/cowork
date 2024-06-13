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

}
