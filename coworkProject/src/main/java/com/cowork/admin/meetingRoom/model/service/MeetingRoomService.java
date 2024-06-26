package com.cowork.admin.meetingRoom.model.service;

import java.util.List;

import com.cowork.admin.meetingRoom.model.dto.MeetingRoom;

public interface MeetingRoomService {

	/** 회사 회의실 List
	 * @param comNo
	 * @return MeetingRoomList
	 */
	List<MeetingRoom> meetingRoomList(int comNo);

	/** 회의실 insert
	 * @param meetingRoom
	 * @return result
	 */
	int meetingRoomInsert(MeetingRoom meetingRoom);

	/** 회의실 삭제
	 * @param meetingRoomNo
	 * @return result
	 */
	int meetingRoomDelete(MeetingRoom meetingRoom);

	/** 회의실 수정
	 * @param updateMeetingRoom
	 * @return result
	 */
	int updateMeetingRoom(MeetingRoom updateMeetingRoom);

}
