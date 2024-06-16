package com.cowork.employee.mail.controller;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.SessionAttribute;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.cowork.common.utility.Utility;
import com.cowork.employee.mail.model.dto.Mail;
import com.cowork.employee.mail.model.dto.MailFile;
import com.cowork.employee.mail.model.mapper.MailMapper;
import com.cowork.employee.mail.model.service.MailService;
import com.cowork.user.model.dto.Employee2;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RequiredArgsConstructor
@Controller
@Slf4j
@RequestMapping("mail")
public class MailController {
	
	private final MailService service; 
	
	@Value("${mail.file.web-path}")
	private String webPath;
	
	@Value("${mail.file.folder-path}")
	private String folderPath;

	
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
		//int mailCount = service.mailCount(empCode); 
		// 안 읽은 메일 개수 
		//int noReadCount = service.noReadCount(empCode); 
		
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
		//int inMailCount = service.inMailCount(empCode); 
		// 안읽은 메일 개수 
		//int inMailNoReadCount = service.inMailNoReadCount(empCode); 
		
		Map<String, Object> map = service.inMailList(paramMap, cp); 
		
		model.addAttribute("inMail", map.get("inMailList")); 
		model.addAttribute("pagination", map.get("pagination")); 
		model.addAttribute("inMailCount", map.get("inMailCount")); 
		model.addAttribute("inMailNoReadCount", map.get("inMailNoReadCount")); 
		model.addAttribute("empCode", empCode); 
		model.addAttribute("loginEmp", loginEmp);
		
		log.info("inMailCount : " + map.get("inMailCount"));
		log.info("noReadCount : " + map.get("inMailNoReadCount"));
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
		//Integer sentMailCount = service.sentMailCount(empCode); 
		// 안읽은 메일 개수 
		//Integer sentMailNoReadCount = service.sentMailNoReadCount(empCode); 
		
		Map<String, Object> map = service.sentMailList(paramMap, cp); 
		
		model.addAttribute("sentMail", map.get("sentMailList")); 
		model.addAttribute("pagination", map.get("pagination")); 
		model.addAttribute("sentMailCount", map.get("sentMailCount")); 
		model.addAttribute("sentMailNoReadCount", map.get("sentMailNoReadCount")); 
		model.addAttribute("empCode", empCode); 
		model.addAttribute("loginEmp", loginEmp);
		
		log.info("sentMailCount : " +  map.get("sentMailCount"));
		log.info("sentMailNoReadCount : " + map.get("sentMailNoReadCount"));
		log.info("sentListCount : " + map.get("sentListCount"));
		
		return "employee/mail/sentbox";
	}
	
	/** 임시보관함
	 * @return
	 */
	@GetMapping("outbox")
	public String outbox(	@SessionAttribute("loginEmp") Employee2 loginEmp,
							@RequestParam Map<String, Object> paramMap,
							@RequestParam(value="cp", required=false, defaultValue="1") int cp,
							Model model ) {
		
		int empCode = loginEmp.getEmpCode(); 
		paramMap.put("empCode", loginEmp.getEmpCode()); 
		paramMap.put("comNo", loginEmp.getEmpNo()); 

		Map<String, Object> map = service.outMailList(paramMap, cp); 
		
		model.addAttribute("outMail", map.get("outMailList")); 
		model.addAttribute("pagination", map.get("pagination")); 
		model.addAttribute("outListCount", map.get("outListCount")); 		
		model.addAttribute("empCode", empCode); 
		model.addAttribute("loginEmp", loginEmp);
		
		log.info("outListCount : " + map.get("outListCount"));
		
		return "employee/mail/outbox";
	}
	
	/** 휴지통
	 * @return
	 */
	@GetMapping("bin")
	public String bin(	@SessionAttribute("loginEmp") Employee2 loginEmp,
						@RequestParam Map<String, Object> paramMap,
						@RequestParam(value="cp", required=false, defaultValue="1") int cp,
						Model model ) {
		
		int empCode = loginEmp.getEmpCode(); 
		paramMap.put("empCode", loginEmp.getEmpCode()); 
		paramMap.put("comNo", loginEmp.getEmpNo()); 

		Map<String, Object> map = service.binList(paramMap, cp); 
		
		model.addAttribute("bin", map.get("binList")); 
		model.addAttribute("pagination", map.get("pagination")); 
		model.addAttribute("binListCount", map.get("binListCount")); 		
		model.addAttribute("empCode", empCode); 
		model.addAttribute("loginEmp", loginEmp);
		
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
			model.addAttribute("recipientList", map.get("recipientList")); 
			model.addAttribute("refererList", map.get("refererList")); 
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
	
	
	/** 휴지통으로 보내기 
	 * @param request
	 * @return
	 */
	@ResponseBody
	@PostMapping("delete")
    public ResponseEntity<Map<String, Object>> toBin (@RequestBody Map<String, 
    														List<Integer>> request) {
        List<Integer> mailIds = request.get("mailIds");
        
        boolean success = service.toBin(mailIds);
        
        Map<String, Object> response = new HashMap<>();
        
        response.put("success", success);
        
        return ResponseEntity.ok(response);
    }
	
	
	 /** 복구하기 
	 * @param request
	 * @return
	 */
	@ResponseBody
	@PostMapping("restore")
    public ResponseEntity<?> restoreMails(@RequestBody Map<String, List<Integer>> request) {
	        List<Integer> mailIds = request.get("mailIds");
	        // (update mail_flag to 1)
	        service.restoreMails(mailIds);
	        return ResponseEntity.ok(Collections.singletonMap("success", true));
	    }

    /** 영구 삭제하기 
     * @param request
     * @return
     */
	@ResponseBody
    @PostMapping("eliminate")
    public ResponseEntity<?> eliminateMails(@RequestBody Map<String, List<Integer>> request) {
        List<Integer> mailIds = request.get("mailIds");
        
        service.eliminateMails(mailIds);
        return ResponseEntity.ok(Collections.singletonMap("success", true));
    }
	
	
	/** 답장하기 페이지로  
	 * @param mailNo
	 * @param loginEmp
	 * @param model
	 * @return
	 */
	@GetMapping("reply/{mailNo}")
	public String reply(@PathVariable("mailNo") int mailNo, 
						@SessionAttribute("loginEmp") Employee2 loginEmp,	
						Model model ) {
		
			Map<String, Object> map = service.mailDetail(mailNo); 
				
				String path;
				
				if(map.get("mail") == null) {
					path = "redirect:/mailList";
					
				} else {
					path = "employee/mail/reply";
					
					Mail mail = (Mail) map.get("mail"); 
					mail.setMailTitle("RE : " + mail.getMailTitle()); 
					mail.setMailContent("==== Original Message ====<br>" + mail.getMailContent()); 
					
					model.addAttribute("sender", map.get("sender")); 
					model.addAttribute("senderMail", map.get("senderMail")); 
					model.addAttribute("senderEmpCode", map.get("senderEmpCode")); 
					log.info("보낸 사람 : " + map.get("sender")); 
					log.info("보낸 사람 메일 : " + map.get("senderMail")); 
					log.info("보낸 사람 코드 : " + map.get("senderEmpCode")); 
					
					model.addAttribute("mail", map.get("mail")); 
					model.addAttribute("fileList", map.get("fileList"));
					model.addAttribute("recipientList", map.get("recipientList")); 
					model.addAttribute("refererList", map.get("refererList")); 
				}
				
		return path; 
	}
	
	 /** 답장 전송 
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
	 @PostMapping("reply")
	 public int reply( @SessionAttribute("loginEmp") Employee2 loginEmp, 
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
	
	int result = service.reply(inputMail, files, recipient, referer);
	
	return result; 
	
	} 
	
	
	/** 전달하기 페이지 
	 * @param mailNo
	 * @param loginEmp
	 * @param model
	 * @return
	 */
	@GetMapping("forward/{mailNo}")
	public String forward(	@PathVariable("mailNo") int mailNo, 
							@SessionAttribute("loginEmp") Employee2 loginEmp,	
							Model model ) {
		
		Map<String, Object> map = service.mailDetail(mailNo); 
		
		String path;
		
		if(map.get("mail") == null) {
			path = "redirect:/mailList";
			
		} else {
			path = "employee/mail/forward";
			
			Mail mail = (Mail) map.get("mail"); 
			mail.setMailTitle("FW : " + mail.getMailTitle()); 
			mail.setMailContent("==== Original Message ====<br>" + mail.getMailContent()); 
			
			model.addAttribute("sender", map.get("sender")); 
			model.addAttribute("senderMail", map.get("senderMail")); 
			model.addAttribute("senderEmpCode", map.get("senderEmpCode")); 
			log.info("보낸 사람 : " + map.get("sender")); 
			log.info("보낸 사람 메일 : " + map.get("senderMail")); 
			log.info("보낸 사람 코드 : " + map.get("senderEmpCode")); 
			
			model.addAttribute("mail", map.get("mail")); 
			model.addAttribute("fileList", map.get("fileList"));
			model.addAttribute("recipientList", map.get("recipientList")); 
			model.addAttribute("refererList", map.get("refererList")); 
		}
		
		return path; 
		
	}
	
	 @ResponseBody
	 @PostMapping("forward/{mailNo}")
	 public int reply( @SessionAttribute("loginEmp") Employee2 loginEmp, 
			 				@PathVariable("mailNo") int mailNo,
							@RequestParam("recipient") String recipient, 
							@RequestParam("referer") String referer, 
							@RequestParam("mailTitle") String mailTitle, 
							@RequestParam("mailContent") String mailContent, 
							@RequestParam(value="deleteOrder", required = false) String deleteOrder, /* 삭제 */
					        @RequestParam(value="updateOrder", required=false) String updateOrder, /* 기존 */
							@RequestParam(value="files", required=false) List<MultipartFile> files,
							RedirectAttributes ra) throws IllegalStateException, IOException {
	
	mailContent = mailContent.replaceAll("<div\\s+align=\"\"\\s+style=\"\">|</div><p><br></p>", "");
	
	log.info("recipient : 배열인가요 :" + recipient); 
	log.info("referer : 배열인가요 : " + referer); 
	//log.info("파일 첨부리스트.... : " + files.toString()); 
	//log.info("파일 첨부리스트.... : " + files.size());
	
	int originMailNo = mailNo; 
	
	log.info("기존 메일 번호 : originMailNo");
	
	Mail inputMail = Mail.builder()
				.mailTitle(mailTitle)
				.mailContent(mailContent)
				.empCode(loginEmp.getEmpCode())
				.build(); 
	
	int result = service.forward(inputMail, files, recipient, referer, updateOrder, deleteOrder, mailNo);
	
	return result; 
	
	} 
	

	
	
	/** 임시 보관하기 
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
	@PostMapping("toOutbox")
	public int forward(	@SessionAttribute("loginEmp") Employee2 loginEmp, 
							@RequestParam("recipient") String recipient, 
							@RequestParam("referer") String referer, 
							@RequestParam("mailTitle") String mailTitle, 
							@RequestParam("mailContent") String mailContent, 
							@RequestParam(value="files", required=false) List<MultipartFile> files,
							RedirectAttributes ra) throws IllegalStateException, IOException {
				
		mailContent = mailContent.replaceAll("<div\\s+align=\"\"\\s+style=\"\">|</div><p><br></p>", "");
		
		log.info("recipient : 배열인가요 :" + recipient); 
		log.info("referer : 배열인가요 : " + referer); 
		
		Mail inputMail = Mail.builder()
				.mailTitle(mailTitle)
				.mailContent(mailContent)
				.empCode(loginEmp.getEmpCode())
				.build(); 
		
		int result = service.saveMail(inputMail, files, recipient, referer);
		
		return result; 
		
		}
	
	
	/** 임시보관 상세 
	 * @param mailNo
	 * @param loginEmp
	 * @param model
	 * @return
	 */
	@GetMapping("outMailUpdate/{mailNo}")
	public String outMailUpdate(@PathVariable("mailNo") int mailNo, 
								@SessionAttribute("loginEmp") Employee2 loginEmp,	
								Model model ) {

		Map<String, Object> map = service.mailDetail(mailNo); 
		
		String path;
		
		if(map.get("mail") == null) {
		path = "redirect:/outbox";
		
		} else {
		path = "employee/mail/outMailUpdate";
		
		Mail mail = (Mail) map.get("mail"); 
		mail.setMailTitle( mail.getMailTitle()); 
		mail.setMailContent(mail.getMailContent()); 
		
		model.addAttribute("mail", map.get("mail")); 
		model.addAttribute("fileList", map.get("fileList"));
		model.addAttribute("recipientList", map.get("recipientList")); 
		model.addAttribute("refererList", map.get("refererList")); 
		}
		
		return path; 
		
	}
	
	
	/** 임시저장 수정하기 
	 * @param loginEmp
	 * @param mailNo
	 * @param recipient
	 * @param referer
	 * @param mailTitle
	 * @param mailContent
	 * @param deleteOrder
	 * @param updateOrder
	 * @param files
	 * @param existingFilesJson
	 * @return
	 * @throws IllegalStateException
	 * @throws IOException
	 */
	@ResponseBody
	@PostMapping("outMailUpdate/{mailNo:[0-9]+}")
	public int outMailUpdate( @SessionAttribute("loginEmp") Employee2 loginEmp,
							@PathVariable("mailNo") int mailNo,
							@RequestParam("recipient") String recipient, 
							@RequestParam("referer") String referer, 
							@RequestParam("mailTitle") String mailTitle, 
							@RequestParam("mailContent") String mailContent, 
							@RequestParam(value="deleteOrder", required = false) String deleteOrder, /* 삭제 */
					        @RequestParam(value="updateOrder", required=false) String updateOrder, /* 기존 */
							@RequestParam(value="files", required=false) List<MultipartFile> files
							) throws IllegalStateException, IOException {
		
		log.info("기존 파일 넘어오나요 : " + updateOrder); 	 
		log.info("파일 몇 개인가요 : " + files.size());
		log.info("recipient : 배열인가요 :" + recipient); 
		log.info("referer : 배열인가요 : " + referer); 
		
		Mail inputMail = new Mail(); 
		mailContent = mailContent.replaceAll("<div\\s+align=\"\"\\s+style=\"\">|</div><p><br></p>", "");
		
		inputMail.setMailNo(mailNo); 
		inputMail.setMailTitle(mailTitle); 
		inputMail.setMailContent(mailContent); 
		inputMail.setEmpCode(loginEmp.getEmpCode()); 
		
		int result = service.outUpdate(inputMail, files, recipient, referer, deleteOrder, updateOrder);
		
		return result; 
		
	}
	
	
	
	 /** 임시 보관 메일 전송하기 
	 * @param loginEmp
	 * @param mailNo
	 * @param recipient
	 * @param referer
	 * @param mailTitle
	 * @param mailContent
	 * @param deleteOrder
	 * @param updateOrder
	 * @param files
	 * @param existingFilesJson
	 * @return
	 * @throws IllegalStateException
	 * @throws IOException
	 */
	 @ResponseBody
	 @PostMapping("outSend/{mailNo:[0-9]+}")
	 public int outSend ( @SessionAttribute("loginEmp") Employee2 loginEmp,
			 				@PathVariable("mailNo") int mailNo,
							@RequestParam("recipient") String recipient, 
							@RequestParam("referer") String referer, 
							@RequestParam("mailTitle") String mailTitle, 
							@RequestParam("mailContent") String mailContent, 
							@RequestParam(value="deleteOrder", required = false) String deleteOrder, /* 삭제 */
					        @RequestParam(value="updateOrder", required=false) String updateOrder, /* 기존 */
							@RequestParam(value="files", required=false) List<MultipartFile> files
							
							) throws IllegalStateException, IOException {
	
	
	log.info("기존 파일 넘어오나요 : " + updateOrder); 	 
	log.info("파일 몇 개인가요 : " + files.size());
	log.info("recipient : 배열인가요 :" + recipient); 
	log.info("referer : 배열인가요 : " + referer); 
	
	Mail inputMail = new Mail(); 
	mailContent = mailContent.replaceAll("<div\\s+align=\"\"\\s+style=\"\">|</div><p><br></p>", "");
	
	inputMail.setMailNo(mailNo); 
	inputMail.setMailTitle(mailTitle); 
	inputMail.setMailContent(mailContent); 
	inputMail.setEmpCode(loginEmp.getEmpCode()); 
	
	
	int result = service.outSend(inputMail, files, recipient, referer, deleteOrder, updateOrder);
	
	return result; 
	
	} 
	
	
	
	
	
} 
