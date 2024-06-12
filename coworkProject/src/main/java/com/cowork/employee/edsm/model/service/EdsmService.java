package com.cowork.employee.edsm.model.service;

import java.io.IOException;
import java.util.List;
import java.util.Map;

import org.springframework.web.multipart.MultipartFile;

import com.cowork.employee.edsm.model.dto.DraftKeep;
import com.cowork.employee.edsm.model.dto.Edsm;

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

	/** 전자결재 등록
	 * @param inputEdsm
	 * @param files
	 * @return
	 */
	int edsmRequest(Edsm inputEdsm, List<MultipartFile> files) throws IllegalStateException, IOException;

}
