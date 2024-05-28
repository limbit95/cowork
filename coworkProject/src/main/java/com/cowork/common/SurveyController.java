package com.cowork.common;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

import lombok.extern.slf4j.Slf4j;

@Controller
@Slf4j
public class SurveyController {

	@GetMapping("survey")
	public String servey() {
		log.info("log");
		return "survey/surveyList";
	}
}
