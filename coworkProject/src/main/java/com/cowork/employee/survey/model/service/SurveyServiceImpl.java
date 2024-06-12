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
		
		// 6. 전체 대상인지 여부 
		String surveyEntireTargetFl;
		
		//6. 설문 대상에 관하여 
		// 1) 전체 대상인 경우 
		if(surveyData.getEntire()) {
			// 여기에 왔다면 전체 대상인 것 
			surveyEntireTargetFl = "Y";
		} else if (surveyData.getPosition() != null) {
			// 여기에 왔다면 특정 position 대상 
			surveyEntireTargetFl = "N";
		}else {
			// 여기에 왔다면, 특정인들을 찝어가지고 설문을 하려는 경우임 
			surveyEntireTargetFl = "N";
		}
		
		// SURVEY 테이블에 넣을 재료 다 모음 
		// 일단 시퀀스값부터 가져오자. 
		Integer surveyNo = surveyMapper.surveyNoDetail();
		
		Map<String, Object> paramMap = new HashMap<>();
		paramMap.put("surveyNo", surveyNo);
		paramMap.put("title", title);
		paramMap.put("empCode", empCode);
		paramMap.put("surveyStartDate", surveyStartDate);
		paramMap.put("surveyEndDate", surveyEndDate);
		paramMap.put("surveyEntireTargetFl", surveyEntireTargetFl);
		surveyMapper.insertSurvey(paramMap);
		
		
		// 다음으로는 SURVEY_TARGET 테이블에 행을 삽입할 거임. 
		// 전체대상인 경우에는 설문(SURVEY) 테이블 에 컬럼값으로 확인할 수 있으니 패스 
		// 직급별로 넣었다거나, 특정인들만 대상으로 한 경우 SURVEY_TARGET 테이블에 행을 넣을거임 
		if (surveyData.getPosition() != null) {
			String position = surveyData.getPosition(); // 직급을 얻었다. 
			// 회사 기본키를 얻어온다. 
			Integer comNo = emp.getComNo();
			
			// 해당 회사의 해당 직급의 emp_code 를 List자료구조로 받아온다. 
			Map<String, Object> paramMap2 = new HashMap<>();
			paramMap2.put("position", position);
			paramMap2.put("comNo", comNo);
			
			List<Integer> empCodeList = surveyMapper.specificPositionEmpList(paramMap2);
			
			// 지금 empCodeList 에는 해당 직급의 empCode 들이 들어있겠지. 
			// 얘네들을 하나씩 for문으로 돌리면서 설문대상테이블(SURVEY_TARGET) 에 넣어야 함 
			for(Integer Empcode2 : empCodeList) {
				Map<String, Object> paramMap3 = new HashMap<>();
				paramMap3.put("Empcode2", Empcode2);
				paramMap3.put("surveyNo", surveyNo);
				surveyMapper.insertSurveyTarget(paramMap3);
			}
		}else {
			// 여기에 왔다면, 특정인들을 찝어가지고 설문을 하려는 경우임 
			// 개별적으로 찝은 놈들을 얻어옴 
			List<String> empCodeList = surveyData.getEmpCodeList();
			
			for(String empCode3 : empCodeList) {
				Map<String, Object> paramMap4 = new HashMap<>();
				paramMap4.put("empCode3", empCode3);
				paramMap4.put("surveyNo", surveyNo);
				surveyMapper.insertSurveyTarget(paramMap4);
			}
		}
		
		// SURVEY_SUB 라는 테이블에 
		// 주관식이든 객관식이든 상관없이 행을 삽입해야함. 
		// 필요한 데이터는 다음과 같다. 
		// - 설문 소제목
		// - 설문 기본키 -> 이미 구했음. surveyNo 임 
		// - 설문 소제목 유형 -> 1 은 객관식, 2는 주관식
		
		// 설문 소제목 구해오기 
		List<Question> questionList = surveyData.getQuestions();
		
		for(Question question : questionList) {
			String littleQuestionType = question.getType(); // 소제목 타입 
			String littleQuestionTitle = question.getTitle(); // 소제목
			// 설문 기본키 => surveyNo 이라고 했다. 
			
			if(littleQuestionType.equals("multiple")) {
				//객관식인 경우 
				// SURVEY_SUB 에 행 삽입 
				// 일단 , SURVEY_SUB 에서 시퀀스값 먼저 조회 
				int nextSequenceVal = surveyMapper.findNextSequenceVal();
				
				Map<String, Object> paramMap5 = new HashMap<>();
				paramMap5.put("surveySubNo", nextSequenceVal); 
				paramMap5.put("surveySubTitle", littleQuestionTitle);
				paramMap5.put("questionType", "1");
				paramMap5.put("surveyNo", surveyNo);
				surveyMapper.insertSurveySub(paramMap5);
				
				
				// SURVEY_MULTIPLE 에 행 삽입 
				// 필요한 데이터는
				// 1. SURVEY_SUB_NO(위 필드값중 nextSequenceVal) 이랑
				// 2. 
				
				
			} else {
				// 주관식인 경우 
				// SURVEY_SUB 에 행 삽입 
				int nextSequenceVal = surveyMapper.findNextSequenceVal();
				
				Map<String, Object> paramMap5 = new HashMap<>();
				paramMap5.put("surveySubNo", nextSequenceVal); 
				paramMap5.put("surveySubTitle", littleQuestionTitle);
				paramMap5.put("questionType", "2");
				paramMap5.put("surveyNo", surveyNo);
				surveyMapper.insertSurveySub(paramMap5);
				
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
