package com.cowork.employee.survey.model.dto;

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
public class Survey {
	
	// SURVEY 테이블 
	private Integer surveyNo;
	private Integer empCode; 
	private String surveyMainTitle;
	private String surveyEntireTargetFl;
	private String surveyStartDate;
	private String surveyEndDate; 
	// -- SURVEY_START_DATE 와 SURVEY_END_DATE 의 DATE 타입 
	private Date surveyStartDateDate;
	private Date surveyEndDateDate;
	private Integer restDays;
	private String restDaysNoExist;
	
	// 사원이 해당 설문에 답을 작성한적이 있었는지 여부 
	private Boolean answerFl;
	
	//SURVEY_MULTIPLE 테이블 
	private Integer surveyMultipleNo;
	private String multipleQuestion; // 객관식 문항 
	
	// EMPLOYEE 테이블 
	private String fullName;
	
	private Integer surveyTargetTotalCount; // 설문 전체 대상자 수 
	private Integer totalResponseCount;  // 응답한 사람 수 
	private Double responseRatio; // 응답비율
	
}
