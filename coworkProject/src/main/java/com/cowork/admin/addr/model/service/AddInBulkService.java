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
	List<Map<String, Object>> readExcel(MultipartFile excel) throws Exception ;

	/** 사원 계정 정보 조회
	 * @return
	 */
	List<Employee2> selectEmployeeList();

	/** 일괄 추가하려는 구성원 정보 DB에 저장(계정 생성)
	 * @param data
	 * @return
	 */
	int regist(List<Map<String, Object>> data);

	/** ID 리스트 조회
	 * @param comNo
	 * @return
	 */
	List<String> getEmpIdList(int comNo);

}