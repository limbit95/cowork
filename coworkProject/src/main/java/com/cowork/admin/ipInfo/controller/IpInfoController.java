package com.cowork.admin.ipInfo.controller;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.SessionAttribute;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.cowork.admin.companyInfo.model.dto.Department;
import com.cowork.admin.companyInfo.model.dto.Team;
import com.cowork.admin.ipInfo.model.dto.IpInfo;
import com.cowork.admin.ipInfo.model.service.IpInfoService;
import com.cowork.employee.calendar.model.service.CalendarService;
import com.cowork.user.model.dto.Employee2;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Controller
@Slf4j
@RequiredArgsConstructor
@RequestMapping("ipInfo")
public class IpInfoController {
	
	private final IpInfoService service;
	private final CalendarService cs;
	
	@GetMapping("ipInfoMain")
	public String ipInfoMain(@SessionAttribute("loginEmp") Employee2 loginEmp,
			Model model) {

		// 부서 List 조회해오기
		List<Department> deptList = cs.selectDeptList(loginEmp.getComNo());
		
		List<Team> teamList = new ArrayList<>();
		if(deptList != null) {
			for(Department dept : deptList) {
				if(dept.getTeamList() != null) {
					teamList.addAll(dept.getTeamList());
				}
			}			
		}
		
		// comNo로 부서, 팀, ip 등등 다 가져와야함
		List<IpInfo> selectAllIpInfoList = service.selectAllIpInfoList(loginEmp.getComNo());
		
		model.addAttribute("deptList", deptList);
		model.addAttribute("teamList", teamList);
		model.addAttribute("selectAllIpInfoList", selectAllIpInfoList);
		
		return "/admin/ipInfo/ipInfo";
	}
	
	@ResponseBody
	@PostMapping("selectIpInfo")
	public List<IpInfo> selectIpInfo(@RequestBody String findInput,
			@SessionAttribute("loginEmp") Employee2 loginEmp) {
		
	    List<String> findInputList = Arrays.asList(findInput.split(""));

	    List<IpInfo> resultList = new ArrayList<>();

	    // 각 글자에 대해 처리할 로직을 구현합니다.
	    for (String singleChar : findInputList) {
	        IpInfo inputInfo = IpInfo.builder()
	                .fullName(singleChar)
	                .comNo(loginEmp.getComNo())
	                .build();

	        resultList = service.selectIpInfoList(inputInfo);
	    }
		
		return resultList;
	}
	
	@GetMapping("updateIpInfo")
	public String updateIpInfo(@RequestParam("empCode") int empCode,
			@RequestParam("ip") String updateIp,
			@SessionAttribute("loginEmp") Employee2 loginEmp,
			RedirectAttributes ra) {
		
		log.info("empCode=={}", empCode);
		log.info("updateIp=={}", updateIp);
		
		IpInfo updateIpInfo = IpInfo.builder()
				.empCode(empCode)
				.ip(updateIp)
				.comNo(loginEmp.getComNo())
				.build();
		
		int result = service.updateIpInfo(updateIpInfo);
		String message = "";
		
		if(result > 0) {
			message = "IP 수정 성공";
		} else if (result == -5) {
			message = "중복된 IP가 존재합니다. 수정 불가";
		} else {
			message = "IP 수정 실패";
		}
		
		ra.addFlashAttribute("message", message);
		
		return "redirect:ipInfoMain";
	}
	
	@GetMapping("deleteIpInfo")
	public String deleteIpInfo(@RequestParam("empCode") int empCode,
			RedirectAttributes ra) {
		
		int result = service.deleteIpInfo(empCode);
		
		String message = "";
		
		if(result > 0) {
			message = "IP 삭제 성공";
		} else if (result == -5) {
			message = "탈퇴하지 않은 회원 IP는 삭제할 수 없습니다.";
		} else {
			message = "IP 삭제 실패";
		}
		
		ra.addFlashAttribute("message", message);
		
		return "redirect:ipInfoMain";
	}

}
