package com.cowork.employee.calendar.model.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Setter
@Getter
@Builder
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class Calendar {
	private int calendarNo;
	private String calendarTitle;
	private String calendarContent;
	private String calendarColor;
	private int empCode;
	private String calendarStart;
	private String calendarEnd;
	private int comNo;
	private List<String> teamShareList;
	private List<String> deptShareList;
	private int comShareList;
	
	private String comShare;
	private String deptShare;
	private String teamShare;
	
	private String calendarShare;
}
