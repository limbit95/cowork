package com.cowork.admin.edsm.model.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import com.cowork.admin.edsm.model.dto.Draft;

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

}
