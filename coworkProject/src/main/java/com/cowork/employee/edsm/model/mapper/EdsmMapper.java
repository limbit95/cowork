package com.cowork.employee.edsm.model.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import com.cowork.admin.edsm.model.dto.Draft;
import com.cowork.employee.edsm.model.dto.Approver;
import com.cowork.employee.edsm.model.dto.DraftKeep;
import com.cowork.employee.edsm.model.dto.Edsm;
import com.cowork.employee.edsm.model.dto.EdsmFile;
import com.cowork.user.model.dto.Employee2;

@Mapper
public interface EdsmMapper {

	/** 즐겨찾기 결재 목록
	 * @param paramMap
	 * @return
	 */
	List<Draft> draftKeepList(Map<String, Object> paramMap);

	/** 자주찾는 결재 수정
	 * @param draftKeep
	 * @return
	 */
	int draftKeepUpdate(DraftKeep draftKeep);

	/** 자주찾는 결재 입력
	 * @param draftKeep
	 */
	void draftKeepInsert(DraftKeep draftKeep);

	/** 전자결재 등록
	 * @param inputEdsm
	 * @return
	 */
	int edsmRequest(Edsm inputEdsm);
	
	/** 전자결재 파일업로드
	 * @param uploadList
	 * @return
	 */
	int edsmFileInsert(List<EdsmFile> uploadList);

	/** 결재자 등록
	 * @param approverMap
	 * @return
	 */
	int approverInsert(List<Approver> approverList);

	/** 결재인, 참조인 검색
	 * @param comNo
	 * @return
	 */
	List<Employee2> employeeSearch(int comNo);

}
