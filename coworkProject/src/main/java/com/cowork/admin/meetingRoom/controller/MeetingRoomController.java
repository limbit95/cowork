package com.cowork.admin.meetingRoom.controller;

import java.util.List;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import com.cowork.admin.meetingRoom.model.dto.MeetingRoom;
import com.cowork.admin.meetingRoom.model.service.MeetingRoomService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Controller
@Slf4j
@RequestMapping("meetingRoom")
@RequiredArgsConstructor
public class MeetingRoomController {

	private final MeetingRoomService service;
	
	/** 회의실 목록 보여주기
	 * @param model
	 * @return meetingRoomList
	 */
	@GetMapping("meetingRoomList")
	public String meetingRoom(Model model) {
		// 매개변수로 loginMember 가져와서 com_no 꺼내와야함
		int comNo = 1;
		
		List<MeetingRoom> meetingRoomList = service.meetingRoomList(comNo);
		
		model.addAttribute("meetingRoomList", meetingRoomList);
		
		return "admin/meetingRoom/meetingRoom";
	}
	
}
