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
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.cowork.admin.addr.model.service.AddInBulkService;
import com.cowork.admin.addr.model.service.AdminAddrService;
import com.cowork.email.model.service.EmailService;
import com.cowork.employee.addr.model.service.AddrService;
import com.cowork.user.model.dto.Employee2;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Controller
@RequiredArgsConstructor
@RequestMapping("admin/addInBulk")
public class AddInBulkController {
	
	private final AddInBulkService service;
	
	@GetMapping("")
	public String userList(Model model) {
		
//		List<Employee2> employeeList = service.selectEmployeeList();
//		
//		if(employeeList.isEmpty()) {
//			model.addAttribute("employeeList", employeeList);
//		}
//		
//		model.addAttribute("employeeList", employeeList);
		
		return "admin/addr/addEmployeeInBulk";
	}

	@GetMapping("excel")
	public String excel() {
		
		return "excel/test";
	}
	
	@PostMapping("excel/upload")
	public String excel(@RequestParam("excel") MultipartFile excel,
						Model model,
						RedirectAttributes ra) throws Exception {

		// 엑셀 파일의 사원 정보를 읽어 리스트 자료 구조에 담는 코드
		List<Map<String, String>> excelList = service.readExcel(excel);
		
		String message = null;
		
		if(excelList.isEmpty()) {
			message = "업로드 실패";
		}
		
		ra.addFlashAttribute("excelList", excelList);
		ra.addFlashAttribute("message", message);
		
		return "redirect:/user/excel";
	}
	
	@ResponseBody
	@PostMapping("excel/regist")
	public int inviteEmployee(RedirectAttributes ra,
						      @RequestBody List<Employee2> inputEmployeeList) {
		
		return service.registEmployee(inputEmployeeList);
	}

}