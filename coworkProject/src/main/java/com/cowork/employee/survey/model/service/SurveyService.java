package com.cowork.employee.survey.model.service;

import java.util.List;

import com.cowork.employee.chatting.model.dto.Employee;
import com.cowork.employee.survey.model.dto.SurveyData;

public interface SurveyService {

	void insertSurvey(SurveyData surveyData, Employee emp);

	List<String> positionList(Employee emp);

	List<Employee> empList(String empNickname, Integer comNo);

}
