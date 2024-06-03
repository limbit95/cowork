package com.cowork.admin.meetingRoom.model.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@ToString
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class MeetingRoom {
	private int meetingRoomNo; // 회의실 기본키
	private String meetingRoomNm; // 회의실명
	private int comNo; // 회사번호
	
	private List<MeetingRoom> meetingRoomList;
}
