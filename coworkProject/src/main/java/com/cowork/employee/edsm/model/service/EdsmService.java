package com.cowork.employee.edsm.model.service;

import java.io.IOException;
import java.util.List;
import java.util.Map;

import org.springframework.web.multipart.MultipartFile;

import com.cowork.employee.edsm.model.dto.DraftKeep;
import com.cowork.employee.edsm.model.dto.Edsm;
import com.cowork.user.model.dto.Employee2;

public interface EdsmService {

	/** 결재문서 조회
	 * @param paramMap
	 * @return
	 */
	Map<String, Object> edsmDraftList(Map<String, Object> paramMap);

	/** 자주찾는 결재 등록
	 * @param draftNo
	 * @return
	 */
	int draftKeepYn(DraftKeep draftKeep);
	
	/** 전자결재 양식 상세
	 * @param draftNo
	 * @param comNo
	 * @return
	 */
	Map<String, Object> edsmDetailDraft(int draftNo, int comNo);

	/** 전자결재 등록
	 * @param inputEdsm
	 * @param files
	 * @param approverMap 
	 * @return
	 */
	int edsmRequest(Edsm inputEdsm, List<MultipartFile> files, String approver , String referrer) throws IllegalStateException, IOException;

	/** 결재인, 참조인 검색
	 * @param empFirstName
	 * @return
	 */
	List<Employee2> edsmSerach(String empFirstName, int comNo);

	/** 전자결재 내역 조회
	 * @param paramMap
	 * @return
	 */
	Map<String, Object> edsmHistory(Map<String, Object> paramMap);

	/** 전자결재 상세 조회
	 * @param edsmNo
	 * @return
	 */
	Map<String, Object> edsmDetail(int edsmNo);

}
