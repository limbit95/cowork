package com.cowork.employee.addr.model.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.session.RowBounds;

import com.cowork.user.model.dto.Employee2;

@Mapper
public interface AddrMapper {

	/** 개인 주소록 그룹 조회
	 * @return
	 */
	List<String> selectGroupList(Employee2 loginEmp);

	/** 리스트 개수 조회
	 * @param map
	 * @return
	 */
	int getListCount(Map<String, Object> map);

	/** 주소록 그룹의 리스트 조회
	 * @param map
	 * @param rowBounds
	 * @return
	 */
	List<Employee2> selectMyAddrList(Map<String, Object> map, RowBounds rowBounds);

	/** 주소록 그룹 코드 조회
	 * @param map
	 * @return
	 */
	int getGroupCode(Map<String, Object> map);

}