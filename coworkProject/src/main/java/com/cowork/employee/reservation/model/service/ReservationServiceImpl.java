package com.cowork.employee.reservation.model.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cowork.employee.reservation.model.dto.ReserveInfo;
import com.cowork.employee.reservation.model.mapper.ReservationMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
@Service
@Slf4j
public class ReservationServiceImpl implements ReservationService {
	
	private final ReservationMapper mapper;
	
	/** 회의실 예약
	 * @return result
	 */
	@Override
	public int reservationInsert(ReserveInfo inputReserveInfo) {
		return mapper.reservationInsert(inputReserveInfo);
	}

}
