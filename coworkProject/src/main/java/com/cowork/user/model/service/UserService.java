package com.cowork.user.model.service;

import java.util.Map;

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
	 * @param empCode 
	 * @return
	 */
	int registCompanyInfo(Company inputCompany, String[] comAddr, int empCode);

	
	
	
	/** 빠른 로그인
	 * @param empId
	 * @return
	 */
	Employee2 quickLogin(String empId);

	
	
	
	/** 비밀번호 재설정 한 이력 있는지 없는지 구분을 위한 인증번호 검사
	 * 비밀번호 재설정 할 때 인증번호가 갱신되고 이후 전에 받았던 이메일의 비밀번호 재설정 페이지로 이동하는
	 * 버튼 클릭 시 기존 버튼에 실려있는 이전 인증번호가 DB에 전송되고 비밀번호 재설정하면서 갱신된 인증번호랑
	 * 일치하지 않으므로 페이지 로드 불가
	 * @param authKey
	 * @return
	 */
	int checkAuthKey(Map<String, Object> map);


	
}