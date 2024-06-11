package com.cowork.admin.notice.controller;

import java.io.IOException;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.SessionAttribute;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.cowork.admin.notice.model.service.AdminNoticeService;
import com.cowork.employee.chatting.model.dto.Employee;
import com.cowork.employee.notice.model.dto.Notice;
import com.cowork.user.model.dto.Employee2;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Controller
@Slf4j
@RequiredArgsConstructor
@RequestMapping("admin/notice")
public class AdminNoticeController {
	
	private final AdminNoticeService service;

	/** 공지사항 목록
	 * @return
	 */
	@GetMapping("noticeList")
	public String noticeList(
				@SessionAttribute("loginEmp") Employee2 loginEmp,
				@RequestParam(value="cp", required=false, defaultValue="1") int cp,
				Model model,
				@RequestParam Map<String, Object> paramMap
			) {
		
		paramMap.put("comNo", loginEmp.getComNo());
		
		// 조회 서비스 호출 후 결과 반환
		Map<String, Object> map = service.noticeList(paramMap, cp);
		
		model.addAttribute("pagination", map.get("pagination"));
		model.addAttribute("noticeList", map.get("noticeList"));
		
		return "admin/notice/noticeList";
	}
	
	/** 공지사항 상세
	 * @return
	 */
	@GetMapping("noticeDetail/{noticeNo:[0-9]+}")
	public String noticeDetail(
				@PathVariable("noticeNo") int noticeNo,
				Model model,
				RedirectAttributes ra
			) {
		
		Map<String, Object> map = service.noticeDetail(noticeNo);
		
		String path = null;
		
		if(map.get("notice") == null) {
			
			path = "redirect:/noticeList";
			ra.addFlashAttribute("message", "게시글이 존재하지 않습니다");
		} else {
			
			path = "admin/notice/noticeDetail";
			
			model.addAttribute("notice", map.get("notice"));
			model.addAttribute("fileList", map.get("fileList"));
		}
		
		return path;
	}
	
	/** 공지사항 등록 화면
	 * @return
	 */
	@GetMapping("noticeInsert")
	public String noticeInsert() {
		
		return "admin/notice/noticeInsert";
	}
	
	/** 공지사항 등록
	 * @return
	 */
	@ResponseBody
	@PostMapping("noticeInsert")
	public int noticeInsert(
				@RequestParam("noticeTitle") String noticeTitle,
	            @RequestParam("noticeContent") String noticeContent,
	            @SessionAttribute("loginEmp") Employee2 loginEmp, 
				@RequestParam(value="files", required=false) List<MultipartFile> files,
				RedirectAttributes ra
			) throws IllegalStateException, IOException {
		
		Notice inputNotice = new Notice();
		
		noticeContent = noticeContent.replaceAll("<div\\s+align=\"\"\\s+style=\"\">|</div><p><br></p>", "");
		
		inputNotice.setEmpCode(loginEmp.getEmpCode());
		inputNotice.setNoticeTitle(noticeTitle);
		inputNotice.setNoticeContent(noticeContent);
		
		
		int result = service.noticeInsert(inputNotice, files);
		
		//log.error("게시글 번호 : " + result);
		
		return result;
	}
	
	/** 공지사항 삭제
	 * @return
	 */
	@GetMapping("noticeDelete")
	public String noticeDelete(
			@RequestParam("noticeNo") int noticeNo,
			RedirectAttributes ra
			) {
		
		int result = service.noticeDelete(noticeNo);
		
		String path = null;
		String message = null;
		
		if(result > 0) {
			path = "redirect:noticeList";
			message = "게시글이 삭제되었습니다.";
		} else {
			path = "redirect:noticeDetail" + noticeNo;
			message = "게시글 삭제 실패";
		}
		
		ra.addFlashAttribute("message", message);
		
		return path;
	}
	
	/** 공지사항 수정 화면
	 * @return
	 */
	@GetMapping("noticeUpdate/{noticeNo:[0-9]+}")
	public String noticeUpdate(
				@PathVariable("noticeNo") int noticeNo,
				Model model
			) {
		
		Map<String, Object> map = service.noticeDetail(noticeNo);
		
		model.addAttribute("notice", map.get("notice"));
		model.addAttribute("fileList", map.get("fileList"));
		
		return "admin/notice/noticeUpdate";
	}
	
	/** 공지사항 수정
	 * @param noticeNo
	 * @param noticeTitle
	 * @param noticeContent
	 * @param files
	 * @return
	 * @throws IOException 
	 * @throws IllegalStateException 
	 */
	@ResponseBody
	@PostMapping("noticeUpdate/{noticeNo:[0-9]+}")
	public int noticeUpdate(
				@PathVariable("noticeNo") int noticeNo,
				@RequestParam("noticeTitle") String noticeTitle,
	            @RequestParam("noticeContent") String noticeContent,
	            @SessionAttribute("loginEmp") Employee2 loginEmp, 
	            @RequestParam(value="files", required=false) List<MultipartFile> files,
	            @RequestParam(value="deleteOrder", required = false) String deleteOrder, /* 삭제 */
	            @RequestParam(value="updateOrder", required=false) String updateOrder, /* 기존 */
	            @RequestParam(value="queryString", required = false, defaultValue="") String querystring
			) throws IllegalStateException, IOException {
		
		Notice inputNotice = new Notice();
		
		noticeContent = noticeContent.replaceAll("<div\\s+align=\"\"\\s+style=\"\">|</div><p><br></p>", "");
		
		inputNotice.setNoticeNo(noticeNo);
		inputNotice.setNoticeTitle(noticeTitle);
		inputNotice.setNoticeContent(noticeContent);
		inputNotice.setEmpCode(loginEmp.getEmpCode());
		
		// 서비스 호출 후 결과 받기
		int result = service.noticeUpdate(inputNotice, files, deleteOrder, updateOrder);
		
		return result;
	}
	
}
