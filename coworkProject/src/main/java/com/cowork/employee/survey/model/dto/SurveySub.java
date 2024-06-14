package com.cowork.employee.survey.model.dto;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Builder // 인스턴스 쉽게 만들게해줌.
public class SurveySub {

	// SURVEY_SUB 테이블
	private Integer surveySubNo;
	private String surveySubTitle; // 소제목 
	private String questionType; // 소제목이 객관식인지 주관식인지 
	
	private List<SurveyMultiple> options;
	
	private List<Integer> ratioList = new ArrayList<>();
}
