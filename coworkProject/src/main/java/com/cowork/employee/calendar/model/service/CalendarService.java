package com.cowork.employee.calendar.model.service;

import java.util.List;

import com.cowork.admin.companyInfo.model.dto.Department;

public interface CalendarService {

	List<Department> selectDeptList(int comNo);

}
