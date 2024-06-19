package com.cowork.employee.survey.model.dto;

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
public class SubjectiveAnswer {
	
	
	
	// SURVEY_ANSWER
	private Integer answerNo;
	private Integer empCode;
	private Integer surveySubNo;
	private String answer;
	
	// EMPLOYEE 테이블 
	private String fullName;
	private String profileImg;
	
	
	
	
}
