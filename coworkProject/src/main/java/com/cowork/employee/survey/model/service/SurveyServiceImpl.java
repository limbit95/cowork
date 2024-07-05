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
	
	
	/** 
	 * 설문 홈 : 로그인한 사원이 받은 설문들을 보여줌. 
	 */
	@Override
	public void receiveSurvey(Employee2 loginEmp, String currentPage, Model model) {
		
		Integer empCode = loginEmp.getEmpCode();
		Integer comNo = loginEmp.getComNo();		
		
		// 로그인한 사원의 회사에서 전체 대상 설문인 것들 중 기한 안 지난것 조회  
		List<Survey> entireTargetSurveyList = surveyMapper.entireTargetSurvey(comNo);
		
		// SURVEY_TARGET 에 행이 들어갔다 == 전체 대상 설문이 아니다 
		// SURVEY_TARGET 테이블에서 현재 로그인한 사원의 EMP_CODE 인 것을 가져온다 == 
		// 전체 대상 설문이 아닌 설문 중 현재 로그인한 사원을 대상으로 하는 설문을 가져온다 
		List<Survey> surveyList = surveyMapper.receiveSurvey(empCode);
				
		// 사원의 풀네임 조회
		for(Survey survey : surveyList) {
			Integer empCode2 = survey.getEmpCode();
			String fullName = surveyMapper.findEmpFullName(empCode2);
			survey.setFullName(fullName);
		}
		
		// 전체 대상 설문 과 특정 대상 설문 을 합침 
		surveyList.addAll(entireTargetSurveyList);		
		
		// 설문 남은 기간 계산 
		for(Survey survey : surveyList) {
			 // 설문 종료일 
			Date surveyEndDateDate = survey.getSurveyEndDateDate(); 
			
			// Date -> LocalDate 타입 변환 
            LocalDate endDate = surveyEndDateDate.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
            
            // 현재 시각 
			LocalDate currentDate = LocalDate.now();
            
			// 남은 기간 계산 
			long daysBetween = ChronoUnit.DAYS.between(currentDate, endDate);
            
            survey.setRestDays((int)daysBetween);
		}

		// 기한이 짧은거 순으로 정렬 
		surveyList.sort(Comparator.comparingInt(Survey::getRestDays)); 
		
		/* --- 페이지네이션 시작 --- */
			
			// 2. 현재 페이지가 몇 페이지인가?  => currentPage
			
			// 3. 총 페이지 수 = 총 게시글 수 / 페이지당 보여질 게시글 수 
			Integer totalPosts = surveyList.size();
			Integer pageSize = 10; // 페이지당 보여질 게시글의 수 
			Integer totalPages = (int)Math.ceil((double)totalPosts / pageSize);
			
			// 6. 몇개의 페이지를 하나의 그룹으로 묶었는지 
			Integer pageGroupSize = 5; 
			
			// 4. 현재 페이지가 속한 페이지그룹의 첫번째 페이지 
			Integer currentGroup = (int)Math.ceil((double)Integer.parseInt(currentPage) / pageGroupSize); // 현재 그
			Integer currentGroupFirstPage = (currentGroup - 1) * pageGroupSize + 1;
			
			// 5. 현재 페이지 그룹의 마지막 페이지 
			Integer currentGroupLastPage = Math.min(currentGroupFirstPage + pageGroupSize - 1, totalPages);
			
			// 1. 현재 페이지에 보여질 게시글을 담은 List 자료구조 	
			List<Survey> newSurveyList = new ArrayList<>();
			for(int i = (Integer.parseInt(currentPage)-1)*pageSize; 
					i < Math.min(Integer.parseInt(currentPage)*pageSize -1, surveyList.size()); 
					i++) {
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

		/* --- 페이지네이션 끝 --- */
	}
	
	
	/**
	 * 지금 HTTP 요청 메세지를 보낸 사원이 이 설문을 작성할 권한이 있는 사람인지 검증
	 */
	@Override
	public Boolean validate(String surveyNo, Employee2 loginEmp) {
		Survey survey = surveyMapper.surveyDetail(surveyNo);
		String surveyEntireTargetFl = survey.getSurveyEntireTargetFl();
		
		if(surveyEntireTargetFl.equals("Y")) {
			// 전체 대상 설문인 경우 
			// 설문작성자의 회사와 현재 HTTP 요청 보낸 사원의 회사가 같은지를 검증한다. 
			Integer empCode = survey.getEmpCode();  
			Integer requestEmpCode = loginEmp.getEmpCode();	
			
			Integer comNo1 = surveyMapper.findComNo(empCode);
			Integer comNo2 = surveyMapper.findComNo(requestEmpCode);
			
			if(comNo1 == comNo2) {
				return true;
			} else {
				return false;
			}
			
		} else {
			// 전체 대상 설문이 아닌 경우  
			// 해당 사원이 그 설문의 대상인지를 설문 대상 테이블에서 조회해보면 됨 
			Map<String, Object> paramMap = new HashMap<>();
			Integer requestEmpCode = loginEmp.getEmpCode();
			paramMap.put("empCode", requestEmpCode);
			paramMap.put("surveyNo", surveyNo);
			
			Integer count = surveyMapper.countForValidate(paramMap);
			
			if(count == 0) {
				return false; 
			} else{
				return true;
			}
		}
	}
	
	
	
	/**
	 * 지금 HTTP 요청 메세지를 보낸 사람이 이 설문을 작성한 적이 있는지 검증
	 */
	@Override
	public Boolean checkAlreadyWrite(String surveyNo, Employee2 loginEmp) {
		// 특정 설문과 관련된 소제목들의 기본키를 모두 조회
		List<Integer> surveySubNoList = surveyMapper.findSurveySubNo(Integer.parseInt(surveyNo));		
		
		// firstSurveySubNo 은 해당 설문 중 첫번째 질문의 소제목 기본키 
		Integer firstSurveySubNo = surveySubNoList.get(0); 
		
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
	
	
	/**
	 * 특정 설문 조회 
	 */
	@Override
	public void getSurvey(String surveyNo, Model model ) {
		
		// 설문 가져오기 
		Survey survey = surveyMapper.getSurvey(surveyNo);
		
		// 다음은 해당 설문과 관련된 모든 소제목들을 조회해올거임 
		List<SurveySub> surveySubList= surveyMapper.surveySubList(surveyNo);
		
		// 대제목 
		String mainTitle = survey.getSurveyMainTitle();

		model.addAttribute("mainTitle", mainTitle); 
		model.addAttribute("surveySubList", surveySubList);			
	}
	
	
	/**
	 * 설문 답변 저장 
	 */
	@Override
	public void submitAnswer(Map<String, String> answerMap, Employee2 loginEmp) {
		
		// answerMap : key 는 surveySubNo(소제목기본키) 이고, value 는 해당 소제목의 답변 이다. 
		
		// 소제목 기본키만 추출 
		List<String> keysList = new ArrayList<>();
		for(String key : answerMap.keySet()) {
			keysList.add(key);
		}
		
		// SURVEY 테이블에 totalResponseCount 라는 컬럼이 있는데, 설문에 답변한 사람이 몇명인지를 나타낸다. 
		// 그걸 + 1 해주는 과정임. 
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
	
	
	/**
	 * 내가 쓴 설문 
	 */
	@Override
	public void mySurvey(Employee2 loginEmp, String cp, Model model) {
		
		Integer comNo = loginEmp.getComNo();		
		Integer empCode = loginEmp.getEmpCode();
		
		/* --- 페이지네이션 --- */
		
		// 2. 현재 페이지 
		int currentPage = Integer.parseInt(cp);
		
		// 3. 총 페이지 수 
			// 1) 몇 개의 게시글이 있는지를 알아야 함 
			int totalPosts = surveyMapper.getListCount(empCode); 
			// 2) 한 페이지당 보여질 설문의 수 
			int pageSize = 10; 
			// 3) 총 페이지 수 
			int totalPages = (int) Math.ceil((double) totalPosts/pageSize);
		
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
		
		// 설문 객체에 "기한" +  "해당 설문 대상자 수" + "해당 설문 응답자 수" 넣기 
		for(Survey survey : surveyList) {			
			
			// 기한 
				// 설문 종료일 
				Date surveyEndDateDate = survey.getSurveyEndDateDate();
				// 설문 종료일 타입 변환 (Date -> LocalDate)
	            LocalDate endDate = surveyEndDateDate.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();  
	
	            // 현재 시각 
				LocalDate currentDate = LocalDate.now();
	            
				// 남은 기한 계산 
				long daysBetween = ChronoUnit.DAYS.between(currentDate, endDate);
	            
	            survey.setRestDays((int)daysBetween);
	            
	            // 기한이 1보다 작을 경우 "기한 만료" 
	            if(survey.getRestDays() < 1) {
	            	survey.setRestDaysNoExist("기한 만료");
	            }
	            
	            Integer surveyNo = survey.getSurveyNo();
            
            
            // 해당 설문의 대상자 수
	            Integer surveyTargetTotalCount;            
	            // 전체 대상 설문인 경우 
	            if(survey.getSurveyEntireTargetFl().equals("Y") ) {
	            	// 해당 회사의 전체 사원의 수를 구한다. 
	            	surveyTargetTotalCount = surveyMapper.totalEmpCount(comNo);
	            } else {
	                surveyTargetTotalCount = surveyMapper.surveyTargetTotalCount(surveyNo);
	            }
            
	            survey.setSurveyTargetTotalCount(surveyTargetTotalCount);
            
            // 해당 설문 응답자 수 
	            Integer totalResponseCount = surveyMapper.totalResponseCount(surveyNo);
	            survey.setTotalResponseCount(totalResponseCount);

		}		 
		
		model.addAttribute("currentPage", currentPage);
		model.addAttribute("totalPages", totalPages);
		model.addAttribute("pageGroupSize", pageGroupSize);
		model.addAttribute("currentGroupFirstPage", currentGroupFirstPage);
		model.addAttribute("currentGroupLastPage", currentGroupLastPage);
		model.addAttribute("surveyList", surveyList);

	}
	
	
	/**
	 * 로그인한 사원의 회사에 존재하는 직급들 조회  
	 */
	@Override
	public List<String> positionList(Employee2 emp) {
		Integer comNo = emp.getComNo();		
		List<String> positionList = surveyMapper.positionList(comNo);
		return positionList;
	}
	
	/**
	 * 이름으로 사원 조회 
	 */
	@Override
	public List<Employee2> empList(String empNickname, Integer comNo) {
		
		Map<String, Object> paramMap = new HashMap<>();
		paramMap.put("empNickname", empNickname);
		paramMap.put("comNo", comNo);
		
		List<Employee2> empList = surveyMapper.empList(paramMap);
		return empList;
	}
	
	
	
	
	/**
	 * 작성된 설문을 DB 에 저장 
	 */
	@Override
	public void insertSurvey(SurveyData surveyData, Employee2 emp ) {
	
		// SURVEY 테이블 에 설문을 넣을 것 
		// ㄱ. 시퀀스 값 => SEQ_SURVEY.NEXTVAL
		// ㄴ. 설문 대제목 
		String title = surveyData.getTitle();
		// ㄷ. 설문 작성자 
		Integer empCode = emp.getEmpCode();
		// ㄹ. 설문 시작일 
		String surveyStartDate = surveyData.getSurveyStartDate();
		// ㅁ. 설문 종료일 
		String surveyEndDate = surveyData.getSurveyEndDate();		
		// ㅂ. 전체 대상인지 여부 
		String surveyEntireTargetFl;
		
		// 설문 대상에 관하여 
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
		
		// SEQ_SURVEY.NEXTVAL 값 미리 조회해옴 
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
		
		// SURVEY 테이블에 행 삽입 
		surveyMapper.insertSurvey(paramMap); 
		
		// 전체 대상 설문이 아닌 경우 => SURVEY_TARGET 테이블에 행 삽입 		
		if (surveyData.getPosition() != null) {
			String position = surveyData.getPosition(); // 직급을 얻었다. 
			
			// 해당 회사의 해당 직급의 emp_code 를 List자료구조로 받아온다. 
			Map<String, Object> paramMap2 = new HashMap<>();
			paramMap2.put("position", position);
			paramMap2.put("comNo", comNo);
			
			// 특정회사의 특정직급의 사원들의 EMP_CODE 를 모두 가져옴
			List<Integer> empCodeList = surveyMapper.specificPositionEmpList(paramMap2);
			
			// 특정회사의 특정직급의 사원들을 SURVEY_TARGET 테이블에 삽입  
			for(Integer Empcode2 : empCodeList) {
				Map<String, Object> paramMap3 = new HashMap<>();
				paramMap3.put("empCode", Empcode2);
				paramMap3.put("surveyNo", surveyNo);
				surveyMapper.insertSurveyTarget(paramMap3);
			}
			
		}else if(surveyData.getEmpCodeList() != null){
			// 특정인들 선택해서 설문을 하는 경우 
			List<String> empCodeList = surveyData.getEmpCodeList();

			for(String empCode3 : empCodeList) {
				Map<String, Object> paramMap4 = new HashMap<>();
				paramMap4.put("empCode", empCode3);
				paramMap4.put("surveyNo", surveyNo);
				surveyMapper.insertSurveyTarget(paramMap4);
			}
		} 
		
		
		// 객관식이든 주관식이든 SURVEY_SUB 테이블에 행 삽입 
		// 필요한 데이터는? 
		// - 설문 소제목
		// - 설문 기본키 -> 이미 구했음. surveyNo 임 
		// - 설문 소제목 유형 -> 1 은 객관식, 2는 주관식		
		
		
		// questionList : 설문 소제목들을 담은 List 자료구조 
		List<Question> questionList = surveyData.getQuestions();
		
		for(Question question : questionList) {

			// 설문 소제목 
			String littleQuestionTitle = question.getTitle();
			// 설문 기본키 => surveyNo 이라고 했다. 
			// 설문 소제목 유형 
			String littleQuestionType = question.getType(); 
			
			if(littleQuestionType.equals("multiple")) {
				//객관식인 경우 
				// SEQ_SURVEY_SUB.NEXTVAL 조회
				int nextSequenceVal = surveyMapper.findNextSequenceVal();
				
				Map<String, Object> paramMap5 = new HashMap<>();
				paramMap5.put("surveySubNo", nextSequenceVal); 
				paramMap5.put("surveySubTitle", littleQuestionTitle);
				paramMap5.put("questionType", "1");
				paramMap5.put("surveyNo", surveyNo);
				// 소제목 삽입 
				surveyMapper.insertSurveySub(paramMap5);
				
				// SURVEY_MULTIPLE 에 행 삽입 
				// 필요한 데이터는
				// - SURVEY_SUB_NO(위 필드값중 nextSequenceVal) 이랑
				// - MULTIPLE_QUESTION 컬럼값인데, 이건 question.getOptions() 에서 하나씩 빼오면 될듯 
				
				List<String> options = question.getOptions();
				
				for(String option : options) {
					
					// 여기서 option 은 객관식 선택지 하나임.
					Map<String, Object> paramMap6 = new HashMap<>();
					paramMap6.put("multipleQuestion", option);  
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
	 * 설문 결과 
	 */
	@Override
	public Map<String, Object> calculate(String surveyNo, Employee2 loginEmp) {
		
		Integer comNo = loginEmp.getComNo();
		
		Survey survey = surveyMapper.getSurvey(surveyNo);		

		// 설문 소제목 기본키들을 모두 조회 
		List<SurveySub> surveySubList = surveyMapper.surveySubList(surveyNo);
		
		// 컨트롤러에 리턴할 SurveySub 타입 객체들을 담은 List 자료구조 
		List<SurveySub> surveySubListReturn = new ArrayList<>();
		
		for(SurveySub surveySub : surveySubList) {
			if(surveySub.getQuestionType().equals("1")) {
				// 객관식인 경우 
				// 각 항목의 비율을 구한다. 
				 
				// totalResponseCount : 일단 해당 소제목의 전체 응답 개수 
				Integer surveySubNo = surveySub.getSurveySubNo();
				Integer totalResponseCount = surveyMapper.countResponse(surveySubNo); 
				// 응답한 사람이 없는 경우 
				if(totalResponseCount == 0) {
					break;
				}
				
				// surveyMultipleList : 객관식 문항들을 담은 List 자료구조 
				List<SurveyMultiple> surveyMultipleList = surveySub.getOptions();
			
				// 반복문을 돌며, "해당 문항을 선택한 개수"와 "해당 문항이 선택된 비율" 을 구한다 
				for(SurveyMultiple surveyMultiple : surveyMultipleList) {
					Integer surveyMultipleNo = surveyMultiple.getSurveyMultipleNo();
					Integer countMultipleOption= surveyMapper.countMultipleOption(String.valueOf(surveyMultipleNo));
					// 해당 문항을 선택한 개수 
					surveySub.getOptionCount().add(countMultipleOption);
					// 해당 문항이 선택된 비율 
					Double ratio = ((double)countMultipleOption / totalResponseCount) * 100; // 1/2 * 100 = 50
					surveySub.getRatioList().add(ratio);
				}
				
				surveySubListReturn.add(surveySub);
				
			}else {
				// 주관식인 경우 
				surveySubListReturn.add(surveySub);
			}
			
		}
				
        // 해당 설문의 전체 대상자 수 구하기 
        Integer surveyTargetTotalCount;
        if(survey.getSurveyEntireTargetFl().equals("Y") ) {
        	// 전체 대상 설문인 경우 
        	surveyTargetTotalCount = surveyMapper.totalEmpCount(comNo);
        } else {
        	// 전체 대상 설문이 아닌 경우 
            surveyTargetTotalCount = surveyMapper.surveyTargetTotalCount(Integer.parseInt(surveyNo));
        }
        survey.setSurveyTargetTotalCount(surveyTargetTotalCount);
        
        // 해당 설문의 응답자 수 구하기 
        Integer totalResponseCount = surveyMapper.totalResponseCount(Integer.parseInt(surveyNo));
        survey.setTotalResponseCount(totalResponseCount);
        
        // 해당 설문의 응답 비율 구하기 
        Double responseRatio = ((double)totalResponseCount/surveyTargetTotalCount) * 100;
        survey.setResponseRatio(responseRatio);
        
		Map<String, Object> returnMap = new HashMap<>();
		returnMap.put("surveySubListReturn", surveySubListReturn);
		returnMap.put("survey", survey);
		
		return returnMap;
	}

	/**
	 * 주관식 답변 가져오기 
	 */
	@Override
	public List<SubjectiveAnswer> showSubjectiveAnswer(String surveySubNo) {		
		
		List<SubjectiveAnswer> subjectiveAnswerList = surveyMapper.showSubjectiveAnswer(surveySubNo);
		return subjectiveAnswerList;
	}

	/**
	 * 설문 삭제 
	 */
	@Override
	public int surveyDelete(Employee2 loginEmp, Integer surveyNo) {
		// 지금 삭제 요청한 사원이 해당 설문을 작성한 사람이 맞는지 검증한다. 
		Survey findSurvey = surveyMapper.surveyDetail(String.valueOf(surveyNo));
		if(findSurvey.getEmpCode() != loginEmp.getEmpCode()) {
			return 0; 
		}
		
		// SURVEY_TARGET 에서 관련 대상자들을 지운다.		
		surveyMapper.surveyTargetDelete(surveyNo);
		
		// "SURVEY_ANSWER 에서 답변들을 지운다" + "SURVEY_MULTIPLE 에서 객관식 문항들을 지운다"
		// 위 두가지를 하기 위해서, SURVEY_SUB 의 기본키가 필요하다. 
		List<Integer> surveySubNoList = surveyMapper.surveySubNoList(surveyNo);
		for(Integer surveySubNo : surveySubNoList) {
			surveyMapper.deleteSurveyAnswer(surveySubNo);
			surveyMapper.deleteSurveyMultiple(surveySubNo);
		}
		
		// SURVEY_SUB 에서 소제목들을 지운다. 
		surveyMapper.deletesurveySub(surveyNo);
		
		// SURVEY 에서 해당 설문을 지운다. 
		surveyMapper.deleteSurvey(surveyNo);
		
		return 1;
	}
	
	
	
	
}
















