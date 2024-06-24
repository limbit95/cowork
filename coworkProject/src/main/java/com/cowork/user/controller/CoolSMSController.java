package com.cowork.user.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.SessionAttribute;

import com.cowork.common.utility.Utility;
import com.cowork.user.model.service.UserService;

import lombok.extern.slf4j.Slf4j;
import net.nurigo.sdk.NurigoApp;
import net.nurigo.sdk.message.model.Message;
import net.nurigo.sdk.message.request.SingleMessageSendingRequest;
import net.nurigo.sdk.message.response.SingleMessageSentResponse;
import net.nurigo.sdk.message.service.DefaultMessageService;

@RestController
@Slf4j
@RequestMapping("coolSMS")
public class CoolSMSController {

	private final DefaultMessageService messageService;
	private final UserService userService;

	@Autowired
	public CoolSMSController(
			UserService userService,
			@Value("${cool.sms.apikey}") String apiKey,
			@Value("${cool.sms.apisecretkey}") String apiSecretKey
	) {
		this.userService = userService;
		this.messageService = NurigoApp.INSTANCE.initialize(apiKey, apiSecretKey, "https://api.coolsms.co.kr");
	}

	/**
	 * 단일 메시지 발송 예제
	 */
	@PostMapping("/send-one")
	public int sendOne(@RequestBody Map<String, String> map
			) {

		String phoneNum = map.get("phoneNum");
		String empId = map.get("findPwByPhone");
		int randomNum = Utility.phoneAuth();
		
		// 해당 아이디에 매칭되는 핸드폰번호가 맞는지 확인
		int result1 = userService.validatePhoneNum(empId, phoneNum);
		if(result1 == 0) {
			return 0;
		}
		// 여기까지 왔다는 것은, 사용자가 입력한 아이디와 핸드폰번호가 DB에 매칭되어 있다는 것. 
		// DB 에 이 랜덤한 값을 저장해놨다가 빼와야함.
		userService.addAuth(phoneNum, randomNum);		
		
		Message message = new Message();
		// 발신번호 및 수신번호는 반드시 01012345678 형태로 입력되어야 합니다.
		message.setFrom("01067015246");
		message.setTo(phoneNum);
		message.setText(String.valueOf(randomNum) + "재준오빠가 보냅니다");

		SingleMessageSentResponse response = this.messageService.sendOne(new SingleMessageSendingRequest(message));
		
		return 1;
	}

	@PostMapping("verify")
	public int verifyAuth(@RequestBody Map<String, String> map) {
		String authKey = map.get("inputAuthKey");
		String phoneNum = map.get("phoneNum");
		int result = userService.verifyAuth(phoneNum, authKey);
		return result; 
	}
	


}
