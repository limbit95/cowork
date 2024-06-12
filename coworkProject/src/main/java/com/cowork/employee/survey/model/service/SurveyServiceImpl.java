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
import com.cowork.user.model.dto.Employee2;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Transactional
@Slf4j
@Service
@RequiredArgsConstructor
public class SurveyServiceImpl implements SurveyService{
	
	private final SurveyMapper surveyMapper; 
	
	@Override
	public void insertSurvey(SurveyData surveyData, Employee2 emp ) {
	
		// 설문을 넣을 거임. 
		// SURVEY 테이블 
		// 1. 시퀀스 값 => SEQ_SURVEY.NEXTVAL
		// 2. 설문 대제목 
		String title = surveyData.getTitle();
		// 3. 설문 작성자 
		Integer empCode = emp.getEmpCode();
		// 4. 설문 시작일 
		String surveyStartDate = surveyData.getSurveyStartDate();
		// 5. 설문 종료일 
		String surveyEndDate = surveyData.getSurveyEndDate();
		
		
		
		
		
		
		// empCode 사원번호 얻어오기 
		Integer empCode = emp.getEmpCode();
		
		// 설문 테이블에 행을 삽입하면 됨.
		String title = surveyData.getTitle();
		
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
	public List<String> positionList(Employee2 emp) {
		// 회사(COMPANY) 테이블의 기본키를 파라미터로 받은 emp 에서 얻어온다. 
		Integer comNo = emp.getComNo();
		// 그 회사의 직급들을 모두 가져온다. 
		
		List<String> positionList = surveyMapper.positionList(comNo);
		return positionList;
	}

	@Override
	public List<Employee2> empList(String empNickname, Integer comNo) {
		
		Map<String, Object> paramMap = new HashMap<>();
		paramMap.put("empNickname", empNickname);
		paramMap.put("comNo", comNo);
		
		List<Employee2> empList = surveyMapper.empList(paramMap);
		
		log.debug("empList=={}", empList);
		log.debug("empNickname=={}", empNickname);
		log.debug("comNo=={}", comNo);
		
		
		
		return empList;
	}
	
	
}
