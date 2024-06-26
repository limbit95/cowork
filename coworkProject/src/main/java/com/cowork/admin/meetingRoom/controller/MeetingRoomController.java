package com.cowork.admin.meetingRoom.controller;

import java.util.List;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.SessionAttribute;
import org.springframework.web.bind.annotation.SessionAttributes;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.cowork.admin.meetingRoom.model.dto.MeetingRoom;
import com.cowork.admin.meetingRoom.model.service.MeetingRoomService;
import com.cowork.user.model.dto.Employee2;

import lombok.Builder;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Controller
@Slf4j
@RequestMapping("meetingRoom")
@RequiredArgsConstructor
@SessionAttributes("meetingRoomList")
public class MeetingRoomController {

	private final MeetingRoomService service;
	
	/** 회의실 목록 보여주기
	 * @param model
	 * @return meetingRoomList
	 */
	@GetMapping("meetingRoomList")
	public String meetingRoomList(@SessionAttribute("loginEmp") Employee2 loginEmp, Model model) {
		
		List<MeetingRoom> meetingRoomList = service.meetingRoomList(loginEmp.getComNo());
		
		model.addAttribute("meetingRoomList", meetingRoomList);
		
		return "admin/meetingRoom/meetingRoom";
	}
	
	@PostMapping("meetingRoomInsert")
	public String meetingRoomInsert(RedirectAttributes ra,
			@RequestParam(value="meetingRoomNm") String meetingRoomNm,
			@SessionAttribute("loginEmp") Employee2 loginEmp) {
		// 매개변수로 loginMember 가져와서 com_no 꺼내와야함
		// 넣어줘야하는 값 seq, 회의실 이름, com_no 보내줘야함
		
		MeetingRoom meetingRoom = new MeetingRoom();
		
		meetingRoom.setMeetingRoomNm(meetingRoomNm);
		// loginMember 에서 꺼낸 com_no 넣어줘야함
		meetingRoom.setComNo(loginEmp.getComNo());
		
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
	
	/** 회의실 삭제
	 * @param meetingRoomNo
	 * @return result
	 */
	@ResponseBody
	@DeleteMapping("delete")
	public int meetingRoomDelete(@RequestBody int meetingRoomNo,
			@SessionAttribute("loginEmp") Employee2 loginEmp) {
		
		MeetingRoom meetingRoom = new MeetingRoom();
		meetingRoom.setComNo(loginEmp.getComNo());
		meetingRoom.setMeetingRoomNo(meetingRoomNo);
		
		return service.meetingRoomDelete(meetingRoom);
	}
	
	@GetMapping("meetingRoomUpdate")
	public String meetingRoomUpdate(@RequestParam("meetingRoomNo") int meetingRoomNo,
			@RequestParam("meetingRoomNm") String meetingRoomNm,
			@SessionAttribute("loginEmp") Employee2 loginEmp,
			RedirectAttributes ra) {
		
		MeetingRoom updateMeetingRoom = MeetingRoom.builder()
				.comNo(loginEmp.getComNo())
				.meetingRoomNm(meetingRoomNm)
				.meetingRoomNo(meetingRoomNo)
				.build();

		int result = service.updateMeetingRoom(updateMeetingRoom);
		
		String message = "";
		
		if(result > 0) {
			message = "회의실 이름 수정 성공";
		} else {
			message = "회의실 이름 수정 실패";
		}
		
		ra.addFlashAttribute(message);
		
		return "redirect:meetingRoomList";
	}
}
