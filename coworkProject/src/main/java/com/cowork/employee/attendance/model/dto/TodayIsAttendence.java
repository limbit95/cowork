package com.cowork.employee.attendance.model.dto;

import java.util.Map;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class TodayIsAttendence {

	private String inTime;
	private String offTime;
	private String attendenceStatus;
	
}