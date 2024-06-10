package com.cowork.employee.calendar.model.service;

import java.util.List;

import com.cowork.admin.companyInfo.model.dto.Department;
import com.cowork.employee.calendar.model.dto.Calendar;
import com.cowork.user.model.dto.Employee2;

public interface CalendarService {

	/** 회사 부서, 팀 조회
	 * @param comNo
	 * @return list
	 */
	List<Department> selectDeptList(int comNo);

	/** 캘린더 insert
	 * @param inputCalendar
	 * @return
	 */
	int calendarInsert(Calendar inputCalendar);

	/** 회사 캘린더 조회해오기
	 * @param comNo
	 * @return calendarList
	 */
	List<Calendar> selectCalendarList(Employee2 loginEmp);

}
