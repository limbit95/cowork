package com.cowork.employee.survey.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Controller
@Slf4j
@RequiredArgsConstructor
@RequestMapping("survey")
public class SurveyController {
	
	
	@GetMapping("receiveSurvey")
	public String surveyHome() {
		return "/employee/survey/surveyList";
	}
	@GetMapping("mySurvey")
	public String mySurvey() {
		return "/employee/survey/mySurvey";
	}
	
	@GetMapping("surveyInsert")
	public String serveyInsert() {
		return "employee/survey/surveyInsert";
	}
	
	
	
	
	
	/*
	@GetMapping("surveyList")
	public String serveyList() {
		log.info("log");
		return "employee/survey/surveyList";
	}
	
	@GetMapping("surveyInsert")
	public String serveyInsert() {
		return "employee/survey/surveyInsert";
	}
	
	@GetMapping("surveyDetail")
	public String surveyDetail() {
		return "employee/survey/surveyDetail";
	}
	*/
}
