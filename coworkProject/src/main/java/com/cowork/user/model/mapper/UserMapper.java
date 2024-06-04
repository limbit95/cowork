package com.cowork.user.model.mapper;

import org.apache.ibatis.annotations.Mapper;

import com.cowork.user.model.dto.Employee2;

@Mapper
public interface UserMapper {

	/** 아이디 중복 검사
	 * @param empId
	 * @return
	 */
	int checkId(String empId);

	/** 회원가입
	 * @param inputEmp
	 * @return
	 */
	int signup(Employee2 inputEmp);

	
	
}