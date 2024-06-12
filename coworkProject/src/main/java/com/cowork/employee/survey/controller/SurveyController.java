package com.cowork.employee.survey.controller;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.cowork.employee.survey.model.dto.SurveyData;
import org.springframework.web.bind.annotation.SessionAttribute;

import com.cowork.employee.chatting.model.dto.Employee;
import com.cowork.employee.survey.model.dto.SurveyData;
import com.cowork.employee.survey.model.service.SurveyService;
import com.cowork.user.model.dto.Employee2;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Controller
@Slf4j
@RequiredArgsConstructor
@RequestMapping("survey")
public class SurveyController {
	
	private final SurveyService surveyService;
	
	
	@GetMapping("receiveSurvey")
	public String surveyHome() {
		return "/employee/survey/surveyList";
	}
	@GetMapping("mySurvey")
	public String mySurvey() {
		return "/employee/survey/mySurvey";
	}
	
	@GetMapping("surveyInsert")
	public String serveyInsert(HttpServletRequest request) {
		

		Employee2 emp = new Employee2();
		emp.setEmpCode(55);
		emp.setEmpId("limbit5");
		emp.setEmpFirstName("임");
		emp.setEmpLastName("성혁");
		emp.setComNo(10);		
		HttpSession session = request.getSession();
		session.setAttribute("loginEmp", emp);
		
		
		return "employee/survey/surveyInsert";
	}
	
	
	
   @PostMapping("/survey2")
   @ResponseBody
    public SurveyData handleSurvey(@RequestBody SurveyData surveyData) {
        // 여기서 surveyData를 처리합니다.
        // 예를 들어, surveyData의 내용을 로그로 출력할 수 있습니다.
        System.out.println("Received Survey Data: " + surveyData);
        
        // 처리 후 응답 반환 (여기서는 간단히 입력 데이터를 그대로 반환)
        return surveyData;
   }

   @PostMapping("/insertSurvey")
   @ResponseBody
    public SurveyData insertSurvey(@RequestBody SurveyData surveyData,
    		@SessionAttribute("loginEmp") Employee2 emp 
    		) {
        // 여기서 surveyData를 처리합니다.
        // 예를 들어, surveyData의 내용을 로그로 출력할 수 있습니다.	   	   
	   log.debug("surveyData.getEntire=={}", surveyData.getEntire());
	   log.debug("surveyData.getPosition()={}", surveyData.getPosition());
	   log.debug("surveyData.getEmpCodeList()={}", surveyData.getEmpCodeList());
	   log.debug("surveyData.getSurveyStartDate()={}", surveyData.getSurveyStartDate());
	   log.debug("surveyData.getSurveyEndDate()={}", surveyData.getSurveyEndDate());
	   log.debug("surveyData.getTitle()={}", surveyData.getTitle());
	   log.debug("surveyData.getQuestions()={}", surveyData.getQuestions());
	   
	   
	   surveyService.insertSurvey(surveyData, emp);

	   
	   
        // 처리 후 응답 반환 (여기서는 간단히 입력 데이터를 그대로 반환)
        return surveyData;
   }
	
	
   @GetMapping("positionList")
   @ResponseBody
   public List<String> positionList(@SessionAttribute("loginEmp") Employee2 emp){
	   
	   log.debug("emp!!!!!!=={}", emp);
	   
	   List<String> positionList = surveyService.positionList(emp);
	   
	   log.debug("positionList ======{}", positionList);
	   
	   return positionList;
   }
   
   @PostMapping("empList")
   @ResponseBody
   public List<Employee2> empList(@RequestBody Map<String, String> paramMap, @SessionAttribute("loginEmp") Employee2 emp  ) {
	   
	   String empNickname = paramMap.get("empNickname");
	   Integer comNo = emp.getComNo();
	   List<Employee2> empList = surveyService.empList(empNickname, comNo);

	   log.debug("empList== {}", empList);
	   
	   return empList;
   }
	
	
	

}
