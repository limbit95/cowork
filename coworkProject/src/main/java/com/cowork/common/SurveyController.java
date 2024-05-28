package com.cowork.common;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class SurveyController {

	@GetMapping("survey")
	public String servey() {
		return "survey/surveyList";
	}
}
