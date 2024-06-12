package com.cowork.admin.edsm.model.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import com.cowork.admin.edsm.model.dto.Draft;
import com.cowork.employee.edsm.model.dto.Edsm;
import com.cowork.employee.edsm.model.dto.EdsmFile;

@Mapper
public interface DraftMapper {

	/** 양식 생성
	 * @param inputDraft
	 * @return
	 */
	int edsmCreateDraft(Draft inputDraft);

	/** 전자결재 문서 관리
	 * @param paramMap
	 * @return
	 */
	List<Draft> draftList(Map<String, Object> paramMap);

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

	/** 양식 삭제
	 * @param draftNo
	 * @return
	 */
	int edsmDeleteDraft(int draftNo);

}
