package com.cowork.employee.edsm.model.service;

import java.util.Map;

import com.cowork.employee.edsm.model.dto.DraftKeep;

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

}
