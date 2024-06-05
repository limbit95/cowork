package com.cowork.user.model.mapper;

import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import com.cowork.admin.companyInfo.model.dto.Company;
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
	 * @param inputEmp 
	 * @return
	 */
	int domainExist(Employee2 inputEmp);

	/** 사용자 유형 확인
	 * @param inputEmp
	 * @return
	 */
	int selectUserType(Employee2 inputEmp);

	/** 관리자 로그인 서비스
	 * @param empId
	 * @return
	 */
	Employee2 adminLogin(String empId);

	int checkDomain(String inputDomain);

	/** 기업 정보 등록
	 * @param inputCompany
	 * @return
	 */
	int registCompanyInfo(Company inputCompany);

	/** 
	 * 기업 정보 등록하지 않은 관리자가 나중에 로그인 후 기업 정보 등록 페이지로 갔을 때
	 * 그 페이지에서 등록하는 회원을 식별하기 위해 조회해오는 쿼리문
	 * @param empId
	 * @return
	 */
	Employee2 tempEmp(String empId);

	/** 기업 정보 등록하지 않은 관리자 기업 등록과 동시에
	 * 관리자 DB EMPLOYEE 테이블 COM_NO 컬럼에 등록한 기업 정보 삽입
	 * @param map
	 * @return
	 */
	int registAdminCompany(Map<String, Object> map);

	/** 등록한 기업의 식별키 조회
	 * @param domain
	 * @return
	 */
	int selectCompany(String domain);

	
}