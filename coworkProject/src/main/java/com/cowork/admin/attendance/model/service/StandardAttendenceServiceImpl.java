package com.cowork.admin.attendance.model.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cowork.admin.attendance.model.dto.StandardAttendence;
import com.cowork.admin.attendance.model.mapper.StandardAttendenceMapper;
import com.cowork.user.model.dto.Employee2;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Transactional(rollbackFor = Exception.class)
@Slf4j
@RequiredArgsConstructor
public class StandardAttendenceServiceImpl implements StandardAttendenceService {

	private final StandardAttendenceMapper mapper;

	// 설정 타입 조회
	@Override
	public StandardAttendence getStandardAtd(Employee2 loginEmp) {
		
		StandardAttendence stdAtd = mapper.getStandardAtd(loginEmp);
		
		if(stdAtd == null) {
			return null;
		}
		
		if(stdAtd.getDayOfWeek() != null) {
			stdAtd.setDayOfWeekMap(stdAtd.MapTodayOfWeek(stdAtd.getDayOfWeek()));
			stdAtd.setDayOfNextWeekMap(stdAtd.MapTodayOfWeek(stdAtd.getDayOfNextWeek()));
		}
		
		return stdAtd;
	}
	
	// 설정 안함
	@Override
	public int offSet(Employee2 loginEmp) {
		return mapper.offSet(loginEmp);
	}

	// 지정된 시간으로 설정
	@Override
	public int setTime(Employee2 loginEmp, List<Map<String, Object>> data) {
		
		String dayOfWeek = "";
		
		for(Entry<String, Object> entry : data.get(0).entrySet()) {
			if((Boolean)entry.getValue() == true) {
				dayOfWeek += entry.getKey() + ",";
			}
		}
		dayOfWeek = dayOfWeek.substring(0, dayOfWeek.length() - 1);
		
		Map<String, Object> newData = new HashMap<String, Object>();
		newData.put("dayOfWeek", dayOfWeek);
		newData.put("standardInTime", data.get(1).get("standardInTime"));
		newData.put("standardOffTime", data.get(1).get("standardOffTime"));
		newData.put("calcByInTime", data.get(2).get("calcByInTime"));
		newData.put("calcByOffTime", data.get(2).get("calcByOffTime"));
		newData.put("comNo", loginEmp.getComNo());
		
		return mapper.setTime(newData);
	}
	
	// 초기 설정 페이지에서의 설정 안함
	@Override
	public int initOffSet(Employee2 loginEmp) {
		return mapper.initOffSet(loginEmp);
	}
	
	// 초기 설정 페이지에서의 지정된 시간으로 설정
	@Override
	public int initSetTime(Employee2 loginEmp, List<Map<String, Object>> data) {
		
		String dayOfWeek = "";
		
		for(Entry<String, Object> entry : data.get(0).entrySet()) {
			if((Boolean)entry.getValue() == true) {
				dayOfWeek += entry.getKey() + ",";
			}
		}
		dayOfWeek = dayOfWeek.substring(0, dayOfWeek.length() - 1);
		
		Map<String, Object> newData = new HashMap<String, Object>();
		newData.put("dayOfWeek", dayOfWeek);
		newData.put("standardInTime", data.get(1).get("standardInTime"));
		newData.put("standardOffTime", data.get(1).get("standardOffTime"));
		newData.put("calcByInTime", data.get(2).get("calcByInTime"));
		newData.put("calcByOffTime", data.get(2).get("calcByOffTime"));
		newData.put("comNo", loginEmp.getComNo());
		
		return mapper.initSetTime(newData);
	}

	// 서비스 내 존재하는 회사별 근태 기준 요일 조회
	@Override
	public List<StandardAttendence> selectAllDayOfWeek() {
		return mapper.selectAllDayOfWeek();
	}

	// 근태 기준 요일 변경(일요일 기점으로 자동 일괄 변경)
	@Override
	public int updateDayOfWeek(StandardAttendence standardAttendence) {
		return mapper.updateDayOfWeek(standardAttendence);
	}
	
}