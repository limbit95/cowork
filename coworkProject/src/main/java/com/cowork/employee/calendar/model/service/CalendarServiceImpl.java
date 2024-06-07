package com.cowork.employee.calendar.model.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cowork.admin.companyInfo.model.dto.Department;
import com.cowork.admin.companyInfo.model.dto.Team;
import com.cowork.employee.calendar.model.mapper.CalendarMapper;

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
		
		// 부서가 존재하는지 조회
		int count = mapper.deptCount(comNo);
		
		if(count == 0) {
			// 조회된 부서가 없을 경우
			deptList = null;
		} else {
			// 조회된 부서가 존재할 경우
			deptList = mapper.selectDeptList(comNo);
			
			for(int i = 0 ; i < deptList.size() ; i++) {
				// 부서 번호로 팀 조회
				List<Team> teamList = mapper.selectTeamList(deptList.get(i).getDeptNo());
				
			}
		}
		
		return deptList;
	}

}
