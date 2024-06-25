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
	int draftKeepInsert(DraftKeep draftKeep);

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

	/** 결재인, 참조인 검색 찾기
	 * @param map
	 * @return
	 */
	List<Employee2> edsmSerach(Map<String, Object> map);
	
	/** 전자결재 내역 조회
	 * @param paramMap
	 * @return
	 */
	List<Edsm> edsmHistory(Map<String, Object> paramMap);

	/** 전자결재 수신
	 * @param paramMap
	 * @return
	 */
	List<Edsm> edsmConfirm(Map<String, Object> paramMap);

	/** 결재자 조회
	 * @param edsmNo
	 * @return
	 */
	List<Approver> approverList(int edsmNo);

	/** 참조자 조회
	 * @param edsmNo
	 * @return
	 */
	Approver referrerList(int edsmNo);

	/** 전자결재 상세
	 * @param edsmNo
	 * @return
	 */
	Edsm edsmDetail(int edsmNo);

	/** 전자결재 파일
	 * @param edsmNo
	 * @return
	 */
	List<EdsmFile> edsmFileList(int edsmNo);

	/** 전자결재 회수
	 * @param edsmNo
	 * @return
	 */
	int edsmDelete(int edsmNo);

	/** 결재자 진행중 수정
	 * @param empCode
	 */
	int approverUpdate(Map<String, Object> empCode);

	/** 전자결재 구분키 변경
	 * @param edsmNo
	 */
	int edsmFlagUpdate(Map<String, Object> map);

	/** 결재자 반려
	 * @param map
	 * @return
	 */
	int edsmRejected(Approver inputApprover);

	/** 전자결재 반려
	 * @param edsmNo
	 * @return
	 */
	int edsmRejectedUpdate(int edsmNo);

	/** 반려 사유 조회
	 * @param edsmNo
	 * @return
	 */
	String rejectedList(int edsmNo);

	/** 전자결재 완료
	 * @param empCode
	 * @return
	 */
	List<Edsm> edsmApproved(int empCode);

}
