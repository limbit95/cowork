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

	/** 로그인 서비스
	 * @param empId
	 * @return
	 */
	Employee2 login(String empId);

	/** 회사명, 도메인 등록되어 있는지 확인
	 * @return
	 */
	int domainExist();
	
}