package com.cowork.employee.survey.model.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.session.RowBounds;

import com.cowork.employee.chatting.model.dto.Employee;
import com.cowork.employee.survey.model.dto.SubjectiveAnswer;
import com.cowork.employee.survey.model.dto.Survey;
import com.cowork.employee.survey.model.dto.SurveySub;
import com.cowork.user.model.dto.Employee2;

@Mapper
public interface SurveyMapper {
	
	/** 로그인한 사원의 회사에서 전체 대상 설문인 것들 중 기한 안 지난것 조회  
	 * @param comNo
	 * @return
	 */
	List<Survey> entireTargetSurvey(Integer comNo);
	
	
	/** 전체 대상 설문이 아닌 설문 중 현재 로그인한 사원을 대상으로 하는 설문을 가져온다
	 * @param empCode
	 * @return
	 */
	List<Survey> receiveSurvey(Integer empCode);

	
	/** 사원의 풀네임 조회
	 * @param empCode2
	 * @return
	 */
	String findEmpFullName(Integer empCode2);
	
	/** 특정 설문과 관련된 소제목들의 기본키를 모두 조회
	 * @param surveyNo
	 * @return
	 */
	List<Integer> findSurveySubNo(Integer surveyNo);


	/** 설문에 응답한 적이 있는지를 확인 
	 * @param paramMap11
	 * @return
	 */
	Integer answerCount(Map<String, Object> paramMap11);
	
	/** 회사 기본키 가져오기
	 * @param empCode
	 * @return
	 */
	Integer findComNo(Integer empCode);
	
	/** 특정 설문의 대상자에 특정사원이 포함되어 있는지 확인
	 * @param paramMap
	 * @return
	 */
	Integer countForValidate(Map<String, Object> paramMap);

	
	/** 설문 답변 테이블(SURVEY_ANSWER) 에서 해당 소제목에 해당하는 EMP_CODE 가 존재하는지 확인
	 * @param paramMap
	 * @return
	 */
	Integer checkAlreadyWrite(Map<String, Object> paramMap);

	
	/** 특정 설문 조회 
	 * @param surveyNo
	 * @return
	 */
	Survey getSurvey(String surveyNo);

	
	/** 특정 설문과 관련된 모든 소제목들 조회 
	 * @param surveyNo
	 * @return
	 */
	List<SurveySub> surveySubList(String surveyNo);

	
	/** 설문 소제목 조회 
	 * @param hintSurveySubNo
	 * @return
	 */
	SurveySub findSurveySubRow(String hintSurveySubNo);

	/** SURVEY 테이블의 totalResponseCount 컬럼 + 1 증가 
	 * @param surveyNo
	 */
	void increaseTotalResponseCount(Integer surveyNo);
	
	/** 설문 답변 저장 
	 * @param paramMap
	 */
	void submitAnswer(Map<String, Object> paramMap);


	/** 내 설문 개수 조회
	 * @param empCode
	 * @return
	 */
	int getListCount(Integer empCode);

	
	/** 내 설문 조회 
	 * @param paramMap
	 * @return
	 */
	List<Survey> mySurvey(Map<String, Object> paramMap);

	
	/** 회사 전체 인원수 구하기
	 * @param comNo
	 * @return
	 */
	Integer totalEmpCount(Integer comNo);

	
	/** 특정 설문 대상자 수 구하기
	 * @param surveyNo
	 * @return
	 */
	Integer surveyTargetTotalCount(Integer surveyNo);


	/** 설문응답자수 구하기
	 * @param surveyNo
	 * @return
	 */
	Integer totalResponseCount(Integer surveyNo);
	

	/** 로그인한 사원의 회사에 존재하는 직급들 조회
	 * @param comNo
	 * @return
	 */
	List<String> positionList(Integer comNo);

	/** 이름으로 사원 조회 
	 * @param paramMap
	 * @return
	 */
	List<Employee2> empList(Map<String, Object> paramMap);

	/** SEQ.SURVEY 라는 시퀀스의 다음 값 조회
	 * @return
	 */
	Integer surveyNoDetail();

	
	/** SURVEY 테이블에 행 삽입 
	 * @param paramMap
	 */
	void insertSurvey(Map<String, Object> paramMap);

	
	
	/** 특정회사의 특정직급의 사원들의 EMP_CODE 를 모두 가져옴
	 * @param paramMap2
	 * @return
	 */
	List<Integer> specificPositionEmpList(Map<String, Object> paramMap2);

	
	/** 특정회사의 특정직급의 사원들을 SURVEY_TARGET 테이블에 삽입 
	 * @param paramMap3
	 */
	void insertSurveyTarget(Map<String, Object> paramMap3);

	
	/** SEQ_SURVEY_SUB.NEXTVAL 조회
	 * @return
	 */
	int findNextSequenceVal();

	/** 소제목 삽입 
	 * @param paramMap5
	 */
	void insertSurveySub(Map<String, Object> paramMap5);


	/** 객관식 문항 삽입 
	 * @param paramMap6
	 */
	void insertSurveyMultiple(Map<String, Object> paramMap6);

	/** 해당 소제목의 전체 응답 개수 
	 * @param surveySubNo
	 * @return
	 */
	Integer countResponse(Integer surveySubNo);

	
	/**
	 * @param surveyMultipleNo
	 * @return
	 */
	Integer countMultipleOption(String surveyMultipleNo);

	
	/** 특정 소제목의 주관식 답변 가져오기 
	 * @param surveySubNo
	 * @return
	 */
	List<SubjectiveAnswer> showSubjectiveAnswer(String surveySubNo);

	
	/** 특정 설문 조회
	 * @param surveyNo
	 * @return
	 */
	Survey surveyDetail(String surveyNo);
	
	
	/** SURVEY_TARGET 에서 해당 설문 대상자들을 지움
	 * @param surveyNo
	 */
	void surveyTargetDelete(Integer surveyNo);

	
	/** 특정 설문과 관련된 소제목 기본키들 모두 조회 
	 * @param surveyNo
	 * @return
	 */
	List<Integer> surveySubNoList(Integer surveyNo);
	
	
	/** 설문 답변 지우기 
	 * @param surveySubNo
	 */
	void deleteSurveyAnswer(Integer surveySubNo);

	
	/** 설문 소제목 객관식 문항 지우기
	 * @param surveySubNo
	 */
	void deleteSurveyMultiple(Integer surveySubNo);

	
	/** 설문 소제목 지우기 
	 * @param surveyNo
	 */
	void deletesurveySub(Integer surveyNo);
	
	/** 설문 지우기 
	 * @param surveyNo
	 */
	void deleteSurvey(Integer surveyNo);


}
