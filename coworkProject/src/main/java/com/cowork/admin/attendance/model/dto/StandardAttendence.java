package com.cowork.admin.attendance.model.dto;

import java.util.HashMap;
import java.util.Map;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@ToString
@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
@Builder
public class StandardAttendence {

	private int standardAtdNo;
	private int comNo;
	private String standardInTime;
	private String standardOffTime;
	private String dayOfWeek; // 현재 적용된 근태 기준 요일
	private String dayOfNextWeek; // 다음에 적용될 근태 기준 요일(일요일에 일괄 적용)
	private String calcByInTime;
	private String calcByOffTime;
	private String settingStatus;
	private String nextStdInTime;
	private String nextStdOffTime;
	
	private Map<String, Boolean> dayOfWeekMap = new HashMap<String, Boolean>();
	private Map<String, Boolean> dayOfNextWeekMap = new HashMap<String, Boolean>();
	
	public Map<String, Boolean> MapTodayOfWeek(String dayOfWeek) {
		Map<String, Boolean> temp = new HashMap<String, Boolean>();
		temp.put("MONDAY", false);
		temp.put("TUESDAY", false);
		temp.put("WEDNESDAY", false);
		temp.put("THURSDAY", false);
		temp.put("FRIDAY", false);
		temp.put("SATURDAY", false);
		temp.put("SUNDAY", false);
		
		String[] dayOfWeekArr = dayOfWeek.split(",");
		
		for(int i = 0; i < dayOfWeekArr.length; i++) {
			temp.put(dayOfWeekArr[i], true);
		}
		
		return temp;
	}
	
}