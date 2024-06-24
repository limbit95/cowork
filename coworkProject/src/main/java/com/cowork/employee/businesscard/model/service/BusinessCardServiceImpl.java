package com.cowork.employee.businesscard.model.service;

import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cowork.employee.businesscard.model.dto.BusinessCard;
import com.cowork.employee.businesscard.model.mapper.BusinessCardMapper;
import com.cowork.employee.survey.model.mapper.SurveyMapper;
import com.cowork.employee.survey.model.service.SurveyServiceImpl;
import com.cowork.user.model.dto.Employee2;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Transactional
@Slf4j
@Service
@RequiredArgsConstructor
public class BusinessCardServiceImpl implements BusinessCardService{
	
	private final BusinessCardMapper businessMapper;
	
	@Override
	public void decideType(int flag, Employee2 loginEmp) {
		
		Integer empCode = loginEmp.getEmpCode();
		Map<String, Object> paramMap = new HashMap<>();
		paramMap.put("empCode", empCode);
		paramMap.put("flag", flag);
		
		BusinessCard businessCard = businessMapper.findRow(empCode);
		log.debug("businessCard=={}", businessCard);
		
		if(businessCard == null) {
			// 없으면, 하나 삽입해줘 
			businessMapper.insertRow(paramMap);
		}else {
			//있으면, 업데이트 
			businessMapper.updateRow(paramMap);
		}
		
		loginEmp.setBusinessCardFl(flag);
	}
	
	

}
