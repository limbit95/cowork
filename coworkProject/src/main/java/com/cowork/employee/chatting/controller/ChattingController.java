package com.cowork.employee.chatting.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

import lombok.extern.slf4j.Slf4j;

@Controller
@Slf4j
public class ChattingController {

	@GetMapping("chat")
	public String chatting() {
		return "/employee/chatting/chatting";
	}
}
