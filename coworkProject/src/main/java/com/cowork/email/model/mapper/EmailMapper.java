package com.cowork.email.model.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import com.cowork.user.model.dto.Employee2;

@Mapper
public interface EmailMapper {

	/** 인증번호 업데이트
	 * @param map
	 * @return
	 */
	int updateAuthKey(Map<String, String> map);

	/**
	 * @param map
	 * @return
	 */
	int insertAuthKey(Map<String, String> map);

	/** 이메일, 인증번호 확인
	 * @param map 
	 * @return
	 */
	int checkAuthKey(Map<String, Object> map);

	/** 아이디 찾기
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

}