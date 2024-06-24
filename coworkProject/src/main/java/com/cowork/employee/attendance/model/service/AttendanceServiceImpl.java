package com.cowork.employee.attendance.model.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cowork.employee.attendance.model.mapper.AttendanceMapper;
import com.cowork.user.model.dto.Employee2;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(rollbackFor = Exception.class)
public class AttendanceServiceImpl implements AttendanceService {
	
	private final AttendanceMapper mapper;

	// 출근 확인
	@Override
	public int arrivalCheck(Employee2 loginEmp) {
		return mapper.arrivalCheck(loginEmp);
	}

	// 출근 기록 저장
	@Override
	public int arrivalrecord(Employee2 loginEmp) {
		return mapper.arrivalrecord(loginEmp);
	}

	// 당일 출근 기록 조회
	@Override
	public String selectArrivalTime(Employee2 loginEmp) {
		return mapper.selectArrivalTime(loginEmp);
	}

	// 퇴근 기록 저장
	@Override
	public int departureRecord(Employee2 loginEmp) {
		return mapper.departureRecord(loginEmp);
	}

	// 당일 퇴근 기록 조회
	@Override
	public String selectDepartureTime(Employee2 loginEmp) {
		return mapper.selectDepartureTime(loginEmp);
	}

}