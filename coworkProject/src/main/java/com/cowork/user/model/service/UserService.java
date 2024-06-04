package com.cowork.user.model.service;

import com.cowork.user.model.dto.Employee2;

public interface UserService {

	/** 아이디 중복 검사
	 * @param empId
	 * @return
	 */
	int checkId(String empId);

	/** 회원가입 서비스
	 * @param inputEmp
	 * @param empAddress
	 * @return
	 */
	int signup(Employee2 inputEmp, String[] empAddress);
	
}