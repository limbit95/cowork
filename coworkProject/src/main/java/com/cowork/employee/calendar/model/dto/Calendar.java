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
	private String calendarStart;
	private String calendarEnd;
	private String calendarColor;
	private int empCode;
	private List<String> shareList;
}
