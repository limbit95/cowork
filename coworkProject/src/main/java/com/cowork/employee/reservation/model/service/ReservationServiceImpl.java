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

	/** 회의실 예약 삭제
	 * @return result
	 */
	@Override
	public int reservationDelete(int reservationInfoNo) {
		return mapper.reservationDelete(reservationInfoNo);
	}

	/** 회의실 수정
	 * @return result
	 */
	@Override
	public int reservationUpdate(ReserveInfo updateReserve) {
		return mapper.reservationUpdate(updateReserve);
	}

	/** 회의실 한개 선택
	 *
	 */
	@Override
	public ReserveInfo selectOneReserve(int reserveInfoNo) {
		return mapper.selectOneReserve(reserveInfoNo);
	}

	/** 내가 체크한 거 빼고 겹치는 회의실 있는지
	 *
	 */
	@Override
	public int checkUpdateMeetingRoom(ReserveInfo updateReserve) {
		return mapper.checkUpdateMeetingRoom(updateReserve);
	}

}
