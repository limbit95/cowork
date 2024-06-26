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

import org.apache.ibatis.session.RowBounds;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.ui.Model;

import com.cowork.common.utility.model.dto.Pagination;
import com.cowork.employee.chatting.model.dto.Employee;
import com.cowork.employee.survey.model.dto.Question;
import com.cowork.employee.survey.model.dto.SubjectiveAnswer;
import com.cowork.employee.survey.model.dto.Survey;
import com.cowork.employee.survey.model.dto.SurveyData;
import com.cowork.employee.survey.model.dto.SurveyMultiple;
import com.cowork.employee.survey.model.dto.SurveySub;
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
		// 회사 기본키 (COMPANY 테이블 기본키) 인 COM_NO 도 넣어준다. 
		Integer comNo= emp.getComNo();
		paramMap.put("comNo", comNo);
		
		
		surveyMapper.insertSurvey(paramMap); 
		
		log.debug("survey.getPostion()====={}", surveyData.getPosition());		
		// 다음으로는 SURVEY_TARGET 테이블에 행을 삽입할 거임. 
		// 전체대상인 경우에는 설문(SURVEY) 테이블 에 컬럼값으로 확인할 수 있으니 패스 
		// 직급별로 넣었다거나, 특정인들만 대상으로 한 경우 SURVEY_TARGET 테이블에 행을 넣을거임 
		
		if (surveyData.getPosition() != null) {
			String position = surveyData.getPosition(); // 직급을 얻었다. 
			
			// 해당 회사의 해당 직급의 emp_code 를 List자료구조로 받아온다. 
			Map<String, Object> paramMap2 = new HashMap<>();
			paramMap2.put("position", position);
			paramMap2.put("comNo", comNo);
			
			log.debug("position=={}", position);
			log.debug("comNo=={}", comNo);
			
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
		}else if(surveyData.getEmpCodeList() != null){
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
		Integer comNo = loginEmp.getComNo();		
		// 전체 대상 설문 중 기한 안 지난것 
		List<Survey> entireTargetSurveyList = surveyMapper.entireTargetSurvey(comNo);
		
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
            
            survey.setRestDays((int)daysBetween);
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
			if(surveySubNoList.size() != 0) {
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

		}
				
		model.addAttribute("currentPage", Integer.valueOf(currentPage));
		model.addAttribute("totalPages", totalPages);
		model.addAttribute("pageGroupSize", pageGroupSize);
		model.addAttribute("currentGroupFirstPage", currentGroupFirstPage);
		model.addAttribute("currentGroupLastPage", currentGroupLastPage);
		model.addAttribute("newSurveyList", newSurveyList);

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
				log.debug("aaaaaaaaaaa");
				return true;
				
			} else {
				// 자격 없다!
				log.debug("bbbbbbbbbbbbb");
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
				log.debug("ccccccccccccccc");
				// 조회된 게 없다 => 자격 없다 
				return false; 
				
			} else{ //(count == 1) 
				log.debug("ddddddddddddddddd");
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

	@Override
	public void getSurvey(String surveyNo, Model model ) {
		
		Survey survey = surveyMapper.getSurvey(surveyNo);
		// 여기서 얻을 수 있는거? 
		// main title 
		String mainTitle = survey.getSurveyMainTitle();
		
		// 다음은 해당 설문과 관련된 모든 소제목들을 조회해올거임 
		List<SurveySub> surveySubList= surveyMapper.surveySubList(surveyNo);
		
		for(SurveySub surveySub : surveySubList) {
			log.debug("surveySub =={} ", surveySub);
		}
		// surveySub ==
		// SurveySub(
		
		// surveySubNo=4, 
		// surveySubTitle=선물로 뭐가 좋을까요?, 
		// questionType=1,  // <- 1이 객관식임. 2가 주관식이고 
		// options=[
		// SurveyMultiple(surveyMultipleNo=11, surveySubNo=4, multipleQuestion=참치캔), 
		// SurveyMultiple(surveyMultipleNo=12, surveySubNo=4, multipleQuestion=식용유), 
		// SurveyMultiple(surveyMultipleNo=13, surveySubNo=4, multipleQuestion=휘발유)
		// ]
		
		//) 
		
		model.addAttribute("mainTitle", mainTitle); // 설문 대제목 
		model.addAttribute("surveySubList", surveySubList);			
	}

	@Override
	public void submitAnswer(Map<String, String> answerMap, Employee2 loginEmp) {
		
		// SURVEY 테이블에 TOTAL_RESPONSE_COUNT 라는 컬럼을 넣고
		// 이 순간마다 +1 씩 해주자. 
		
		
		
		//surveyMapper.increaseTotalResponseCount();
		
		
		
		// key 만 분리
		List<String> keysList = new ArrayList<>();
		for(String key : answerMap.keySet()) {
			keysList.add(key);
		}
		
		// 여기서 key : surveySubNo 이거든 소제목 기본키임. 
		// 이걸로 surveyNo 를 찾아와야함. 
		String hintSurveySubNo  = keysList.get(0);
		
		SurveySub surveySub = surveyMapper.findSurveySubRow(hintSurveySubNo);
		Integer surveyNo = surveySub.getSurveyNo();
		
		surveyMapper.increaseTotalResponseCount(surveyNo);
		
		
		
		// SURVEY_ANSWER 테이블에 행을 삽입해야함. 
		// EMP_CODE 
		Integer empCode = loginEmp.getEmpCode();
		for(String key : keysList) {
			String answer = answerMap.get(key);
			Map<String,Object> paramMap = new HashMap<>();
			paramMap.put("surveySubNo", key);
			paramMap.put("empCode", empCode);
			paramMap.put("answer", answer);
			surveyMapper.submitAnswer(paramMap);
		}
		
		
		
	}

	@Override
	public void mySurvey(Employee2 loginEmp, String cp, Model model) {
		
		Integer comNo = loginEmp.getComNo();		
		Integer empCode = loginEmp.getEmpCode();
		// 2. 현재 페이지 
		int currentPage = Integer.parseInt(cp);
		model.addAttribute("currentPage", currentPage);
		
		// 3. 총 페이지 수 
		// 1) 몇 개의 게시글이 있는지를 알아야 함 
		int totalPosts = surveyMapper.getListCount(empCode); 
		// 2) 한 페이지당 보여질 설문의 수 
		int pageSize = 10; 
		// 3) 총 페이지 수 
		log.debug("totalPosts=={}", totalPosts);
		log.debug("pageSize=={}", pageSize);
		int totalPages = (int) Math.ceil((double) totalPosts/pageSize);
		
		log.debug("totalPages=={}", totalPages);
		
		// 6. 그룹당 페이지 개수 
		int pageGroupSize = 5; 
		
		// 4. 현재 페이지가 속한 그룹의 첫번째 페이지 
		// 1) 현재 그룹을 구해야함. 
		int currentGroup = (int)Math.ceil((double)currentPage/pageGroupSize);
		// 2) 현재 페이지가 속한 그룹의 첫번째 페이지 
		int currentGroupFirstPage = (currentGroup - 1) * pageGroupSize + 1;
		
		// 5. 현재 페이지 그룹의 마지막 페이지 
		int currentGroupLastPage = Math.min(currentGroupFirstPage + pageGroupSize -1, totalPages);
		
		// 1. 현재 페이지에 보여질 게시글(PostsDTO) 을 담은 List 자료구조
		int startRow = (currentPage - 1) * pageSize; 
		
		Map<String, Object> paramMap = new HashMap<>();
		paramMap.put("empCode", empCode);
		paramMap.put("startRow", startRow);
		paramMap.put("pageSize", pageSize);
		
		List<Survey> surveyList = surveyMapper.mySurvey(paramMap);
		
		// surveyList 에 들어있는 각 survey 라는 객체의 restDays(기한) 필드를 채워줄거임. 
		for(Survey survey : surveyList) {			
			
			Date surveyEndDateDate = survey.getSurveyEndDateDate(); // 마지막 날 
            LocalDate endDate = surveyEndDateDate.toInstant().atZone(ZoneId.systemDefault()).toLocalDate(); // LocalDate 타입으로 바꿈 

			LocalDate currentDate = LocalDate.now(); // 현재 시각 
            long daysBetween = ChronoUnit.DAYS.between(currentDate, endDate);
            
            survey.setRestDays((int)daysBetween);
            
            Integer surveyNo = survey.getSurveyNo();
            
            
            // 해당 설문의 전체 대상자 수
            Integer surveyTargetTotalCount;
            
            // 1) 전체 대상 설문인 경우 
            if(survey.getSurveyEntireTargetFl().equals("Y") ) {
            	// 해당 회사의 전체 사원의 수를 구한다. 
            	surveyTargetTotalCount = surveyMapper.totalEmpCount(comNo);
            } else {
                surveyTargetTotalCount = surveyMapper.surveyTargetTotalCount(surveyNo);
            }
            
            survey.setSurveyTargetTotalCount(surveyTargetTotalCount);
            
            // 설문의 응답자 수 
            Integer totalResponseCount = surveyMapper.totalResponseCount(surveyNo);
            survey.setTotalResponseCount(totalResponseCount);
            
            /* 기한이 1보다 작을 경우 "기한 만료" */
            log.debug("survey.기한=={}", survey.getRestDays());
            if(survey.getRestDays() < 1) {
            	survey.setRestDaysNoExist("기한 만료");
            }
		}		 
		
		model.addAttribute("currentPage", currentPage);
		model.addAttribute("totalPages", totalPages);
		model.addAttribute("pageGroupSize", pageGroupSize);
		model.addAttribute("currentGroupFirstPage", currentGroupFirstPage);
		model.addAttribute("currentGroupLastPage", currentGroupLastPage);
		model.addAttribute("surveyList", surveyList);

		}

	@Override
	public Map<String, Object> calculate(String surveyNo, Employee2 loginEmp) {
		
		Integer comNo = loginEmp.getComNo();
		
		// 해당 설문 일단 그냥 가져와봤음.
		Survey survey = surveyMapper.getSurvey(surveyNo);
		
		// 갑자기 드는 생각이 뭐냐면, 설문 소제목 기본키들을 모두 찾아와. 
		// 그 다음에, 그 소제목이 주관식이라면? 그냥 어떤 리스트에 소제목 기본키만 담은 어떤 객체를 넣어두고 
		// 객관식이라면, SURVEY_ANSWER 테이블에서 해당 소제목 기본키를 가진 놈들의 전체 개수를 구한다. 
		// 이 전체 개수가 분모가 됨. 
		// 그리고, 해당 객관식 소제목 기본키의 객관식 항목 기본키를 구한다. 
		// 그리고 예를 들어, 1번문항의 개수를 SURVEY_ANSWER 에서 찾으면, 그 항목의 비율이 구해짐 이를 A라고 표현 
		// A / 전체응답개수 * 100 => A 를 선택한 비율이다.이를 소제목 DTO 에 List 자료구조로 순서대로 껴넣는다면 
		// 가능할 거 같은데 
		// 이게 가능한 이유는, SURVEY_MULTIPLE 기본키가 시퀀스 값으로 고유하기 때문이다. 
		
		// 설문이 대상이 누구인지 신경 쓸 필요 있어? 없어 임마 
		// 왜? 어차피 비율은 응답한 사람이 분모이기 때문. 
		
		
		
		// 시작선 ---------------------------------------------------------
		// 설문 소제목 기본키들을 모두 찾아와. 
		List<SurveySub> surveySubList = surveyMapper.surveySubList(surveyNo);
		
		List<SurveySub> surveySubListReturn = new ArrayList<>();
		
		for(SurveySub surveySub : surveySubList) {
			if(surveySub.getQuestionType().equals("1")) {
				// 객관식인 경우 
				// 각 항목의 비율을 구해야해.
				 
				// 일단 해당 소제목의 응답개수를 구해야해.
				Integer surveySubNo = surveySub.getSurveySubNo();
				Integer totalResponseCount = surveyMapper.countResponse(surveySubNo); // 전체 응답 개수 
				if(totalResponseCount == 0) {
					break;
				}
				List<SurveyMultiple> surveyMultipleList = surveySub.getOptions();
				
				
				for(SurveyMultiple surveyMultiple : surveyMultipleList) {
					
					
					Integer surveyMultipleNo = surveyMultiple.getSurveyMultipleNo();

					
					Integer countMultipleOption= surveyMapper.countMultipleOption(String.valueOf(surveyMultipleNo));

					surveySub.getOptionCount().add(countMultipleOption);

					Double ratio = ((double)countMultipleOption / totalResponseCount) * 100; // 1/2 * 100 = 50

					surveySub.getRatioList().add(ratio);
				}
				
				surveySubListReturn.add(surveySub);
				
			}else {
				// 주관식인 경우 
				surveySubListReturn.add(surveySub);
			}
			
		}
		
		
		// 설문의 일시 : 2024-06-19 일부터 시작되어 2024-06-20에 종료되는 설문입니다. 
		// 응답자수 구해오기 : 전체 설문대상자 121명 중 21명이 설문에 참여하였습니다. 
		log.debug("surveyEndDate=={}",  survey.getSurveyEndDate());
		log.debug("surveyStartDate=={}",  survey.getSurveyStartDate());
		
        // 해당 설문의 전체 대상자 수
        Integer surveyTargetTotalCount;
        
        // 1) 전체 대상 설문인 경우 
        if(survey.getSurveyEntireTargetFl().equals("Y") ) {
        	// 해당 회사의 전체 사원의 수를 구한다. 
        	surveyTargetTotalCount = surveyMapper.totalEmpCount(comNo);
        } else {
            surveyTargetTotalCount = surveyMapper.surveyTargetTotalCount(Integer.parseInt(surveyNo));
        }
        
        survey.setSurveyTargetTotalCount(surveyTargetTotalCount);
        
        // 설문의 응답자 수 
        Integer totalResponseCount = surveyMapper.totalResponseCount(Integer.parseInt(surveyNo));
        survey.setTotalResponseCount(totalResponseCount);
        
        
        Double responseRatio = ((double)totalResponseCount/surveyTargetTotalCount) * 100;
        survey.setResponseRatio(responseRatio);
        
		Map<String, Object> returnMap = new HashMap<>();
		returnMap.put("surveySubListReturn", surveySubListReturn);
		returnMap.put("survey", survey);
		
		return returnMap;
	}

	@Override
	public List<SubjectiveAnswer> showSubjectiveAnswer(String surveySubNo) {		
		
		List<SubjectiveAnswer> subjectiveAnswerList = surveyMapper.showSubjectiveAnswer(surveySubNo);
		return subjectiveAnswerList;
	}

	@Override
	public int surveyDelete(Employee2 loginEmp, Integer surveyNo) {
		// 1. 지금 삭제 요청한 사원이 해당 설문을 작성한 사람이 맞는지 검증한다. 
		Survey findSurvey = surveyMapper.surveyDetail(String.valueOf(surveyNo));
		if(findSurvey.getEmpCode() != loginEmp.getEmpCode()) {
			return 0; 
		}
		
		// 여기까지 왔다는 건, 설문을 작성한 사람이 삭제요청을 보냈다는 것. 
		// 2. SURVEY_TARGET 에서 관련 대상자들을 지운다.		
		surveyMapper.surveyTargetDelete(surveyNo);
		
		// 3. SURVEY_ANSWER 에서 답변들을 지운다. 
		// 4. SURVEY_MULTIPLE 에서 객관식 문항들을 지운다.
		// 위 두가지를 하기 위해서, SURVEY_SUB 의 기본키가 필요하다. 
		List<Integer> surveySubNoList = surveyMapper.surveySubNoList(surveyNo);
		for(Integer surveySubNo : surveySubNoList) {
			surveyMapper.deleteSurveyAnswer(surveySubNo);
			surveyMapper.deleteSurveyMultiple(surveySubNo);
		}
		
		// 5. SURVEY_SUB 에서 소제목들을 지운다. 
		surveyMapper.deletesurveySub(surveyNo);
		
		// 6. SURVEY 에서 해당 설문을 지운다. 
		surveyMapper.deleteSurvey(surveyNo);
		
		
		return 1;
	}
	
	
	
	
}
















