package com.cowork.email.model.service;

import java.util.List;
import java.util.Map;

import com.cowork.user.model.dto.Employee2;

public interface EmailService {
	
	/** 이메일 보내기
	 * @param string
	 * @param email
	 * @return authKey
	 */
	String sendEmail(String string, String email);

	/** 이메일, 인증번호 확인
	 * @param map
	 * @return count
	 */
	int checkAuthKey(Map<String, Object> map);
	
	/** 아이디 찾기 서비스
	 * @param map
	 * @return
	 */
	int findId(Map<String, Object> map);

	/** 해당 이메일로 가입된 모든 아이디 조회
	 * @param map
	 * @return
	 */
	List<Employee2> selectId(Map<String, Object> map);

	/** 비밀번호 찾기(이메일)
	 * @param map
	 * @return
	 */
	int findPwByEmail(Map<String, Object> map);

	/** 이메일 보내기(이메일로 비밀번호 찾기)
	 * 비밀번호 재설정 할 수 있는 승인 버튼을 담에 이메일로 보냄
	 * @param string
	 * @param map
	 * @return
	 */
	int sendEmail(String string, Map<String, Object> map);

	/** 구성원 초대 이메일 발송
	 * @param emailList
	 * @param loginEmp
	 * @return
	 */
	String registYourself(String[] emailList, Employee2 loginEmp);

	/** 구성원 일괄 등록 이후 등록한 계정을 사용할 구성원들에게 계정 정보 메일로 전송
	 * @param map
	 * @return
	 */
	int sendMailAfterAddInBulk(Map<String, Object> map);

}