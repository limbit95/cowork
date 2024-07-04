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
	
	
	
	/** 설문 홈 : 로그인한 사원이 받은 설문들을 보여줌. 
	 * @param loginEmp
	 * @param model
	 * @param currentPage
	 * @param request
	 * @return
	 */
	@GetMapping("receiveSurvey")
	public String surveyHome(@SessionAttribute("loginEmp") Employee2 loginEmp, Model model,
			@RequestParam(value="currentPage", defaultValue = "1") String currentPage,
			HttpServletRequest request 
			) {		
		surveyService.receiveSurvey(loginEmp, currentPage, model);
		return "employee/survey/surveyList";
	}	
	
	/** 받은 설문들 중 하나를 클릭했을 때, 그 설문을 보여주는 역할 
	 * @param surveyNo
	 * @param loginEmp
	 * @param model
	 * @param ra
	 * @return
	 */
	@GetMapping("surveyDetail/{surveyNo}")
	public String surveyDetail (
			@PathVariable("surveyNo") String surveyNo, 
			@SessionAttribute("loginEmp") Employee2 loginEmp,
			Model model,
			RedirectAttributes ra 
			) {
		
		// 1. 지금 HTTP 요청 메세지를 보낸 사원이 이 설문을 작성할 권한이 있는 사람인지 검증 
		Boolean flag = surveyService.validate(surveyNo, loginEmp);
		
		if(!flag) {
			// 작성할 권한이 없는 경우 
			ra.addFlashAttribute("noAuthority","잘못된 접근입니다");
			return "redirect:/survey/receiveSurvey";
		} else { 
			// 작성할 권한이 있는 경우 
			
			// 2. 지금 HTTP 요청 메세지를 보낸 사람이 이 설문을 작성한 적이 있는지 검증 
			Boolean check = surveyService.checkAlreadyWrite(surveyNo, loginEmp);
			if(check) {
				// 작성한 적이 있다 
				ra.addFlashAttribute("noAuthority","이미 참여한 설문입니다.");
				return "redirect:/survey/receiveSurvey";
			} else {
				// 작성한 적이 없다 
				surveyService.getSurvey(surveyNo, model);
			}
		}
		return "employee/survey/surveyDetail";
		
	}
	
	
	/** 설문 답변 저장 
	 * @param answerMap
	 * @param model
	 * @param loginEmp
	 * @return
	 */
	@PostMapping("submitAnswer")
	public String submitAnswer(@RequestParam Map<String, String> answerMap, Model model, @SessionAttribute("loginEmp") Employee2 loginEmp) {
		surveyService.submitAnswer(answerMap, loginEmp);
		return "redirect:/survey/receiveSurvey";
	}
	
	/** 내가 쓴 설문 
	 * @param loginEmp
	 * @param currentPage
	 * @param model
	 * @return
	 */
	@GetMapping("mySurvey")
	public String mySurvey(@SessionAttribute("loginEmp") Employee2 loginEmp,
			@RequestParam(value="currentPage", defaultValue="1") String currentPage ,Model model) {
		
		surveyService.mySurvey(loginEmp, currentPage, model);		
		return "employee/survey/mySurvey";
	
	}

	
	/** 설문 작성페이지 렌더링 
	 * @param request
	 * @return
	 */
	@GetMapping("surveyInsert")
	public String serveyInsert(HttpServletRequest request) {		
		return "employee/survey/surveyInsert";
	}
	
   /** 작성된 설문을 DB 에 저장 
	 * @param surveyData
	 * @param emp
	 * @return
	 */
	@PostMapping("insertSurvey")
    @ResponseBody
    public SurveyData insertSurvey(@RequestBody SurveyData surveyData,
    		@SessionAttribute("loginEmp") Employee2 emp 
    		) {	   	   
	   surveyService.insertSurvey(surveyData, emp);
       
	   // DB에 넣은 설문을 그대로 응답.
       return surveyData;
    }
	
	
   /** 로그인한 사원의 회사에 존재하는 직급들 조회 
	 * @param emp
	 * @return
	 */
   @GetMapping("positionList")
   @ResponseBody
   public List<String> positionList(@SessionAttribute("loginEmp") Employee2 emp){	   
	   List<String> positionList = surveyService.positionList(emp);
	   return positionList;
   }
   
   /** 이름으로 사원 조회 
    * @param paramMap
    * @param emp
    * @return
    */
   @PostMapping("empList")
   @ResponseBody
   public List<Employee2> empList(@RequestBody Map<String, String> paramMap, @SessionAttribute("loginEmp") Employee2 emp  ) {
	   
	   String empNickname = paramMap.get("empNickname");
	   Integer comNo = emp.getComNo();
	   List<Employee2> empList = surveyService.empList(empNickname, comNo);
	   
	   return empList;
   }
	
	
	
//   @PostMapping("survey2")
//   @ResponseBody
//    public SurveyData handleSurvey(@RequestBody SurveyData surveyData) {
//        // 여기서 surveyData를 처리합니다.
//        // 예를 들어, surveyData의 내용을 로그로 출력할 수 있습니다.
//        System.out.println("Received Survey Data: " + surveyData);
//        
//        // 처리 후 응답 반환 (여기서는 간단히 입력 데이터를 그대로 반환)
//        return surveyData;
//   }

   
   /** 설문 결과 
    * @param surveyNo
    * @param model
    * @param loginEmp
    * @return
    */
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
   
   /** 주관식 답변 가져오기 
    * @param surveySubNo
    * @param surveySubTitle
    * @param surveyMainTitle
    * @param model
    * @return
    */
   @GetMapping("showSubjectiveAnswer")
   public String showSubjectiveAnswer (@RequestParam("surveySubNo") String surveySubNo, 
		   	@RequestParam("surveySubTitle") String surveySubTitle,
		   	@RequestParam("surveyMainTitle") String surveyMainTitle,
		   	Model model) {
	   
	   List<SubjectiveAnswer> subjectiveAnswerList = surveyService.showSubjectiveAnswer(surveySubNo);

	   model.addAttribute("subjectiveAnswerList", subjectiveAnswerList);
	   model.addAttribute("surveySubTitle", surveySubTitle);
	   model.addAttribute("surveyMainTitle", surveyMainTitle);

	   return "employee/survey/subjectiveAnswer";
   }
   
   /** 설문 삭제 
    * @param loginEmp
    * @param paramMap
    * @return
    */
   @PostMapping("delete")
   @ResponseBody
   public int surveyDelete (@SessionAttribute("loginEmp") Employee2 loginEmp, 
		   					@RequestBody Map<String, Integer> paramMap
		   ) {
	   
	   Integer surveyNo = paramMap.get("surveyNo");
	   int result = surveyService.surveyDelete(loginEmp, surveyNo);
	   return result;
   }
	
   

}