package com.cowork.employee.calendar.model.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cowork.admin.companyInfo.model.dto.Department;
import com.cowork.admin.companyInfo.model.dto.Team;
import com.cowork.employee.calendar.model.dto.Calendar;
import com.cowork.employee.calendar.model.mapper.CalendarMapper;
import com.cowork.employee.reservation.model.mapper.ReservationMapper;
import com.cowork.user.model.dto.Employee2;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
@Service
@Slf4j
public class CalendarServiceImpl implements CalendarService {

	private final CalendarMapper mapper;
	
	private final ReservationMapper rm;
	
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

		// 조회해 온 것 중에 COM_SHARE, DEPT_SHARE, TEAM_SHARE 각각 NM으로 바꿔줘야함
		List<Calendar> selectCalendarList = mapper.selectCalendarList(loginEmp);
		
		// 조회해 온 리스트를 calendarShare 에 한 문장으로 부서 정리해서 보내줄 거임
		int temp = loginEmp.getComNo();
		String comShare = String.valueOf(temp);
		
		List<Calendar> shareList = new ArrayList<>(selectCalendarList.size());
		
		for(int i = 0 ; i < selectCalendarList.size() ; i ++) {
			
			Calendar calendar = new Calendar();
			String share = "";
			
			// 회사 공유가 회사 전체일 경우
			if(selectCalendarList.get(i).getComShare().equals("0")) {
				// comShare 가 loginEmp의 comNo 일 경우
				selectCalendarList.get(i).setComShare("0");
			} else {
				share += "회사 전체";
			}
			
			if(selectCalendarList.get(i).getDeptShare() != null) {
				if(!share.equals("")) {
					share += ", ";
				}
				// deptShare 에 있는 번호를 nm 으로 조회해와야함
				// comNo 같은 것 중에
				String[] arr = (selectCalendarList.get(i).getDeptShare()).split("\\^\\^\\^");
				
				for (String a : arr) {
					// a 숫자로 select 해오기
					String deptNm = rm.selectDeptNm(a);
					share += deptNm;
				}
			}
			
			if(selectCalendarList.get(i).getTeamShare() != null) {
				if(!share.equals("")) {
					share += ", ";
				}
				String[] arr = (selectCalendarList.get(i).getTeamShare()).split("\\^\\^\\^");
				
				for(String a : arr) {
					String teamNm = rm.selectTeamNm(a);
					share += teamNm;
				}
			
			}
			
			calendar.setCalendarShare(share);
			shareList.add(calendar);
			
		}
		
		for(int i = 0 ; i < selectCalendarList.size() ; i ++) {
			selectCalendarList.get(i).setCalendarShare(shareList.get(i).getCalendarShare());
		}
		
		return selectCalendarList;

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
	public int calendarDelete(int calendarNo) {
		return mapper.calendarDelete(calendarNo);
	}

	/** 일정 수정
	 * @return result
	 */
	@Override
	public int calendarUpdate(Calendar updateCalendar) {
		return mapper.calendarUpdate(updateCalendar);
	}

	/** 회사 전체 포함 일정 조회
	 * @return companyAllcalendarList
	 */
	@Override
	public List<Calendar> companyAllCalendarList(int comNo) {
		return mapper.companyAllCalendarList(comNo);
	}

}
