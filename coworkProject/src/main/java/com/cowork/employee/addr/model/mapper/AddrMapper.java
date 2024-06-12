package com.cowork.employee.addr.model.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.session.RowBounds;

import com.cowork.employee.addr.model.dto.MyAddr;
import com.cowork.user.model.dto.Employee2;

@Mapper
public interface AddrMapper {

	/** 개인 주소록 그룹 조회
	 * @return
	 */
	List<MyAddr> selectGroupList(Employee2 loginEmp);

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
	List<Employee2> selectAddrList(Map<String, Object> map, RowBounds rowBounds);

	/** 주소록 그룹 코드 조회
	 * @param map
	 * @return
	 */
	int getGroupCode(Map<String, Object> map);

	/** 개인 주소록 전체 리스트 개수 조회
	 * @param map
	 * @return
	 */
	List<String> getFullListCount(Map<String, Object> map);

	/** 개인 주소록 전체 리스트 조회
	 * @param map
	 * @param rowBounds
	 * @return
	 */
	List<Employee2> selectAllAddrList(Map<String, Object> map, RowBounds rowBounds);

	/** DB에 있는 주소록은 그룹명만 변경
	 * @param map
	 * @return
	 */
	int changeGroupName(Map<String, String> map);

	/** 기존 DB에 없는 주소록은 insert
	 * @param map
	 * @return
	 */
	int insertGroup(Map<String, String> map);

	/** 그룹 삭제
	 * @param deleteMap
	 * @return
	 */
	int deleteGroup(Map<String, Object> deleteMap);
 
	/** 주소록 이름 중복 검사
	 * @param map
	 * @return
	 */
	int checkAddrName(Map<String, String> map);

	/** 주소록에 등록된 사원 정보 상세 조회
	 * @param map
	 * @return
	 */
	Employee2 empDetail(Map<String, Object> map);

	/** 개인 주소록에 등록된 사원 삭제
	 * @param map
	 * @return
	 */
	int deleteAddr(Map<String, String> map);

	/** 기존 삭제 로직의 요건인 not in 에 들어갈 그룹 식별키가 넘어오지 않아
	 * 그룹이 하나만 남아있을 때는 삭제 기능 수행이 되지 않으므로
	 * 그룹이 하나만 남아있을 때 해당 그 그룹을 삭제시 로그인 회원의 주소록 전부 다 비우기 로직을 추가함
	 * @param loginEmpCode
	 * @return
	 */
	int deleteAllGroup(String loginEmpCode);

}