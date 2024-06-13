package com.cowork.employee.reservation.model.service;

import java.util.List;

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

	/** 회의실 예약 정보 조회
	 * @return reserveInfoList
	 */
	@Override
	public List<ReserveInfo> selectReserveInfoList(int comNo) {
		return mapper.selectReserveInfoList(comNo);
	}

	/** deptNo으로 deptNm 조회
	 * @return deptNm
	 */
	@Override
	public String selectDeptNm(String deptNo) {
		return mapper.selectDeptNm(deptNo);
	}

	/** teamNo으로 teamNm 조회
	 * @return teamNm
	 */
	@Override
	public String selectTeamNm(String teamNo) {
		return mapper.selectTeamNm(teamNo);
	}

	/** 회의실 이용 시간 체크
	 * @return count
	 */
	@Override
	public int checkMeetingRoom(ReserveInfo inputReserveInfo) {
		return mapper.checkMeetingRoom(inputReserveInfo);
	}

}
