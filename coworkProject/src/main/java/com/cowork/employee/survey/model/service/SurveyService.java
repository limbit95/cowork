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

	void insertSurvey(SurveyData surveyData, Employee2 emp);

	List<String> positionList(Employee2 emp);

	List<Employee2> empList(String empNickname, Integer comNo);

	void receiveSurvey(Employee2 loginEmp, String currentPage, Model model);

	Boolean validate(String surveyNo, Employee2 loginEmp);

	Boolean checkAlreadyWrite(String surveyNo, Employee2 loginEmp);

	void getSurvey(String surveyNo, Model model);

	void submitAnswer(Map<String, String> answerMap, Employee2 loginEmp);

	void mySurvey(Integer empCode, String cp, Model model);

	Map<String, Object> calculate(String surveyNo);

	List<SubjectiveAnswer> showSubjectiveAnswer(String surveySubNo);

}
