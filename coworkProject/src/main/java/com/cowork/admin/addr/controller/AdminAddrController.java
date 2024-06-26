package com.cowork.admin.addr.controller;

import java.util.Arrays;
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
import org.springframework.web.bind.annotation.SessionAttribute;
import org.springframework.web.bind.annotation.SessionAttributes;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.cowork.admin.addr.model.service.AdminAddrService;
import com.cowork.admin.companyInfo.model.dto.Department;
import com.cowork.admin.companyInfo.model.dto.Team;
import com.cowork.common.utility.NumberRename;
import com.cowork.email.model.service.EmailService;
import com.cowork.employee.addr.model.dto.MyAddr;
import com.cowork.employee.addr.model.service.AddrService;
import com.cowork.user.model.dto.Employee2;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Controller
@RequiredArgsConstructor
@RequestMapping("admin/addr")
@SessionAttributes({"empDetail", "backPageLocation", "comAddrList", "loginEmp", "positionList"})
public class AdminAddrController {
	
	private final AdminAddrService service;
	
	private final AddrService addrService;
	
	private final EmailService emailService;
	
	/** 회사 주소록 부서, 팀 조회
	 * @param request
	 * @param model
	 * @param map
	 * @param cp
	 * @return
	 */
	@GetMapping("")
	public String adminAddrMain(HttpServletRequest request, 
							    Model model,
							    @RequestParam(value="cp", required=false, defaultValue="1") int cp) {
		
		HttpSession session = request.getSession();
		Employee2 loginEmp = (Employee2)session.getAttribute("loginEmp");
		model.addAttribute("loginEmp", loginEmp);
		
		List<Department> comAddrList = service.selectComAddrList(loginEmp);
		model.addAttribute("comAddrList", comAddrList);
		
		Map<String, Object> map = service.selectComList(loginEmp, cp);
		model.addAttribute("pagination", map.get("pagination"));
		model.addAttribute("comList", map.get("comList"));
		
		List<Map<String, Object>> positionList = service.getpositionList(loginEmp);
		model.addAttribute("positionList", positionList);
		
		model.addAttribute("backPageLocation", "/admin/addr");
		
		return "admin/addr/addrBookManager";
	}
	
	/** 회사별 사원 리스트 조회
	 * @param request
	 * @param model
	 * @param map
	 * @param cp
	 * @return
	 */
//	@GetMapping("comList")
//	public String comList(HttpServletRequest request, 
//					      Model model, 
//					      @RequestParam(value="cp", required=false, defaultValue="1") int cp
//					      ) {
//		
//		HttpSession session = request.getSession();
//		Employee2 loginEmp = (Employee2)session.getAttribute("loginEmp");
//		
//		Map<String, Object> map = service.selectComList(loginEmp, cp);
//		
//		model.addAttribute("pagination", map.get("pagination"));
//		model.addAttribute("comList", map.get("comList"));
//		
//		return "admin/addr/addrBookManager";
//	}
	
	/** 부서별 사원 리스트 조회
	 * @param request
	 * @param model
	 * @param cp
	 * @return
	 */
	@GetMapping("deptList")
	public String deptList(HttpServletRequest request, 
					       Model model, 
					       @RequestParam Map<String, Object> data, 
					       @RequestParam(value="cp", required=false, defaultValue="1") int cp
					       ) {
		HttpSession session = request.getSession();
		Employee2 loginEmp = (Employee2)session.getAttribute("loginEmp");
		data.put("comNo", loginEmp.getComNo());
		
		List<Department> comAddrList = service.selectComAddrList(loginEmp);
		model.addAttribute("comAddrList", comAddrList);
		
		Map<String, Object> selectDeptList = service.selectDeptList(data, cp);
		
		model.addAttribute("pagination", selectDeptList.get("pagination"));
		model.addAttribute("deptList", selectDeptList.get("deptList"));
		model.addAttribute("deptNo", data.get("deptNo"));
		
		return "admin/addr/addrBookManager";
	}
	
	/** 팀별 사원 리스트 조회
	 * @param request
	 * @param model
	 * @param data
	 * @param cp
	 * @return
	 */
	@GetMapping("teamList")
	public String teamList(HttpServletRequest request, 
					       Model model, 
					       @RequestParam Map<String, Object> data, 
					       @RequestParam(value="cp", required=false, defaultValue="1") int cp
					       ) {
		HttpSession session = request.getSession();
		Employee2 loginEmp = (Employee2)session.getAttribute("loginEmp");
		data.put("comNo", loginEmp.getComNo());
		
		String[] arr = ((String)data.get("teamNo")).split("/");
		data.put("deptNo", arr[0]);
		data.put("teamNo", arr[1]);
		
		List<Department> comAddrList = service.selectComAddrList(loginEmp);
		model.addAttribute("comAddrList", comAddrList);
		
		Map<String, Object> selectTeamList = service.selectTeamList(data, cp);
		
		model.addAttribute("pagination", selectTeamList.get("pagination"));
		model.addAttribute("teamList", selectTeamList.get("teamList"));
		model.addAttribute("teamNo", data.get("deptNo") + "/" + data.get("teamNo"));
		
		return "admin/addr/addrBookManager";
	}
	
	
	
	/** 주소록에 등록된 사원 정보 상세 조회
	 * @return
	 */
	@ResponseBody
	@PostMapping("employeeDetail")
	public Employee2 employeeDetail(@RequestBody Map<String, Object> map, 
									HttpServletRequest request,
									Model model) {
		
		HttpSession session = request.getSession();
		Employee2 loginEmp = (Employee2)session.getAttribute("loginEmp");
		
		List<Department> comAddrList = service.selectComAddrList(loginEmp);
		model.addAttribute("comAddrList", comAddrList);
		
		map.put("comNo", loginEmp.getComNo());
		
		Employee2 empDetail = addrService.empDetail(map);
		model.addAttribute("empDetail", empDetail);
		
		model.addAttribute("empDetail", empDetail);
		model.addAttribute("backPageLocation", map.get("backPageLocation"));
		
		return empDetail;
	}
	
	/** 사원 정보 상세 조회 페이지로 이동
	 * @return
	 */
	@GetMapping("employeeDetailPage")
	public String employeeDetail(HttpServletRequest request,
								 Model model,
								 @SessionAttribute("loginEmp") Employee2 loginEmp) {
		
		HttpSession session = request.getSession();
		Employee2 empDetail = (Employee2)session.getAttribute("empDetail");
		
		String phone = NumberRename.Phonerename(empDetail.getPhone());
		empDetail.setPhone(phone);
		String empTel = NumberRename.empTelRaname(empDetail.getEmpTel());
		empDetail.setEmpTel(empTel);
		String empBirth = NumberRename.empTelRaname(empDetail.getEmpBirth());
		empDetail.setEmpBirth(empBirth);
		String hireDate = NumberRename.empTelRaname(empDetail.getHireDate());
		empDetail.setHireDate(hireDate);
		
		model.addAttribute("empDetail", empDetail);
		
		List<Department> comAddrList = service.selectComAddrList(loginEmp);
		model.addAttribute("comAddrList", comAddrList);
		
		return "admin/addr/employeeDetail";
	}
	
	/** 사원 정보 수정 페이지에서 부서 select 태그 서 선택한 부서 기준 하위 팀 리스트만 조회
	 * @param map
	 * @return
	 */
	@ResponseBody
	@PostMapping("getTeamList")
	public List<Team> getTeamList(@RequestBody Map<String, Object> map){
		log.info("map : " + map);
		return service.getTeamList(map);
	}
	
	/** 회사 주소록 그룹 CRUD
	 * @param data
	 * @return
	 */
	@ResponseBody
	@PostMapping("insertGroupList")
	public int insertGroupList(@RequestBody List<List<Map<String, Object>>> data,
							   HttpServletRequest request) {
		
		HttpSession session = request.getSession();
		Employee2 loginEmp = (Employee2)session.getAttribute("loginEmp");
		
		return service.insertGroupList(data, loginEmp);
	}
	
	/** 구성원이 초대 메일 보내는 페이지 팝업창
	 * @return
	 */
	@GetMapping("inviteEmployee")
	public String registYourself() {
		return "admin/addr/inviteEmployee";
	}
	
	/** 구성원 초대 이메일 발송
	 * @param emailList
	 * @return
	 */
	@ResponseBody
	@PostMapping("registYourself")
	public int registYourself(@RequestBody String[] emailList,
							  HttpServletRequest request) {
		
		HttpSession session = request.getSession();
		Employee2 loginEmp = (Employee2)session.getAttribute("loginEmp");
		
		String result = emailService.registYourself(emailList, loginEmp);
		
		if(result == null ) {
			return 0;
		}
		
		return 1;
	}
	
	/** 초대 링크 인증키 삭제
	 * @param request
	 * @return
	 */
	@ResponseBody
	@GetMapping("updateInviteAuthKey")
	public int updateInviteAuthKey(HttpServletRequest request) {
		
		HttpSession session = request.getSession();
		Employee2 loginEmp = (Employee2)session.getAttribute("loginEmp");
		
		return service.updateInviteAuthKey(loginEmp.getEmpCode());
	}
	
	/** 초대 링크 삭제 버튼을 누르면 TB_AUTH_KEY 테이블에 있는 인증키가 변경되는데
	 * 변경되기 전의 인증키는 로그인한 회원의 DB의 EMPLOYEE 테이블의 INVITE_AUTH_KEY에 있다
	 * 둘이 상이한지 확인하고 다르면 초대 링크 생성 버튼을 보여주고, 같으면 이메일 입력창을 보여준다. 
	 * @param request
	 * @return
	 */
	@ResponseBody
	@GetMapping("checkInviteAuthKey")
	public int checkInviteAuthKey(HttpServletRequest request) {
		
		HttpSession session = request.getSession();
		Employee2 loginEmp = (Employee2)session.getAttribute("loginEmp");
		
		return service.checkInviteAuthKey(loginEmp);
	}
	
	/** 업데이트 된 초대 링크 인증키를 EMPLOYEE 테이블의 INVITE_AUTHKEY 컬럼에 업데이트 
	 * @param request
	 * @return
	 */
	@ResponseBody
	@GetMapping("updateEmpInviteAuthKey")
	public int createInviteAuthKey(HttpServletRequest request,
								   Model model) {
		
		HttpSession session = request.getSession();
		Employee2 loginEmp = (Employee2)session.getAttribute("loginEmp");
		
		Employee2 updateEmp = service.updateEmpInviteAuthKey(loginEmp);
		
		if(updateEmp == null) {
			return 0;
		}
		
		model.addAttribute("loginEmp", updateEmp);
		
		return 1;
	}
	
	/** 사원 찾기 (이름으로)
	 * @param request
	 * @param name
	 * @return
	 */
	@ResponseBody
	@GetMapping("findEmp")
	public List<Employee2> findEmp(HttpServletRequest request,
							 @RequestParam("name") String name) {

		HttpSession session = request.getSession();
		Employee2 loginEmp = (Employee2)session.getAttribute("loginEmp");
		
		return service.findEmp(name, loginEmp);
	}
	
	/** 사원 조직 이동
	 * @param data
	 * @return
	 */
	@ResponseBody
	@PostMapping("groupChange")
	public int groupChange(@RequestBody List<Map<String, Object>> data) {
		return service.groupChange(data);
	}
	
	/** 구성원 정보 수정 페이지 이동
	 * @return
	 */
	@GetMapping("employeeUpdate")
	public String employeeUpdate(HttpServletRequest request,
								 @SessionAttribute("loginEmp") Employee2 loginEmp,
								 Model model) {
		
		HttpSession session = request.getSession();
		Employee2 empDetail = (Employee2)session.getAttribute("empDetail");
		
		empDetail.setPhone(empDetail.getPhone().replace("-", ""));
		
		if(empDetail.getEmpBirth() != null) {
			empDetail.setEmpBirth(empDetail.getEmpBirth().replace("-", ""));
		}
		if(empDetail.getHireDate() != null) {
			empDetail.setHireDate(empDetail.getHireDate().replace("-", ""));
		}
		if(empDetail.getEmpTel() != null) {
			empDetail.setEmpTel(empDetail.getEmpTel().replace("-", ""));
		}
		
		List<Department> comAddrList = service.selectComAddrList(loginEmp);
		model.addAttribute("comAddrList", comAddrList);

		return "admin/addr/employeeUpdate";
	}
	
	/** 구성원 정보 수정 서비스
	 * @param data
	 * @return
	 */
	@ResponseBody
	@PostMapping("employeeUpdate")
	public int employeeUpdate(@RequestBody Map<String, Object> data,
							  Model model) {
		
		log.info("data : " + data);
		
		if(data.get("phone") != null) {
			String phone = ((String)data.get("phone")).replace("-", "");
			data.put("phone", phone);
		}
		if(data.get("empTel") != null) {
			String empTel = ((String)data.get("empTel")).replace("-", "");
			data.put("empTel", empTel);
		}
		
		int result = service.employeeUpdate(data);
		
		if(result == 0) {
			return 0;
		}
		
		Employee2 empDetail = addrService.empDetail(data);
		model.addAttribute("empDetail", empDetail);
		
		return result;
	}
	
	/** 부서에 사원이 한 명이라도 존재하는지 확인
	 * @param data
	 * @return
	 */
	@ResponseBody
	@PostMapping("empInDeptIsEmpty")
	public int deptIsEmpty(@RequestBody Map<String, Object> data) {
		return service.empInDeptIsEmpty(data);
	}
	
	/** 팀에 사원이 한 명이라도 존재하는지 확인
	 * @param data
	 * @return
	 */
	@ResponseBody
	@PostMapping("empInTeamIsEmpty")
	public int empInTeamIsEmpty(@RequestBody Map<String, Object> data) {
		return service.empInTeamIsEmpty(data);
	}
	
	/** 선택한 구성원 삭제
	 * @param data
	 * @return
	 */
	@ResponseBody
	@PostMapping("deleteEmployee")
	public int deleteEmployee(@RequestBody List<Map<String, Object>> data) {
		return service.deleteEmployee(data);
	}
	
	/** 구성원 복구
	 * @param data
	 * @return
	 */
	@ResponseBody
	@PostMapping("restore")
	public int restore(@RequestBody Map<String, Object> data) {
		return service.restore(data);
	}
	
	/** 구성원 영구 삭제
	 * @param data
	 * @return
	 */
	@ResponseBody
	@PostMapping("permanentDeletion")
	public int permanentDeletion(@RequestBody Map<String, Object> data) {
		return service.permanentDeletion(data);
	}

}