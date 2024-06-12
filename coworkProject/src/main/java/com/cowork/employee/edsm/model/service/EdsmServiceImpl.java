package com.cowork.employee.edsm.model.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.context.annotation.PropertySource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cowork.admin.edsm.model.dto.Draft;
import com.cowork.admin.edsm.model.mapper.DraftMapper;
import com.cowork.employee.edsm.model.dto.DraftKeep;
import com.cowork.employee.edsm.model.mapper.EdsmMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Transactional(rollbackFor = Exception.class)
@PropertySource("classpath:/config.properties")
@Slf4j
public class EdsmServiceImpl implements EdsmService{
	
	private final DraftMapper mapper;
	private final EdsmMapper mapperEdsm;
	
	// 결재문서 조회
	@Override
	public Map<String, Object> edsmDraftList(Map<String, Object> paramMap) {
		
		
		List<Draft> draftList = mapper.draftList(paramMap); // 결재문서 조회
		List<Draft> draftKeepList = mapperEdsm.draftKeepList(paramMap); // 자주찾는 결재문서 조회
		Map<String, Object> map = new HashMap<>();
		
		map.put("draftList", draftList);
		map.put("draftKeepList", draftKeepList);
		
		return map;
	}

	// 자주찾는 결재 등록
	@Override
	public int draftKeepYn(DraftKeep draftKeep) {
		
		// 자주찾는 결재 등록되어 있는 경우 수정
		int result = mapperEdsm.draftKeepUpdate(draftKeep);
		
		if(result == 0) mapperEdsm.draftKeepInsert(draftKeep);
		
		return 0;
	}

}
