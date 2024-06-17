package com.cowork.admin.addr.model.service;

import java.util.List;
import java.util.Map;

import org.springframework.web.multipart.MultipartFile;

import com.cowork.user.model.dto.Employee2;


public interface AddInBulkService {

	/** 엑셀 파일의 사원 정보 미리보기 창에 띄우기
	 * @param excel
	 * @return
	 */
	List<Map<String, String>> readExcel(MultipartFile excel) throws Exception ;

	/** 사원 계정 정보 조회
	 * @return
	 */
	List<Employee2> selectEmployeeList();

	/** 읽어온 엑셀 파일의 사원 정보 DB에 저장(계정 등록)
	 * @param employeeList
	 * @return
	 */
	int registEmployee(List<Employee2> inputEmployeeList);
	
}