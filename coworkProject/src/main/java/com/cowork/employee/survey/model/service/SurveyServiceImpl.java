package com.cowork.employee.survey.model.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cowork.employee.chatting.model.dto.Employee;
import com.cowork.employee.survey.model.dto.Question;
import com.cowork.employee.survey.model.dto.SurveyData;
import com.cowork.employee.survey.model.mapper.SurveyMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Transactional
@Slf4j
@Service
@RequiredArgsConstructor
public class SurveyServiceImpl implements SurveyService{
	
	private final SurveyMapper surveyMapper; 
	
	@Override
	public void insertSurvey(SurveyData surveyData, Employee emp ) {
	
		// empCode 사원번호 얻어오기 
		Integer empCode = emp.getEmpCode();
		
		// 설문 테이블에 행을 삽입하면 됨.
		String big= surveyData.getTitle();
		
		
		
		//  
		
		
	
		List<Question> questionList = surveyData.getQuestions();
		for(Question question : questionList) {
			log.debug("question 객체 =={}", question);
			
			String type = question.getType();
			String title = question.getTitle();
			
			log.debug(type);
			log.debug(title);
			
			List<String> optionsList = question.getOptions();
			
			if(optionsList != null) {
				for(String option : optionsList) {
					log.debug(option);
					}				
			}

			
		}
	
	
	}

	/**
	 * 현재 로그인한 사원의 회사 내 직급들을 모두 가져와서 List<String> 타입 자료구조에 담아주는 메서드 
	 */
	@Override
	public List<String> positionList(Employee emp) {
		// 회사(COMPANY) 테이블의 기본키를 파라미터로 받은 emp 에서 얻어온다. 
		Integer comNo = emp.getComNo();
		// 그 회사의 직급들을 모두 가져온다. 
		
		List<String> positionList = surveyMapper.positionList(comNo);
		return positionList;
	}

	@Override
	public List<Employee> empList(String empNickname, Integer comNo) {
		
		Map<String, Object> paramMap = new HashMap<>();
		paramMap.put("empNickname", empNickname);
		paramMap.put("comNo", comNo);
		
		List<Employee> empList = surveyMapper.empList(paramMap);
		
		log.debug("empList=={}", empList);
		log.debug("empNickname=={}", empNickname);
		log.debug("comNo=={}", comNo);
		
		
		
		return empList;
	}
	
	
}
