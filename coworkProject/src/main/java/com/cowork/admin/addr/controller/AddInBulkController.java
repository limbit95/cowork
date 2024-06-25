package com.cowork.admin.addr.controller;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.SessionAttributes;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.cowork.admin.addr.model.service.AddInBulkService;
import com.cowork.admin.addr.model.service.AdminAddrService;
import com.cowork.email.model.service.EmailService;
import com.cowork.employee.addr.model.service.AddrService;
import com.cowork.user.model.dto.Employee2;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Controller
@RequiredArgsConstructor
@RequestMapping("admin/addInBulk")
@SessionAttributes({"empList"})
public class AddInBulkController {
	
	private final AddInBulkService service;
	
	private final EmailService emailService;
	
	/** 구성원 일괄 추가 페이지 이동
	 * @param model
	 * @return
	 */
	@GetMapping("")
	public String userList(HttpServletRequest request,
						   Model model) {
		
		HttpSession session = request.getSession();
		Employee2 loginEmp = (Employee2)session.getAttribute("loginEmp");
		
		List<String> employeeList = service.getEmpIdList(loginEmp.getComNo());
		model.addAttribute("empList", employeeList);
		
		return "admin/addr/addEmployeeInBulk";
	}
	
	/** 구성원 일괄 추가 서비스
	 * @param excel
	 * @return
	 * @throws Exception
	 */
	@ResponseBody
	@PostMapping("excelUpload")
	public List<Map<String, Object>> excel(@RequestParam("excel") MultipartFile excel) throws Exception {
		
		log.info("excel : " + excel);

		// 엑셀 파일의 사원 정보를 읽어 리스트 자료 구조에 담는 코드
		List<Map<String, Object>> excelList = service.readExcel(excel);
		
		log.info("excelList : " + excelList);
		
		return excelList;
	}
	
	/** 일괄 추가하려는 구성원 정보 DB에 저장(계정 생성)
	 * @param data
	 * @return
	 */
	@ResponseBody
	@PostMapping("regist")
	public int regist(@RequestBody List<Map<String, Object>> data) {
		
		log.info("구성원 정보 리스트 : " + data);
		
		return service.regist(data);
	}
	
	/** 구성원 일괄 등록 이후 등록한 계정을 사용할 구성원들에게 계정 정보 메일로 전송
	 * @param data
	 * @return
	 */
	@ResponseBody
	@PostMapping("sendMail")
	public int sendMail(@RequestBody List<Map<String, Object>> data) {
		
		log.info("메일로 보낼 구성원 정보 : " + data);
		
		int result = 0;
		
		for(int i = 0; i < data.size(); i++) {
			result = emailService.sendMailAfterAddInBulk(data.get(i));
		}
		
		return result;
	}
	

}