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
	public String chattingHome(HttpServletRequest request) {
		return "employee/chatting/chatting";
	}
	
	
    /** 현재 로그인한 사원이 속한 회사의 부서와 팀을 모두 조회 
     * @param loginEmp : 세션에 담아둔 로그인한 사원 
     * @return
     */
    @GetMapping("chat/deptAndTeam")
    @ResponseBody
    public List<Department> getDeptAndTeam(@SessionAttribute("loginEmp") Employee2 loginEmp) {    	
    	List<Department> deptTeamList = chatService.getDeptAndTeam(loginEmp);
    	return deptTeamList;
    }
    
    /** 팀에 소속된 사원들에 대한 리스트를 조회 
     * @param teamNo : team 테이블 기본키 
     * @param loginEmp : 세션에 담아둔 로그인한 사원 
     * @return
     */
    @GetMapping("chat/teamEmps")
    @ResponseBody
    public List<Employee2> getTeamEmps (@RequestParam("teamNo") String teamNo, 
    			@SessionAttribute("loginEmp") Employee2 loginEmp
    		) {
    	List<Employee2> empList = chatService.getTeamEmps(teamNo, loginEmp);
    	return empList;
    }
    

    /** 이름으로 사원들을 조회
     * @param loginEmp
     * @param paramMap
     * @return
     */
    @GetMapping("chat/empList")
    @ResponseBody
    public List<Employee2> empList(@SessionAttribute("loginEmp") Employee2 loginEmp,
    		@RequestParam("inputData") String inputData) {
    	List<Employee2> empList = chatService.empList(inputData, loginEmp);
    	return empList;    	
    }
	
    /** 채팅 메시지들을 List 자료구조로 가져옴 
     * @return
     */
    @GetMapping("chat/chatMessage")
    @ResponseBody
    public List<ChatMessageMe> getChatMessage( @RequestParam("roomNo") String roomNo) {
    	List<ChatMessageMe> messageList = chatService.getChatMessage(roomNo);
    	for(ChatMessageMe m : messageList) {
    		log.debug("asd={}",m);
    	}
    	
    	return messageList;
    	
    }

    /** 채팅방을 만든다. 
     * @param makeChat
     * @param model
     * @return
     */
    @PostMapping("chat/makeChat")
    @ResponseBody
    public String makeChat(@RequestBody MakeChat makeChat, Model model) {
    	
    	// 채팅방 구성원 
    	List<String> empCodeList = makeChat.getEmpCodeList();
    	// 채팅방 생성자 
    	String empCode = makeChat.getMakeEmpCode();
    	
    	// 채팅방을 만든다. 
        String subscribeAddr = chatService.makeChat(empCodeList, empCode);
        
        // 채팅방이 만들어지면 실시간으로 만들어진 채팅방 구성원들에게 채팅방이 만들어졌음을 알린다. 
        empCodeList.forEach(memberNo2 -> {
            messagingTemplate.convertAndSend("/topic/newRoom/" + memberNo2, subscribeAddr);
        });
    	
    	return subscribeAddr;
    }
    
    
    /** 채팅방들을 가져오는 메서드 
     * @param empCode
     * @return
     */
    @GetMapping("chat/chattingRooms")
    @ResponseBody
    public List<ChatRoom> getChattingRooms(@RequestParam("empCode") String empCode) {
    	List<ChatRoom> roomList = chatService.getChattingRooms(empCode);
    	return roomList;    	
    }

    /** 채팅메세지를 저장하고, 뿌려주는 역할 
     * @param chatMessage
     */
    @MessageMapping("/chat.sendMessage")
    @ResponseBody
    public void sendMessage(@Payload ChatMessage chatMessage) {
    	
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
    
    /** 채팅메세지 중 파일을 저장하고 뿌려주는 역할 
     * @param senderEmpCode
     * @param empNickname
     * @param file
     * @param subscribeAddr
     * @param roomNo
     * @throws IllegalStateException
     * @throws IOException
     */
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
    
    /** 채팅방 나가기 
     * @param map
     * @param loginEmp
     * @return
     */
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

    /** 사원들, 사원들의 부서, 사원들의 팀 조회 
     * @param request
     * @return
     */
    @PostMapping("survey/getEmpList")
    @ResponseBody
    public List<Employee2> getEmpList (@RequestBody Map<String, List<Integer>> request){
    	
    	List<Integer> empCodeList = request.get("tempEmpCodeList");
    	    	
    	List<Employee2> empList = chatService.getEmpList(empCodeList);
    	
    	return empList;
    }
    
	
}
