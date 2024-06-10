package com.cowork.employee.mail.controller;

import java.util.List;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.SessionAttribute;

import com.cowork.employee.mail.model.dto.Mail;
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
		
		model.addAttribute("mail", mailList); 
		model.addAttribute("empCode", empCode); 
		
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
	@GetMapping("mailDetail")
	public String mailDetail() {
		
		return "employee/mail/mailDetail";
	}
}
