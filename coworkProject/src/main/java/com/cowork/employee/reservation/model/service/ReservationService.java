package com.cowork.employee.reservation.model.service;

import com.cowork.employee.reservation.model.dto.ReserveInfo;

public interface ReservationService {

	/** 회의실 예약
	 * @param inputReserveInfo
	 * @return result
	 */
	int reservationInsert(ReserveInfo inputReserveInfo);

}
