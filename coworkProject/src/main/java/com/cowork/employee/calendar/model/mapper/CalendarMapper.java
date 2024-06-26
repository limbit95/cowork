package com.cowork.employee.calendar.model.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.cowork.admin.companyInfo.model.dto.Department;
import com.cowork.admin.companyInfo.model.dto.Team;
import com.cowork.employee.calendar.model.dto.Calendar;
import com.cowork.user.model.dto.Employee2;

@Mapper
public interface CalendarMapper {

	/** 회사 부서 조회
	 * @param comNo
	 * @return
	 */
	List<Department> selectDeptList(int comNo);

	/** 회사 부서 존재 여부
	 * @param comNo
	 * @return
	 */
	int deptCount(int comNo);

	/** 회사 부서별 팀 조회
	 * @param deptNo
	 * @return
	 */
	List<Team> selectTeamList(int deptNo);

	/** 부서 안에 팀이 있는지 조회
	 * @param deptNo
	 * @return
	 */
	int teamCount(int deptNo);

	/** 달력 insert
	 * @param inputCalendar
	 * @return result
	 */
	int calendarInsert(Calendar inputCalendar);

	/** 회사 전체 일정 보여주기
	 * @param empCode
	 */
	List<Calendar> selectCalendarList(Employee2 loginEmp);

	/** 내가 작성한 일정 보여주기
	 * @param empCode
	 * @return myCalendarList
	 */
	List<Calendar> selectMyCalendarList(int empCode);

	/** 일정 삭제
	 * @param eventCalendarNo
	 * @return result
	 */
	int calendarDelete(int calendarNo);

	/** 일정 수정
	 * @param updateCalendar
	 * @return result
	 */
	int calendarUpdate(Calendar updateCalendar);

	/** 회사 전체 포함된 캘린더 조회
	 * @param comNo
	 * @return companyAllCalendarList
	 */
	List<Calendar> companyAllCalendarList(int comNo);


}
