package com.cowork.employee.mail.controller;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.SessionAttribute;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.cowork.employee.mail.model.dto.Mail;
import com.cowork.employee.mail.model.dto.MailFile;
import com.cowork.employee.mail.model.service.MailService;
import com.cowork.user.model.dto.Employee2;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RequiredArgsConstructor
@Controller
@Slf4j
@RequestMapping("mail")
public class MailController {
	
	private final MailService service; 

	

	/** 전체 메일
	 * @return
	 */
	@GetMapping("mailList")
	public String mainList(	@SessionAttribute("loginEmp") Employee2 loginEmp,
						   	@RequestParam Map<String, Object> paramMap,
						   	@RequestParam(value="cp", required=false, defaultValue="1") int cp,
						   	Model model ) {
		
		int empCode = loginEmp.getEmpCode(); 
		paramMap.put("empCode", loginEmp.getEmpCode()); 
		paramMap.put("comNo", loginEmp.getEmpNo()); 
		
		// 전체 메일 개수 
		int mailCount = service.mailCount(empCode); 
		// 안 읽은 메일 개수 
		int noReadCount = service.noReadCount(empCode); 
		
		Map<String, Object> map = service.mailList(paramMap, cp); 
		
		model.addAttribute("mail", map.get("mailList")); 
		model.addAttribute("pagination", map.get("pagination")); 
		model.addAttribute("mailCount", map.get("mailCount")); 
		model.addAttribute("noReadCount", map.get("noReadCount")); 
		model.addAttribute("empCode", empCode); 
		model.addAttribute("loginEmp", loginEmp);
		
		log.info("mailCount : " + map.get("mailCount"));
		log.info("noReadCount : " + map.get("noReadCount"));
		log.info("listCount : " + map.get("listCount"));
		log.info("loginEmpCode : " + loginEmp.getEmpCode());
		
		return "employee/mail/mailList";
	}
	
	/** 받은메일함
	 * @return
	 */
	@GetMapping("inbox")
	public String inbox(	@SessionAttribute("loginEmp") Employee2 loginEmp,
		   					@RequestParam Map<String, Object> paramMap,
	   						@RequestParam(value="cp", required=false, defaultValue="1") int cp,
	   						Model model ) {
		
		int empCode = loginEmp.getEmpCode(); 
		paramMap.put("empCode", loginEmp.getEmpCode()); 
		paramMap.put("comNo", loginEmp.getEmpNo()); 
		
		// 전체 메일 개수 
		int inMailCount = service.inMailCount(empCode); 
		// 안읽은 메일 개수 
		int inMailNoReadCount = service.inMailNoReadCount(empCode); 
		
		Map<String, Object> map = service.inMailList(paramMap, cp); 
		
		model.addAttribute("inMail", map.get("inMailList")); 
		model.addAttribute("pagination", map.get("pagination")); 
		model.addAttribute("inMailCount", map.get("inMailCount")); 
		model.addAttribute("inMailNoReadCount", map.get("inMailNoReadCount")); 
		model.addAttribute("empCode", empCode); 
		model.addAttribute("loginEmp", loginEmp);
		
		log.info("inMailCount : " + inMailCount);
		log.info("noReadCount : " + inMailNoReadCount);
		log.info("listCount : " + map.get("inListCount"));
		
		return "employee/mail/inbox";
	}
	
	/** 보낸메일함
	 * @return
	 */
	@GetMapping("sentbox")
	public String sentbox(	@SessionAttribute("loginEmp") Employee2 loginEmp,
							@RequestParam Map<String, Object> paramMap,
							@RequestParam(value="cp", required=false, defaultValue="1") int cp,
							Model model ) {
		
		int empCode = loginEmp.getEmpCode(); 
		paramMap.put("empCode", loginEmp.getEmpCode()); 
		paramMap.put("comNo", loginEmp.getEmpNo()); 
		
		// 전체 메일 개수 
		int sentMailCount = service.sentMailCount(empCode); 
		// 안읽은 메일 개수 
		int sentMailNoReadCount = service.sentMailNoReadCount(empCode); 
		
		Map<String, Object> map = service.sentMailList(paramMap, cp); 
		
		model.addAttribute("sentMail", map.get("sentMailList")); 
		model.addAttribute("pagination", map.get("pagination")); 
		model.addAttribute("sentMailCount", map.get("sentMailCount")); 
		model.addAttribute("sentMailNoReadCount", map.get("sentMailNoReadCount")); 
		model.addAttribute("empCode", empCode); 
		model.addAttribute("loginEmp", loginEmp);
		
		log.info("sentMailCount : " + sentMailCount);
		log.info("sentMailNoReadCount : " + sentMailNoReadCount);
		log.info("sentListCount : " + map.get("sentListCount"));
		
		return "employee/mail/sentbox";
	}
	
	/** 임시보관함
	 * @return
	 */
	@GetMapping("outbox")
	public String outbox() {
		
		return "employee/mail/outbox";
	}
	
	/** 휴지통
	 * @return
	 */
	@GetMapping("bin")
	public String bin() {
		
		return "employee/mail/bin";
	}
	
	/** 메일작성
	 * @return
	 */
	@GetMapping("mailInsert")
	public String mailInsert() {
		
		return "employee/mail/mailInsert";
	}
	
	/** 메일 보내기 
	 * @param loginEmp
	 * @param recipient
	 * @param referer
	 * @param mailTitle
	 * @param mailContent
	 * @param files
	 * @param ra
	 * @return
	 * @throws IllegalStateException
	 * @throws IOException
	 */
	@ResponseBody
	@PostMapping("mailInsert")
	public int sendMail( @SessionAttribute("loginEmp") Employee2 loginEmp, 
							@RequestParam("recipient") String recipient, 
							@RequestParam("referer") String referer, 
							@RequestParam("mailTitle") String mailTitle, 
							@RequestParam("mailContent") String mailContent, 
							@RequestParam(value="files", required=false) List<MultipartFile> files,
							RedirectAttributes ra) throws IllegalStateException, IOException {
		
		mailContent = mailContent.replaceAll("<div\\s+align=\"\"\\s+style=\"\">|</div><p><br></p>", "");
		
		log.info("recipient : 배열인가요 :" + recipient); 
		log.info("referer : 배열인가요 : " + referer); 
		//log.info("파일 첨부리스트.... : " + files.toString()); 
		//log.info("파일 첨부리스트.... : " + files.size()); 
		
		Mail inputMail = Mail.builder()
						.mailTitle(mailTitle)
						.mailContent(mailContent)
						.empCode(loginEmp.getEmpCode())
						.build(); 

		int result = service.sendMail(inputMail, files, recipient, referer);
		
		return result; 
	
	}
	
	
	/** 메일상세
	 * @return
	 */
	@GetMapping("mailDetail/{mailNo:[0-9]+}")
	public String mailDetail(	@PathVariable("mailNo") int mailNo,
								@SessionAttribute("loginEmp") Employee2 loginEmp,
								Mail mail,
								Model model, 
								RedirectAttributes ra) {
		
		log.info("mailNo는? : " + mailNo);
		
		Map<String, Object> map = service.mailDetail(mailNo); 
		
		String path; 
		String message; 
		
		if(map.get("mail") == null) {
			path = "redirect:/mailList";
			ra.addFlashAttribute("message", "해당 메일 조회 실패했습니다.");
		} else {
			path = "employee/mail/mailDetail";
			
			model.addAttribute("mail", map.get("mail")); 
			model.addAttribute("fileList", map.get("fileList"));
		}
		
		return path;
	}
	
	
	/** 사원 검색 - 받는이, 참조 
	 * @param empName
	 * @param loginEmp
	 * @param model
	 * @return
	 */
	@ResponseBody
	@GetMapping("/mailInsert/empSearch")
	public List<Employee2> empSearch( @RequestParam("empName") String empName,
									   @SessionAttribute("loginEmp") Employee2 loginEmp,
									   Model model ) {
		
		return service.mailEmpSearch(empName, loginEmp.getComNo()); 
		
	}
	
	
	
	
	
	
	
	
	
} 
