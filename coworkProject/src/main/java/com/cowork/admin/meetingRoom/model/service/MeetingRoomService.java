package com.cowork.admin.meetingRoom.model.service;

import java.util.List;

import com.cowork.admin.meetingRoom.model.dto.MeetingRoom;

public interface MeetingRoomService {

	/** 회사 회의실 List
	 * @param comNo
	 * @return MeetingRoomList
	 */
	List<MeetingRoom> meetingRoomList(int comNo);

}
