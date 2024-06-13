package com.cowork.employee.survey.model.service;

import java.time.LocalDate;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.ui.Model;

import com.cowork.employee.chatting.model.dto.Employee;
import com.cowork.employee.survey.model.dto.Question;
import com.cowork.employee.survey.model.dto.Survey;
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
		if(surveyData.getEntire() != null) {
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
			
			log.debug("asdasd=={}", empCodeList);
			
			// 지금 empCodeList 에는 해당 직급의 empCode 들이 들어있겠지. 
			// 얘네들을 하나씩 for문으로 돌리면서 설문대상테이블(SURVEY_TARGET) 에 넣어야 함 
			for(Integer Empcode2 : empCodeList) {
				Map<String, Object> paramMap3 = new HashMap<>();
				
				log.debug("EmpCode2=={}", Empcode2);
				log.debug("surveyNo=={}", surveyNo);
				
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
		
		// SURVEY_SUB + SURVEY_MULTIPLE 에 행 삽입 
		
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
				// 2. MULTIPLE_QUESTION 컬럼값인데, 이건 question.getOptions() 에서 하나씩 빼오면 될듯 
				
				List<String> options = question.getOptions();
				
				for(String option : options) {
					
					// 여기서 option 은 하나의 문제임. 
					Map<String, Object> paramMap6 = new HashMap<>();
					paramMap6.put("multipleQuestion", option); // 객관식 선택지 하나임. 
					paramMap6.put("surveySubNo", nextSequenceVal);
					surveyMapper.insertSurveyMultiple(paramMap6);
				}
				
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

	@Override
	public void receiveSurvey(Employee2 loginEmp, String currentPage, Model model) {
		// 로그인한 사원과 관련된 설문을 가져올건데, 
		// 필요한 데이터는 설문제목, 작성자, 기한 임. 
		// 그리고 설문들을 가져올 때에는 기한이 남아있는 것만을 가져온다. 
		// 파이널 시간이 남으면, 기한이 지난 것도 보여줄 수 있는 별도 탭을 만든다. 
		
		Integer empCode = loginEmp.getEmpCode();
		
		// 전체 대상 설문 중 기한 안 지난것 
		List<Survey> entireTargetSurveyList = surveyMapper.entireTargetSurvey(empCode);
		
		// SURVEY_TARGET 에 행이 들어갔다는 건, 전체 대상 설문이 아니라는 거고, 
		// 여기에 EMP_CODE 가 현재 로그인한 사원의 EMP_CODE 와 같은 행들의 SURVEY_NO 컬럼값을 가져오자 
		List<Survey> surveyList = surveyMapper.receiveSurvey(empCode);
				
		for(Survey survey : surveyList) {
			Integer empCode2 = survey.getEmpCode();
			String fullName = surveyMapper.findEmpFullName(empCode2);
			survey.setFullName(fullName);
		}
		
		surveyList.addAll(entireTargetSurveyList);		
		
		for(Survey survey : surveyList) {
			Date surveyEndDateDate = survey.getSurveyEndDateDate(); // 마지막 날 
            LocalDate endDate = surveyEndDateDate.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();

			LocalDate currentDate = LocalDate.now(); // 현재 시각 
            long daysBetween = ChronoUnit.DAYS.between(currentDate, endDate);
            
            survey.setRestDays(Integer.parseInt(currentPage));
		}
		
		surveyList.sort(Comparator.comparingInt(Survey::getRestDays)); // 기한이 짧은거 순으로 정렬  
		
		
		// 담아줘야 할 것들 6가지  
		// 2. 현재 페이지가 몇 페이지인가?  
		// currentPage

		// 3. 총 페이지 수 = 총 게시글 수 / 페이지당 보여질 게시글 수 
		Integer totalPosts = surveyList.size();
		Integer pageSize = 10; // 페이지당 보여질 게시글의 수 
		Integer totalPages = (int)Math.ceil((double)totalPosts / pageSize);
		// 6. 몇개의 페이지를 하나의 그룹으로 묶었는지 
		Integer pageGroupSize = 5; 
		// 4. 현재 페이지가 속한 페이지그룹의 첫번째 페이지 
		// 현재 페이지 -> currentPage
		// 페이지 그룹의 사이즈 -> pageGroupSize
		Integer currentGroup = (int)Math.ceil((double)Integer.parseInt(currentPage) / pageGroupSize); // 현재 그
		Integer currentGroupFirstPage = (currentGroup - 1) * pageGroupSize + 1;
		
		// 5. 현재 페이지 그룹의 마지막 페이지 
		Integer currentGroupLastPage = Math.min(currentGroupFirstPage + pageGroupSize - 1, totalPages);
		// 1. 현재 페이지에 보여질 게시글을 담은 List 자료구조 	
		// newSurveyList 가 totalPosts 임 
		List<Survey> newSurveyList = new ArrayList<>();
		
		for(int i = (Integer.parseInt(currentPage)-1)*pageSize; i < Math.min(Integer.parseInt(currentPage)*pageSize -1, surveyList.size()); i++) {
			newSurveyList.add(surveyList.get(i));			
		}
		
		// newSurveyList 에 담겨있는 설문들에 현재 HTTP 요청한 사원이 설문답안을 제출한 적이 있는지 검사해서
		// 제출한 적이 있다면, 그걸 표시해줄 필드값을 담아줄것. 
		for(Survey survey: newSurveyList) {
			Integer surveyNo = survey.getSurveyNo();
			// 해당 설문에 포함된 소제목 기본키 하나만 가져와 
			List<Integer> surveySubNoList = surveyMapper.findSurveySubNo(surveyNo);
			Integer firstSurveySubNo = surveySubNoList.get(0);
			
			Map<String, Object> paramMap11 = new HashMap<>();
			paramMap11.put("firstSurveySubNo", firstSurveySubNo);
			paramMap11.put("empCode", empCode);
			
			Integer count = surveyMapper.answerCount(paramMap11);
			
			if(count == 0) {
				survey.setAnswerFl(false);
			} else {
				survey.setAnswerFl(true);
			}

			
		}
				
		model.addAttribute("currentPage", currentPage);
		model.addAttribute("totalPages", totalPages);
		model.addAttribute("pageGroupSize", pageGroupSize);
		model.addAttribute("currentGroupFirstPage", currentGroupFirstPage);
		model.addAttribute("currentGroupLastPage", currentGroupLastPage);
		model.addAttribute("newSurveyList", newSurveyList);
		
		log.debug("newSurveyList======{}", newSurveyList);
		
		
	}

	@Override
	public Boolean validate(String surveyNo, Employee2 loginEmp) {
		// 일단, 해당 설문이 전체대상설문인지를 확인하기 위해서 설문 테이블에서 해당 설문을 가져온다. 
		Survey survey = surveyMapper.surveyDetail(surveyNo);
		String surveyEntireTargetFl = survey.getSurveyEntireTargetFl();
		
		if(surveyEntireTargetFl.equals("Y")) {
			//전체 대상 설문인 경우 
			// 해당 사원이 속한 회사의 전체대상 설문인지를 검증해주면 됨 
			Integer empCode = survey.getEmpCode(); // <- 해당 설문을 작성한 놈의 EMP_CODE 임 
			Integer requestEmpCode = loginEmp.getEmpCode();	// 현재 http요청 보낸 사원의 EMP_CODE
			
			Integer comNo1 = surveyMapper.findComNo(empCode);
			Integer comNo2 = surveyMapper.findComNo(empCode);
			
			if(comNo1 == comNo2) {
				// 자격 있다! 
				return true;
				
			} else {
				// 자격 없다!
				return false;
			}
			
		} else {
			// 전체 대상 설문이 아닌 경우  ==> 해당 사원이 그 설문의 대상인지를 설문 대상 테이블에서 조회해보면 됨 
			Map<String, Object> paramMap = new HashMap<>();
			Integer requestEmpCode = loginEmp.getEmpCode();	// 현재 http요청 보낸 사원의 EMP_CODE

			paramMap.put("empCode", requestEmpCode);
			paramMap.put("surveyNo", surveyNo);
			
			Integer count = surveyMapper.countForValidate(paramMap);
			
			if(count == 0) {
				// 조회된 게 없다 => 자격 없다 
				return false; 
				
			} else{ //(count == 1) 
				// 조회된 게 있다 => 자격 있다 
				return true;
			}
		
		}
		

		
	}

	@Override
	public Boolean checkAlreadyWrite(String surveyNo, Employee2 loginEmp) {
		// 해당 설문에 포함된 소제목 기본키 하나만 가져와 
		List<Integer> surveySubNoList = surveyMapper.findSurveySubNo(Integer.parseInt(surveyNo));		
		Integer firstSurveySubNo = surveySubNoList.get(0); // firstSurveySubNo 은 해당 설문 중 첫번째 질문의 소제목 기본키 
		
		// 설문 답변 테이블(SURVEY_ANSWER) 에서 해당 소제목에 해당하는 EMP_CODE 가 존재하는지 확인
		Map<String, Object> paramMap = new HashMap<>();
		paramMap.put("surveySubNo", firstSurveySubNo);
		paramMap.put("empCode", loginEmp.getEmpCode());
		
		Integer count = surveyMapper.checkAlreadyWrite(paramMap);
		
		if(count > 0) {
			// 작성한 적이 있다 
			return true;
		}else {
			// 작성한 적이 없다 
			return false;
		}
		
		
	}
	
	
}
