package com.cowork.admin.authority.model.service;

import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.RequestParam;

import com.cowork.user.model.dto.Employee2;

public interface AuthorityManageSerive {

	/** 사원별 권한 목록 조회
	 * @param loginEmp
	 * @param cp
	 * @return
	 */
	Map<String, Object> authorityList(Map<String, Object> paramMap, int cp);

	/** 사원별 권한 처리
	 * @param authorityList
	 * @return
	 */
	int authorityManage(List<Employee2> authorityList);

}
