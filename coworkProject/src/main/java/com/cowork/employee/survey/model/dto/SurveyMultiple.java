package com.cowork.employee.survey.model.dto;

import java.util.Date;

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
public class SurveyMultiple {

	private Integer surveyMultipleNo;
	private Integer surveySubNo;
	private String multipleQuestion;
	
}
