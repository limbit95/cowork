package com.cowork.common.scheduling;

import java.util.List;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.cowork.admin.attendance.model.dto.StandardAttendence;
import com.cowork.admin.attendance.model.service.StandardAttendenceService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
@RequiredArgsConstructor
public class AttendenceScheduling {

	private final StandardAttendenceService service;
	
	@Scheduled(cron = "0 0 0 * * Mon")
	public void dayOfWeekScheduling() {
		List<StandardAttendence> listMap = service.selectAllDayOfWeek();
		log.info("데이터 : " + listMap);
		
		for(int i = 0; i < listMap.size(); i++) {
			int result = service.updateDayOfWeek(listMap.get(i));
		}
		
	}
	
}