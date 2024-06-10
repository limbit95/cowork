package com.cowork.admin.edsm.model.service;

import java.util.List;
import java.util.Map;

import org.springframework.context.annotation.PropertySource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cowork.admin.edsm.model.dto.Draft;
import com.cowork.admin.edsm.model.mapper.DraftMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Transactional(rollbackFor = Exception.class)
@PropertySource("classpath:/config.properties")
@Slf4j
public class DraftServiceImpl implements DraftService {
	
	private final DraftMapper mapper;

	// 양식 생성
	@Override
	public int edsmCreateDraft(Draft inputDraft) {
		
		int result = mapper.edsmCreateDraft(inputDraft);
		
		if(result == 0) return 0;
		
		int draftNo = inputDraft.getComNo();
		
		return draftNo;
	}

	// 전자결재 문서 관리
	@Override
	public List<Draft> draftList(Map<String, Object> paramMap) {
		// TODO Auto-generated method stub
		return mapper.draftList(paramMap);
	}

}
