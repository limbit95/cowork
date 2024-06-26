package com.cowork.employee.myInfo.model.mapper;

import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import com.cowork.user.model.dto.Employee2;

@Mapper
public interface MyInfoMapper {
	public int validateDuplicateEmpId(Map<String, String> empId);

	public int updateProfileImg(Map<String, Object> paramMap);

	public int update(Map<String, Object> paramMap);

	public String currentPwDetail(Integer empCode);

	public int updateAsNewPw(Map<String, Object> paramMap);

	public Employee2 getEmp(int empCode); 
	
}
