package com.cowork.employee.myInfo.model.mapper;

import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface MyInfoMapper {
	public int validateDuplicateEmpId(String empId);

	public int updateProfileImg(Map<String, Object> paramMap); 
	
}
