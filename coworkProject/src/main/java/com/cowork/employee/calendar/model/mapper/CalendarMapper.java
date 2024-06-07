package com.cowork.employee.calendar.model.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.cowork.admin.companyInfo.model.dto.Department;
import com.cowork.admin.companyInfo.model.dto.Team;

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

}
