package com.cowork.employee.survey.model.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import com.cowork.employee.chatting.model.dto.Employee;
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



}
