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

	List<String> positionList(Integer comNo);

	List<Employee2> empList(Map<String, Object> paramMap);

	void insertSurvey(Map<String, Object> paramMap);

	List<Integer> specificPositionEmpList(Map<String, Object> paramMap2);

	Integer surveyNoDetail();

	void insertSurveyTarget(Map<String, Object> paramMap3);

	int findNextSequenceVal();

	void insertSurveySub(Map<String, Object> paramMap5);

	void insertSurveyMultiple(Map<String, Object> paramMap6);

	List<Survey> entireTargetSurvey(Integer comNo);


	
	List<Survey> receiveSurvey(Integer empCode);

	String findEmpFullName(Integer empCode2);

	List<Integer> findSurveySubNo(Integer surveyNo);

	Integer answerCount(Map<String, Object> paramMap11);

	Survey surveyDetail(String surveyNo);

	Integer findComNo(Integer empCode);

	Integer countForValidate(Map<String, Object> paramMap);

	Integer checkAlreadyWrite(Map<String, Object> paramMap);

	//Survey entireTargetSurvey(String surveyNo);

	Survey getSurvey(String surveyNo);

	List<SurveySub> surveySubList(String surveyNo);

	void submitAnswer(Map<String, Object> paramMap);

	List<Survey> mySurvey(Map<String, Object> paramMap);

	Integer countResponse(Integer surveySubNo);

	Integer countMultipleOption(String surveyMultipleNo);

	int getListCount(Integer empCode);

	List<Survey> selectSurveyList(int cp, RowBounds rowBounds);

	List<SubjectiveAnswer> showSubjectiveAnswer(String surveySubNo);

	Integer surveyTargetTotalCount(Integer surveyNo);

	SurveySub findSurveySubRow(String hintSurveySubNo);

	void increaseTotalResponseCount(Integer surveyNo);

	Integer totalEmpCount(Integer comNo);

	Integer totalResponseCount(Integer surveyNo);

	void surveyTargetDelete(Integer surveyNo);

	List<Integer> surveySubNoList(Integer surveyNo);

	void deleteSurveyAnswer(Integer surveySubNo);

	void deleteSurveyMultiple(Integer surveySubNo);

	void deletesurveySub(Integer surveyNo);

	void deleteSurvey(Integer surveyNo);
	

}
