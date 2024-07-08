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
	private String dayOfWeek;
	private String calcByInTime;
	private String calcByOffTime;
	private String settingStatus;
	
	private Map<String, Boolean> dayOfWeekMap = new HashMap<String, Boolean>();
	
	public void MapTodayOfWeek(String dayOfWeek) {
		this.dayOfWeekMap.put("MONDAY", false);
		this.dayOfWeekMap.put("TUESDAY", false);
		this.dayOfWeekMap.put("WEDNESDAY", false);
		this.dayOfWeekMap.put("THURSDAY", false);
		this.dayOfWeekMap.put("FRIDAY", false);
		this.dayOfWeekMap.put("SATURDAY", false);
		this.dayOfWeekMap.put("SUNDAY", false);
		
		String[] dayOfWeekArr = dayOfWeek.split(",");
		
		for(int i = 0; i < dayOfWeekArr.length; i++) {
			this.dayOfWeekMap.put(dayOfWeekArr[i], true);
		}
	}
	
}