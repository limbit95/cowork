package com.cowork.employee.chatting.controller;

import java.util.List;
import java.util.Map;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.SessionAttribute;

import com.cowork.employee.chatting.model.dto.ChatRoom;
import com.cowork.employee.chatting.model.dto.Employee;
import com.cowork.employee.chatting.model.dto.MakeChat;
import com.cowork.employee.chatting.model.service.ChatService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Controller
@Slf4j
@RequestMapping("chat")
@RequiredArgsConstructor
public class ChattingController {
	
	private final ChatService chatService;
	
	private final SimpMessagingTemplate messagingTemplate;

	
	@GetMapping("wowns590")
	public String chattingWowns590(HttpServletRequest request) {
		Employee emp = new Employee();
		emp.setEmpCode(1);
		emp.setEmpId("wowns590");
		emp.setEmpPw("123");
		emp.setEmpFirstName("최");
		emp.setEmpLastName("재준");
		HttpSession session = request.getSession();
		session.setAttribute("loginMember", emp);
		return "/employee/chatting/chatting";
	}
	
	@GetMapping("wowns5902")
	public String chattingWowns5902(HttpServletRequest request) {
		Employee emp = new Employee();
		emp.setEmpCode(2);
		emp.setEmpId("wowns5902");
		emp.setEmpPw("123");
		emp.setEmpFirstName("송");
		emp.setEmpLastName("지윤");		
		HttpSession session = request.getSession();
		session.setAttribute("loginMember", emp);
		return "/employee/chatting/chatting";
	}	
	
	
	/* 이름, 부서, 팀 조회으로 사원조회 */
    @PostMapping("empList")
    @ResponseBody
    public List<Employee> empList(@SessionAttribute("loginMember") Employee loginMember,
    									@RequestBody Map<String, String> paramMap) {
    	String inputData = paramMap.get("inputData");
    	// db 에서 조회해오자. 
    	List<Employee> empList = chatService.empList(inputData, loginMember.getEmpCode());
    	return empList;    	
    }
    
    // 채팅방을 만드는 것 
    @PostMapping("makeChat")
    @ResponseBody
    public String makeChat(@RequestBody MakeChat makeChat, Model model) {
    	
    	List<String> empCodeList = makeChat.getEmpCodeList(); // 채팅방 구성원 
    	String empCode = makeChat.getMakeEmpCode(); // 채팅방 만드는 놈
    	
        String subscribeAddr = chatService.makeChat(empCodeList, empCode);
        
        // 초대된 사용자들에게 실시간으로 새로운 채팅방 정보를 전달
        // 만약 각 사용자가 이 실시간 전송을 들을 수 있는 귀가 있다면 되지 않을까?
        // 그럼 그 실시간전송을 듣는 귀의 subscribe addr 은 뭐가 되어야 할까?
        // 대충 생각해보면, /topic/ + 자신의 memberNo 인 subscribeaddr 을 가진 귀(connect) 가 있으면 되지 않을까?
        
        empCodeList.forEach(memberNo2 -> {
            messagingTemplate.convertAndSend("/topic/newRoom/" + memberNo2, subscribeAddr);
        });
    	
    	return subscribeAddr;
    }
	
    @PostMapping("getChattingRooms")
    @ResponseBody
    public List<ChatRoom> getChattingRooms(@RequestBody Map<String, String> paramMap) {
    	String empCode = paramMap.get("empCode");    	
    	// 데이터베이스에서 뭘 가져와야 해? 
    	// 이 멤버와 관련된 모든 채팅방들의 모음을 가져와서 List 자료구조에 담은 다음에 return 해줘야 함. 
    	List<ChatRoom> roomList = chatService.getChattingRooms(empCode);
    	for(ChatRoom room: roomList) {
    		
    		log.debug("room======={}", room);
    	
    	}
    	return roomList;    	
    }
    
    
	
}
