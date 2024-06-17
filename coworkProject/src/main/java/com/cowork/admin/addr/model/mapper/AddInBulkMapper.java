package com.cowork.admin.addr.model.mapper;

import java.util.List;

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

	/** 읽어온 엑셀 파일의 사원 정보 DB에 저장(계정 등록)
	 * @param employeeList
	 * @return
	 */
	int registEmployee(Employee2 employee);

}
