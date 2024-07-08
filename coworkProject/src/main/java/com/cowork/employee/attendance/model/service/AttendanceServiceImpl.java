package com.cowork.employee.attendance.model.service;

import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cowork.employee.attendance.model.dto.TodayIsAttendence;
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
	public int arrivalCheck(Map<String, Object> data) {
		return mapper.arrivalCheck(data);
	}

	// 출근 기록 저장
	@Override
	public int arrivalrecord(Map<String, Object> data) {
		return mapper.arrivalrecord(data);
	}

	// 당일 출근 기록 조회
	@Override
	public String selectArrivalTime(Map<String, Object> data) {
		return mapper.selectArrivalTime(data);
	}

	// 퇴근 기록 저장
	@Override
	public int departureRecord(Map<String, Object> data) {
		return mapper.departureRecord(data);
	}

	// 당일 퇴근 기록 조회
	@Override
	public String selectDepartureTime(Map<String, Object> data) {
		return mapper.selectDepartureTime(data);
	}

	// 출퇴근 기록 불러오기
	@Override
	public TodayIsAttendence attendenceCheck(Map<String, Object> data) {
		return mapper.attendenceCheck(data);
	}

}