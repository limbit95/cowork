package com.cowork.admin.addr.model.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.session.RowBounds;

import com.cowork.admin.companyInfo.model.dto.Department;
import com.cowork.user.model.dto.Employee2;

@Mapper
public interface AdminAddrMapper {

	/** 회사 부서 조회
	 * @param loginEmp
	 * @return
	 */
	List<Department> selectComAddrList(Employee2 loginEmp);

	/** 회사별 사원 리스트 조회
	 * @param loginEmp
	 * @param rowBounds 
	 * @return
	 */
	List<Employee2> selectComList(Employee2 loginEmp, RowBounds rowBounds);

	/** 회사별 사원 수 조회
	 * @param loginEmp
	 * @return
	 */
	int getComListCount(Employee2 loginEmp);

	/** 부서별 사원 수 조회
	 * @param data
	 * @return
	 */
	int getDeptListCount(Map<String, Object> data);

	/** 부서별 사원 리스트 조회
	 * @param data
	 * @param rowBounds
	 * @return
	 */
	List<Employee2> selectDeptList(Map<String, Object> data, RowBounds rowBounds);


}