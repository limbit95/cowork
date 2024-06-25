package com.cowork.employee.usermain.model.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.cowork.admin.authority.dto.AuthorityMember;
import com.cowork.employee.notice.model.dto.Notice;

@Mapper
public interface UserMainMapper {

	/** 사용자 권한여부
	 * @param empCode
	 * @return
	 */
	int authorityCnt(int empCode);

	/** 관리자 권한 조회
	 * @param empCode
	 * @return
	 */
	List<AuthorityMember> authorityList(int empCode);

	/** 공지사항 조회
	 * @param comNo
	 * @return
	 */
	List<Notice> noticeList(int comNo);

}
