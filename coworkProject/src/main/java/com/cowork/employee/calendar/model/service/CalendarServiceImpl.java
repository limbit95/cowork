package com.cowork.employee.calendar.model.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cowork.admin.companyInfo.model.dto.Department;
import com.cowork.admin.companyInfo.model.dto.Team;
import com.cowork.employee.calendar.model.dto.Calendar;
import com.cowork.employee.calendar.model.mapper.CalendarMapper;
import com.cowork.user.model.dto.Employee2;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
@Service
@Slf4j
public class CalendarServiceImpl implements CalendarService {

	private final CalendarMapper mapper;
	
	@Override
	public List<Department> selectDeptList(int comNo) {
		
		List<Department> deptList = null;
		List<Team> teamList = null;
		// 부서가 존재하는지 조회
		int count = mapper.deptCount(comNo);
		
		if(count == 0) {
			// 조회된 부서가 없을 경우
			deptList = null;
		} else {
			// 조회된 부서가 존재할 경우
			deptList = mapper.selectDeptList(comNo);
			
			for(int i = 0 ; i < deptList.size() ; i++) {
				
				int teamCount = mapper.teamCount(deptList.get(i).getDeptNo());
				
				if(teamCount == 0) {
					teamList = null;
				} else {
					
					// 부서 번호로 팀 조회
					teamList = mapper.selectTeamList(deptList.get(i).getDeptNo());
				}
								
				// 부서 번호가 같으면 teamList 를 DTO 에 넣어주고 싶음
				// 부서 번호 index 가 0 일 때 deptNo 가 1 이면 teamList 에 1번 부서 팀들이 들어가있음
				// 조회된 팀 리스트를
				deptList.get(i).setTeamList(teamList);
				
			}

		}
		
		return deptList;
	}

	/** 달력 insert
	 * @return result
	 */
	@Override
	public int calendarInsert(Calendar inputCalendar) {
	
		return mapper.calendarInsert(inputCalendar);
	}

	/** 로그인한 사람의 회사 전체 일정 보여주기
	 * @return calendarList
	 */
	@Override
	public List<Calendar> selectCalendarList(Employee2 loginEmp) {

		List<Calendar> calendarList = mapper.selectCalendarList(loginEmp.getEmpCode());
		
		return calendarList;
	}

	/** 로그인한 사람이 작성한 일정 보여주기
	 * @return myCalendarList
	 */
	@Override
	public List<Calendar> selectMyCalendarList(Employee2 loginEmp) {
		return mapper.selectMyCalendarList(loginEmp.getEmpCode());
	}

	/** 일정 삭제
	 * @return result
	 */
	@Override
	public int calendarDelete(String eventCalendarNo) {
		return mapper.calendarDelete(eventCalendarNo);
	}

}
