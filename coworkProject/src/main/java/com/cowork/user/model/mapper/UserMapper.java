package com.cowork.user.model.mapper;

import java.util.List;
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

	/** 비밀번호 재설정 시 갱신된 인증번호와 대조
	 * @param authKey
	 * @return
	 */
	int checkAuthKey(Map<String, Object> map);

	/** 비밀번호 재설정
	 * @param inputEmp
	 * @return
	 */
	int resetPw(Employee2 inputEmp);

	/** 비밀번호 재설정 성공 시 인증번호 업데이트 -> 메일로 발송했던 버튼 이동 막기 위한 수단
	 * @param map
	 * @return
	 */
	int updateAuthKey(Map<String, Object> map);

	/** 회원가입 성공 이후 회원가입한 empCode 조회
	 * @return
	 */
	int selectEmpCode(String empId);

	/** 최초 관리자 회원가입 시 구성원을 초대할 때 사용할 인증키 생성
	 * @param empCode
	 * @return
	 */
	int createInviteAuthkey(Map<String, Object> data);

	/** 관리자용 초대링크 인증키 해당 회원의 DB Employee 테이블 INVITE_AUTH_KEY 컬럼에 수정 삽입
	 * @param data
	 * @return
	 */
	int insertInviteAuthKey(Map<String, Object> data);

	/** 초대 받은 링크의 인증번호가 유효한지 확인
	 * @param data
	 * @return
	 */
	int checkInviteAuthKey(Map<String, Object> data);

	/** 초대 받은 사람의 회원가입
	 * @param data
	 * @return
	 */
	int inviteSignUp(Map<String, Object> data);

	/** 전자결재 양식 등록
	 * @param map 
	 * @return
	 */
	int registDraft(Map<String, Object> map);

	/** 명함 관련 로직 
	 * @param empCode
	 * @return
	 */
	int countRow(int empCode);

	/** 명함 삽입 
	 * @param empCode
	 */
	void insertRow(int empCode);
	
	/** 명함의 타입 조회 
	 * @param empCode
	 * @return
	 */
	int cardTypeDetail(int empCode);

	int validatePhoneNum(Map<String, Object> paramMap);

	void addAuth(Map<String, Object> paramMap);

	int verifyAuth(Map<String, Object> paramMap);

	/** 로그인한 회원의 ip가 DB에 존재하지는지 확인
	 * @param loginEmp
	 * @return
	 */
	String loginEmpGetIp(Employee2 loginEmp);

	/** 최초 로그인 시 ip 저장
	 * @param loginEmp
	 * @return
	 */
	int firstInsertIp(Employee2 loginEmp);
  
	void resetPwPhoneVersion(Map<String, Object> paramMap);

	/** 회원가입한 관리자에게 전체 권한 부여
	 * @param map
	 * @return
	 */
	int registAuthority(Map<String, Object> map);





	
}