package com.cowork.employee.edsm.model.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import com.cowork.admin.edsm.model.dto.Draft;
import com.cowork.employee.edsm.model.dto.DraftKeep;

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

}
