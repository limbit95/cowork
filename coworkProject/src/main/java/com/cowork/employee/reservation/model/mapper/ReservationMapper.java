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

}
