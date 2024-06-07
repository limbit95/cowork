package com.cowork.user.model.service;

import com.cowork.admin.companyInfo.model.dto.Company;
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

	/** 로그인 서비스
	 * @param inputEmp
	 * @return
	 */
	Employee2 login(Employee2 inputEmp);

	/** 도메인 중복 검사
	 * @param inputDomain
	 * @return
	 */
	int checkDomain(String inputDomain);

	/** 기업 정보 등록
	 * @param inputCompany
	 * @param comAddr 
	 * @return
	 */
	int registCompanyInfo(Company inputCompany, String[] comAddr);
	
}