package com.cowork.admin.addr.model.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import com.cowork.user.model.dto.Employee2;


@Mapper
public interface AddInBulkMapper {

	/** 취소 클릭시 테이블에 저장되었던 사원 정보 삭제
	 * @return
	 */
	int deleteEmployee();

	/** 사원 계정 정보 조회
	 * @return
	 */
	List<Employee2> selectEmployeeList();

	/** 일괄 추가하려는 구성원 정보 DB에 저장(계정 생성)
	 * @param map
	 * @return
	 */
	int regist(Map<String, Object> map);

	/** ID 리스트 조회
	 * @param comNo
	 * @return
	 */
	List<String> getEmpIdList(int comNo);

	/** 팀이 존재하는지 확인
	 * @param data
	 * @return
	 */
	int checkTeamNm(Map<String, Object> data);


}
