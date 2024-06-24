package com.cowork.employee.usermain.model.service;

import java.util.List;

import com.cowork.admin.authority.dto.AuthorityMember;

public interface UserMainService {

	/** 사용자 권한 여부 조회
	 * @param empCode
	 * @return
	 */
	int authorityCnt(int empCode);

	/** 관리자 권한 조회
	 * @param empCode
	 * @return
	 */
	List<AuthorityMember> authorityList(int empCode);

}
