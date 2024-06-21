package com.cowork.admin.authority.model.service;

import java.util.Map;

import com.cowork.user.model.dto.Employee2;

public interface AuthorityManageSerive {

	/** 사원별 권한 목록 조회
	 * @param loginEmp
	 * @param cp
	 * @return
	 */
	Map<String, Object> authorityList(int comNo, int cp);

}
