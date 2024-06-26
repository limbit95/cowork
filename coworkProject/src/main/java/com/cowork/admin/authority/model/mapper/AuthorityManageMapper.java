package com.cowork.admin.authority.model.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.session.RowBounds;

import com.cowork.admin.authority.dto.AuthorityMember;
import com.cowork.user.model.dto.Employee2;

@Mapper
public interface AuthorityManageMapper {

	/** 사원 수 조회
	 * @param empInfo
	 * @return
	 */
	int getAuthorityListCount(Map<String, Object> empInfo);

	/** 사원별 권한 목록 조회
	 * @param empInfo
	 * @param rowBounds
	 * @return
	 */
	List<Employee2> authorityList(Map<String, Object> empInfo, RowBounds rowBounds);

	/** 사원 권한 조회
	 * @param empCode
	 */
	List<AuthorityMember> authorityDetail(int empCode);

	/** 사원 권한 삭제
	 * @param inputAuthorityD
	 */
	int authorityDelete(List<AuthorityMember> inputAuthorityD);

	/** 사원 권한 추가
	 * @param inputAuthorityI
	 * @return
	 */
	int authorityInsert(List<AuthorityMember> inputAuthorityI);

	
}
