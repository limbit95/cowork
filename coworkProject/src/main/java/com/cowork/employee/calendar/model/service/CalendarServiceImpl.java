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

	/** 회사 캘린더 list 조회
	 * @return calendarList
	 */
	@Override
	public List<Calendar> selectCalendarList(Employee2 loginEmp) {

		// 조회해와야할 것 title, content, 시작 날짜, 끝나는 날짜, 공유 여부
		// 로그인한 사람의 comNo로 calendar 테이블에 comNo가 같으면서 calendarShare 에 '회사 전체' 포함이면
		// title, content, 시작 날짜, 끝나는 날짜, 색, 작성자 가져오기
		
		// 로그인한 사람의 comNo, deptNm, teamNm 조회해서 담아둔 다음에
		// deptNm, teamNm 이 null 이 아니라면 캘린더 테이블에서 comNo 가 같고 calendarShare 에 deptNm 이나 teamNm 이 겹치는 게 있는지 조회
		Calendar search = mapper.selectTeamSearch(loginEmp.getEmpCode());
		
		int comNo = loginEmp.getComNo();
		String deptNm = search.getDeptNm();
		String teamNm = search.getTeamNm();
		
		// 같은 comNo 가진 calendar 행에서 '회사 전체' 찾아오기
		// 회사 전체이거나 search
		
		
		return null;
	}

}
