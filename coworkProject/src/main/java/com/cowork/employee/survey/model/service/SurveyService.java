package com.cowork.employee.survey.model.service;

import java.util.List;
import java.util.Map;

import org.springframework.ui.Model;

import com.cowork.employee.chatting.model.dto.Employee;
import com.cowork.employee.survey.model.dto.SubjectiveAnswer;
import com.cowork.employee.survey.model.dto.Survey;
import com.cowork.employee.survey.model.dto.SurveyData;
import com.cowork.employee.survey.model.dto.SurveySub;
import com.cowork.user.model.dto.Employee2;

public interface SurveyService {

	/** 설문 홈 : 로그인한 사원이 받은 설문들을 보여줌. 
	 * @param loginEmp
	 * @param currentPage
	 * @param model
	 */
	void receiveSurvey(Employee2 loginEmp, String currentPage, Model model);

	/** 지금 HTTP 요청 메세지를 보낸 사원이 이 설문을 작성할 권한이 있는 사람인지 검증
	 * @param surveyNo
	 * @param loginEmp
	 * @return
	 */
	Boolean validate(String surveyNo, Employee2 loginEmp);

	/** 지금 HTTP 요청 메세지를 보낸 사람이 이 설문을 작성한 적이 있는지 검증
	 * @param surveyNo
	 * @param loginEmp
	 * @return
	 */
	Boolean checkAlreadyWrite(String surveyNo, Employee2 loginEmp);

	
	/** 특정 설문 조회 
	 * @param surveyNo
	 * @param model
	 */
	void getSurvey(String surveyNo, Model model);

	
	/** 설문 답변 저장 
	 * @param answerMap
	 * @param loginEmp
	 */
	void submitAnswer(Map<String, String> answerMap, Employee2 loginEmp);

	
	/** 내가 쓴 설문 
	 * @param loginEmp
	 * @param cp
	 * @param model
	 */
	void mySurvey(Employee2 loginEmp, String cp, Model model);
	
	/** 로그인한 사원의 회사에 존재하는 직급들 조회 
	 * @param emp
	 * @return
	 */
	List<String> positionList(Employee2 emp);
	
	/** 이름으로 사원 조회 
	 * @param empNickname
	 * @param comNo
	 * @return
	 */
	List<Employee2> empList(String empNickname, Integer comNo);


	
	
	/** 작성된 설문을 DB에 저장 
	 * @param surveyData
	 * @param emp
	 */
	void insertSurvey(SurveyData surveyData, Employee2 emp);


	/** 설문 결과 
	 * @param surveyNo
	 * @param loginEmp
	 * @return
	 */
	Map<String, Object> calculate(String surveyNo, Employee2 loginEmp );

	/** 주관식 답변 가져오기 
	 * @param surveySubNo
	 * @return
	 */
	List<SubjectiveAnswer> showSubjectiveAnswer(String surveySubNo);

	/** 설문 삭제 
	 * @param loginEmp
	 * @param surveyNo
	 * @return
	 */
	int surveyDelete(Employee2 loginEmp, Integer surveyNo);

}
