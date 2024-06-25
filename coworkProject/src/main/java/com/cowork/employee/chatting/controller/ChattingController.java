package com.cowork.employee.chatting.controller;

import java.io.IOException;
import java.util.List;
import java.util.Map;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.SessionAttribute;
import org.springframework.web.bind.annotation.SessionAttributes;
import org.springframework.web.multipart.MultipartFile;

import com.cowork.admin.companyInfo.model.dto.Department;
import com.cowork.employee.chatting.model.dto.ChatMessage;
import com.cowork.employee.chatting.model.dto.ChatMessage.MessageType;
import com.cowork.employee.chatting.model.dto.ChatMessageMe;
import com.cowork.employee.chatting.model.dto.ChatRoom;
import com.cowork.employee.chatting.model.dto.Employee;
import com.cowork.employee.chatting.model.dto.MakeChat;
import com.cowork.employee.chatting.model.service.ChatService;
import com.cowork.employee.chatting.model.service.GPTService;
import com.cowork.user.model.dto.Employee2;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Controller
@Slf4j
@RequiredArgsConstructor
public class ChattingController {
	
	private final ChatService chatService;
	private final SimpMessagingTemplate  messagingTemplate;
	private final GPTService gptService;
	
	
	@GetMapping("chat")
	public String chattingWowns590(HttpServletRequest request) {
//		Employee emp = new Employee();
//		emp.setEmpCode(55);
//		emp.setEmpId("limbit5");
//		emp.setEmpFirstName("임");
//		emp.setEmpLastName("성혁");
//		emp.setComNo(10);		
//		HttpSession session = request.getSession();
//		session.setAttribute("loginEmp", emp);
		return "employee/chatting/chatting";
	}
	
	@GetMapping("chat/wowns5902")
	public String chattingWowns5902(HttpServletRequest request) {
		Employee emp = new Employee();
		emp.setEmpCode(2);
		emp.setEmpId("wowns5902");
		emp.setEmpPw("123");
		emp.setEmpFirstName("송");
		emp.setEmpLastName("지윤");		
		HttpSession session = request.getSession();
		session.setAttribute("loginEmp", emp);
		return "employee/chatting/chatting";
	}	
	
	
	/* 이름, 부서, 팀 조회으로 사원조회 */
    @PostMapping("chat/empList")
    @ResponseBody
    public List<Employee2> empList(@SessionAttribute("loginEmp") Employee2 loginEmp,
    									@RequestBody Map<String, String> paramMap) {
    	
    	
    	String inputData = paramMap.get("inputData");
    	// db 에서 조회해오자. 
    	List<Employee2> empList = chatService.empList(inputData, loginEmp);
    	return empList;    	
    }
    
    // 채팅방을 만드는 것 
    @PostMapping("chat/makeChat")
    @ResponseBody
    public String makeChat(@RequestBody MakeChat makeChat, Model model) {
    	
    	
    	
    	List<String> empCodeList = makeChat.getEmpCodeList(); // 채팅방 구성원 
    	String empCode = makeChat.getMakeEmpCode(); // 채팅방 만드는 놈
    	
    	log.debug("empCodeList", empCodeList);
    	log.debug("empCode", empCode);
    	
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
	
    @PostMapping("chat/getChattingRooms")
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
    
    @PostMapping("chat/getChatMessage")
    @ResponseBody
    public List<ChatMessageMe> getChatMessage(@RequestBody Map<String, String> paramMap) {
    	List<ChatMessageMe> messageList = chatService.getChatMessage(paramMap);
    	for(ChatMessageMe m : messageList) {
    		log.debug("asd={}",m);
    	}
    	
    	return messageList;
    	
    }
    
    // 채팅을 받는 메서드 
    @MessageMapping("/chat.sendMessage")
    @ResponseBody
    public void sendMessage(@Payload ChatMessage chatMessage) {
    	    	
    	log.debug("컨트롤러까지는 무사히 도착!");
    	log.debug("chatMessage=={}", chatMessage);
    	log.debug("chatMessage.getSubscribeAddr()=={}", chatMessage.getSubscribeAddr());
    	log.debug("targetLanguage=={}", chatMessage.getTargetLanguage()); // English
    	log.debug("wantTranslateFlag=={}", chatMessage.getWantTranslateFlag()); // true
    	
    	String senderEmpCode= chatMessage.getSenderEmpCode();
    	String empNickname = chatMessage.getEmpNickname();
    	String content = chatMessage.getContent();
    	MessageType type = chatMessage.getType();
    	String subscribeAddr = chatMessage.getSubscribeAddr();
    	String roomNo = chatMessage.getRoomNo();
    	String targetLanguage = chatMessage.getTargetLanguage();
    	
    	// 현재 해줘야 할건, CHAT_MESSAGE 테이블에 행을 삽입하는 것.
    	if(chatMessage.getType() == ChatMessage.MessageType.CHAT) {
    		
    		if(chatMessage.getWantTranslateFlag() == true) {
    			// gpt 에게 번역해달라고 해서, 그 번역된 걸 가져와야 함. 
    			
    			String translatedContent = gptService.translate(content, targetLanguage);
    			//  content 가 "반가워" 였으면, 현재 translatedContent 라는 변수에는 "nice to meet you" 가 들어있음. 
    			String newContent = content + "^^^" + translatedContent;
    			chatMessage.setContent(newContent);
    		}
    		
    		
    		Employee2 findEmp = chatService.insertTextMessage(chatMessage);
        	if(findEmp != null) {
        		chatMessage.setProfileImg(findEmp.getProfileImg());
        		chatMessage.setEmpLastName(findEmp.getEmpLastName());
        		chatMessage.setEmpFirstName(findEmp.getEmpFirstName());
        	}
    	}
    	
    	chatMessage.setFile(null);    	
    	
    	// 동적으로 응답해줄 클라이언트의 구독주소가 변경되므로 아래와 같이 한다 
    	String destination = "/topic/" + chatMessage.getSubscribeAddr();    	
    	messagingTemplate.convertAndSend(destination, chatMessage);
    }
    
    @PostMapping("chat/upload")
    @ResponseBody
    public void handleFileUpload(@RequestParam("senderEmpCode") String senderEmpCode,
            @RequestParam("empNickname") String empNickname,
            @RequestParam("file") MultipartFile file,
            @RequestParam("subscribeAddr") String subscribeAddr,
            @RequestParam("roomNo") String roomNo
    		 ) throws IllegalStateException, IOException {
    		 
    	ChatMessage chatMessage = new ChatMessage();
    	chatMessage.setType(ChatMessage.MessageType.FILE);
    	chatMessage.setSenderEmpCode(senderEmpCode);
    	chatMessage.setEmpNickname(empNickname);
    	chatMessage.setSubscribeAddr(subscribeAddr);
    	chatMessage.setRoomNo(roomNo);
    	chatMessage.setFile(file);
   
    	Map<String, String>	paramMap	= chatService.insertFileMessage(chatMessage);
    	
    	chatMessage.setFilePath(paramMap.get("updatePath"));
    	chatMessage.setEmpLastName(paramMap.get("empLastName"));
    	chatMessage.setEmpFirstName(paramMap.get("empFirstName"));
    	// 동적으로 응답해줄 클라이언트의 구독주소가 변경되므로 아래와 같이 한다 
    	String destination = "/topic/" + chatMessage.getSubscribeAddr(); 
    	
    	chatMessage.setFile(null); // 파일은 안보내도 되기도 하고, MultipartFile 을 json 으로 바꾸려고 하면 에러남.
    	// 파일 데이터를 Base64 문자열로 인코딩하여 JSON에 포함시킬 수 있습니다. 이는 파일 데이터를 텍스트 형식으로 변환하여 직렬화할 수 있도록 합니다.
    	
    	messagingTemplate.convertAndSend(destination, chatMessage);
    	

    }
    
    @PostMapping("chat/exitChatRoom")
    @ResponseBody
    public String exitChatRoom(@RequestBody Map<String,Object> map,
    			@SessionAttribute("loginEmp") Employee2 loginEmp
    		) {
    	String currentRoomNo = (String) map.get("currentRoomNo");
    	log.debug("currentRoomNo==={}", currentRoomNo);
    	Integer result = chatService.exitChatRoom(currentRoomNo, loginEmp);
    	if(result > 0) {
    		return "채팅방에서 나가셨습니다.";
    	} else {
    		return "채팅방 나가기 실행 중 오류 발생";
    	}

    }
    
    @GetMapping("chat/loginBy58")
    @ResponseBody
    public String loginBy58(HttpServletRequest request) {
		Employee2 emp = new Employee2();
		emp.setEmpCode(58);
		emp.setEmpId("admin2");
		emp.setEmpFirstName("정");
		emp.setEmpLastName("윤희");
		emp.setComNo(10);		
		HttpSession session = request.getSession();
		session.setAttribute("loginEmp", emp);
    	
    	return "loginedBy58";
    }
    
    
    @GetMapping("chat/getDeptAndTeam")
    @ResponseBody
    public List<Department> getDeptAndTeam(@SessionAttribute("loginEmp") Employee2 loginEmp) {
    	
    	List<Department> deptTeamList = chatService.getDeptAndTeam(loginEmp);
    	log.debug("deptTeamList=={}", deptTeamList);   	
    	return deptTeamList;
    	
    }
    @GetMapping("chat/getTeamEmps")
    @ResponseBody
    public List<Employee2> getTeamEmps (@RequestParam("teamNo") String teamNo, 
    			@SessionAttribute("loginEmp") Employee2 loginEmp
    		) {
    	List<Employee2> empList = chatService.getTeamEmps(teamNo, loginEmp);
    	
    	
    	return empList;
    }
    
    @PostMapping("survey/getEmpList")
    @ResponseBody
    public List<Employee2> getEmpList (@RequestBody Map<String, List<Integer>> request){
    	
    	List<Integer> empCodeList = request.get("tempEmpCodeList");
    	    	
    	List<Employee2> empList = chatService.getEmpList(empCodeList);
    	
    	
    	
    	return empList;
    }
    
	
}
