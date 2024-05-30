package com.cowork.admin.meetingRoom;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

import lombok.extern.slf4j.Slf4j;

@Controller
@Slf4j
public class MeetingRoomController {

	@GetMapping("meetingRoom")
	public String meetingRoom() {
		return "admin/meetingRoom/meetingRoom";
	}
}
