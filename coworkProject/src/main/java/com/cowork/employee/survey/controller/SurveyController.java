package com.cowork.employee.survey.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.cowork.employee.survey.model.dto.SubjectiveAnswer;
import com.cowork.employee.survey.model.dto.Survey;
import com.cowork.employee.survey.model.dto.SurveyData;
import com.cowork.employee.survey.model.dto.SurveySub;

import org.springframework.web.bind.annotation.SessionAttribute;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

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
	
	
	@GetMapping("loginBy61")
	@ResponseBody
	public String loginBy61(HttpServletRequest request) {
		Employee2 emp = new Employee2();                                                                                                                                                                                                                                       
		emp.setEmpCode(55);
		emp.setEmpId("limbit5");
		emp.setEmpFirstName("임");
		emp.setEmpLastName("성혁");
		emp.setEmpBirth("2024-06-20");
		emp.setPhone("01011112222");
		emp.setEmpAddress("03347^^^서울시 은평구 신사동^^^어쩌구저쩌구");		
		emp.setComNo(10);		
		emp.setEmpNo("EMP_NO_002");
		emp.setDeptNm("개발팀");
		emp.setPositionNm("positionNm");
		emp.setWorkPlace("workPlace");
		emp.setContractType("contractType");
		emp.setEmpEmail("empEmail@naver.com");
		emp.setHireDate("hireDate");		
	
		
		
		
		
		HttpSession session = request.getSession();
		session.setAttribute("loginEmp", emp);
		return "임성혁으로 로그인됨";
	}
	
	@GetMapping("receiveSurvey")
	public String surveyHome(@SessionAttribute("loginEmp") Employee2 loginEmp, Model model,
			@RequestParam(value="currentPage", defaultValue = "1") String currentPage,
			HttpServletRequest request 
			) {
		// 로그인한 사원과 관련된 설문을 조회해오기 
		
		/* 지울 부분 */
//		HttpSession session = request.getSession();
		
//		Employee2 emp2 = new Employee2();
//		emp2.setEmpCode(61);
//		emp2.setEmpId("emp2");
//		emp2.setEmpLastName("임");
//		emp2.setEmpFirstName("성혁");
//		emp2.setPhone("01012341234");
//		emp2.setEmpEmail("limbit@naver.com");
//		emp2.setComNo(10);
//		emp2.setTeamNo(10);
//		session.setAttribute("loginEmp", emp2);
		/* 지울 부분 */
		
		log.debug("!!!!!!!!!!!!={}", currentPage);
		
		surveyService.receiveSurvey(loginEmp, currentPage, model);
		
		
		return "employee/survey/surveyList";
	}
	
	@GetMapping("surveyDetail/{surveyNo}")
	public String surveyDetail (
			@PathVariable("surveyNo") String surveyNo, 
			@SessionAttribute("loginEmp") Employee2 loginEmp,
			Model model,
			RedirectAttributes ra 
			) {
		
		// 1. 지금 HTTP 요청 메세지를 보낸 사원이 이 설문을 작성할 권한이 있는 사람인지 검증 
		Boolean flag = surveyService.validate(surveyNo, loginEmp);
		if(!flag) { //  !flag ==> 작성할 권한이 없는 경우 
			ra.addFlashAttribute("noAuthority","잘못된 접근입니다");
			return "redirect:/survey/receiveSurvey";
		} else { // 작성할 권한이 있는 경우 
			// 2. 지금 HTTP 요청 메세지를 보낸 사람이 이 설문을 작성한 적이 있는지 검증 
			// 작성한 적이 있다면? 
			// 이미 작성한 설문조사라는 alert 창을 띄워주면 되지 
			// 작성한 적이 없다면 설문조사를 작성할 수 있는 페이지를 보여주면 됨 
			Boolean check = surveyService.checkAlreadyWrite(surveyNo, loginEmp);
			if(check) {
				// 작성한적이 있다 
				ra.addFlashAttribute("noAuthority","이미 작성한 설문입니다.");
				// 시간이 되면, 이미 작성한 설문입니다. 작성한 설문을 수정할 수 있는 흐름도 만들어주면 좋겠네 )
				return "redirect:/survey/receiveSurvey";
			} else {
				// 작성한 적이 없다 
				// 해당 설문에 관한 걸 가져와서 뿌려주면 되겠네 
				surveyService.getSurvey(surveyNo, model);
			}
		}
		return "employee/survey/surveyDetail";
		
	}
	
	@PostMapping("submitAnswer")
	public String submitAnswer(@RequestParam Map<String, String> answerMap, Model model, @SessionAttribute("loginEmp") Employee2 loginEmp) {
		log.debug("answerMap ==={}", answerMap);
		surveyService.submitAnswer(answerMap, loginEmp);
		return "redirect:/survey/receiveSurvey";
	}
	
	
	@GetMapping("mySurvey")
	public String mySurvey(@SessionAttribute("loginEmp") Employee2 loginEmp,
			@RequestParam(value="currentPage", defaultValue="1") String currentPage ,Model model) {
		
		log.debug("currentPage=={}", currentPage);
		surveyService.mySurvey(loginEmp, currentPage, model);		
		return "employee/survey/mySurvey";
	
	}
	
	
	@GetMapping("surveyInsert")
	public String serveyInsert(HttpServletRequest request) {

//		Employee2 emp = new Employee2();
//		emp.setEmpCode(55);
//		emp.setEmpId("limbit5");
//		emp.setEmpFirstName("임");
//		emp.setEmpLastName("성혁");
//		emp.setComNo(10);		
//		HttpSession session = request.getSession();
//		session.setAttribute("loginEmp", emp);
		
		return "employee/survey/surveyInsert";
	}
	
	
	
   @PostMapping("survey2")
   @ResponseBody
    public SurveyData handleSurvey(@RequestBody SurveyData surveyData) {
        // 여기서 surveyData를 처리합니다.
        // 예를 들어, surveyData의 내용을 로그로 출력할 수 있습니다.
        System.out.println("Received Survey Data: " + surveyData);
        
        // 처리 후 응답 반환 (여기서는 간단히 입력 데이터를 그대로 반환)
        return surveyData;
   }

   @PostMapping("insertSurvey")
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
	   List<String> positionList = surveyService.positionList(emp);
	   return positionList;
   }
   
   @PostMapping("empList")
   @ResponseBody
   public List<Employee2> empList(@RequestBody Map<String, String> paramMap, @SessionAttribute("loginEmp") Employee2 emp  ) {
	   
	   String empNickname = paramMap.get("empNickname");
	   Integer comNo = emp.getComNo();
	   List<Employee2> empList = surveyService.empList(empNickname, comNo);

	   log.debug("empList == {}", empList);
	   
	   return empList;
   }
   
   
   @GetMapping("calculate/{surveyNo}")
   public String calculate (@PathVariable("surveyNo") String surveyNo, Model model,
		   	@SessionAttribute("loginEmp") Employee2 loginEmp
		   ) {
	   
	   // 해당 설문에 대한 통계를 가져와야 함. 
	   Map<String, Object> returnMap = surveyService.calculate(surveyNo, loginEmp);
	   List<SurveySub> surveySubList = (List<SurveySub>) returnMap.get("surveySubListReturn");
	   Survey survey = (Survey)returnMap.get("survey");
	   
	   model.addAttribute("surveySubList", surveySubList);
	   model.addAttribute("survey", survey);
	   
	   return "employee/survey/surveyCalculate";
   }
   
   @GetMapping("showSubjectiveAnswer")
   public String showSubjectiveAnswer (@RequestParam("surveySubNo") String surveySubNo, 
		   	@RequestParam("surveySubTitle") String surveySubTitle,
		   	@RequestParam("surveyMainTitle") String surveyMainTitle,
		   	Model model) {
	   
	   List<SubjectiveAnswer> subjectiveAnswerList = surveyService.showSubjectiveAnswer(surveySubNo);

	   model.addAttribute("subjectiveAnswerList", subjectiveAnswerList);
	   model.addAttribute("surveySubTitle", surveySubTitle);
	   model.addAttribute("surveyMainTitle", surveyMainTitle);
	   
	   log.debug("subjectiveAnswerList=={}", subjectiveAnswerList);
	   log.debug("surveySubTitle=={}", surveySubTitle);
	   log.debug("surveyMainTitle=={}", surveyMainTitle);
	   
	   return "employee/survey/subjectiveAnswer";
   }
   
   @PostMapping("delete")
   @ResponseBody
   public int surveyDelete (@SessionAttribute("loginEmp") Employee2 loginEmp, 
		   					@RequestBody Map<String, Integer> paramMap
		   ) {
	   
	   Integer surveyNo = paramMap.get("surveyNo");
	   log.debug("surveyNo=={}", surveyNo);
	   
	   int result = surveyService.surveyDelete(loginEmp, surveyNo);
	   
	   
	   return result;
   }
	
	
	

}
