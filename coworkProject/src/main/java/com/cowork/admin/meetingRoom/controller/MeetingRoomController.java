package com.cowork.admin.meetingRoom.controller;

import java.util.List;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

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
	public String meetingRoomList(Model model) {
		// 매개변수로 loginMember 가져와서 com_no 꺼내와야함
		int comNo = 1;
		
		List<MeetingRoom> meetingRoomList = service.meetingRoomList(comNo);
		
		model.addAttribute("meetingRoomList", meetingRoomList);
		
		return "admin/meetingRoom/meetingRoom";
	}
	
	@PostMapping("meetingRoomInsert")
	public String meetingRoomInsert(RedirectAttributes ra,
			@RequestParam(value="meetingRoomNm") String meetingRoomNm) {
		// 매개변수로 loginMember 가져와서 com_no 꺼내와야함
		// 넣어줘야하는 값 seq, 회의실 이름, com_no 보내줘야함
		
		MeetingRoom meetingRoom = new MeetingRoom();
		
		meetingRoom.setMeetingRoomNm(meetingRoomNm);
		// loginMember 에서 꺼낸 com_no 넣어줘야함
		meetingRoom.setComNo(1);
		
		int result = service.meetingRoomInsert(meetingRoom);
		
		String message = "";
		
		// insert 성공 시
		if(result > 0) {
			message = "회의실이 추가되었습니다.";
		} else {
			message = "회의실 추가에 실패하였습니다.";
		}
		
		ra.addFlashAttribute("message", message);
		
		return "redirect:meetingRoomList";
	}
	
}
