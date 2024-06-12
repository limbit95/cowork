package com.cowork.employee.reservation.model.mapper;

import org.apache.ibatis.annotations.Mapper;

import com.cowork.employee.reservation.model.dto.ReserveInfo;

@Mapper
public interface ReservationMapper {

	/** 회의실 예약
	 * @param inputReserveInfo
	 * @return result
	 */
	int reservationInsert(ReserveInfo inputReserveInfo);

}
