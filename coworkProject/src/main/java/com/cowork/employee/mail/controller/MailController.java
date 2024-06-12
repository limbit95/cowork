package com.cowork.employee.mail.controller;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.SessionAttribute;
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
	public String mainList(@SessionAttribute("loginEmp") Employee2 loginEmp,
							Model model) {
		
		int empCode = loginEmp.getEmpCode(); 
		
		List<Mail> mailList = service.mailList(empCode); 
		// 전체 메일 개수 
		int mailCount = service.mailCount(empCode); 
		// 안읽은 메일 개수 
		int noReadCount = service.noReadCount(empCode); 
		
		model.addAttribute("mail", mailList); 
		model.addAttribute("empCode", empCode); 
		model.addAttribute("mailCount", mailCount); 
		model.addAttribute("noReadCount", noReadCount); 
		model.addAttribute("loginEmp", loginEmp);
		
		log.info("mailCount" + mailCount);
		log.info("noReadCount" + noReadCount);
		
		return "employee/mail/mailList";
	}
	
	/** 받은메일함
	 * @return
	 */
	@GetMapping("inbox")
	public String inbox() {
		
		return "employee/mail/inbox";
	}
	
	/** 보낸메일함
	 * @return
	 */
	@GetMapping("sentbox")
	public String sentbox() {
		
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
} 
