package com.cowork.admin.edsm.model.service;

import java.util.List;
import java.util.Map;

import com.cowork.admin.edsm.model.dto.Draft;

public interface DraftService {

	/** 전자결재 문서 관리
	 * @param paramMap
	 * @return
	 */
	List<Draft> draftList(Map<String, Object> paramMap);
	
	/** 양식 생성
	 * @param draft
	 * @return
	 */
	int edsmCreateDraft(Draft inputDraft);

	/** 양식 상세
	 * @param draftNo
	 * @return
	 */
	Draft edsmDetailDraft(int draftNo);

	/** 양식 수정
	 * @param inputDraft
	 * @return
	 */
	int edsmUpdateDraft(Draft inputDraft);

}
