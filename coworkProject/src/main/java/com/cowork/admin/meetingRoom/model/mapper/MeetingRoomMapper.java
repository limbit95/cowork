package com.cowork.admin.meetingRoom.model.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.cowork.admin.meetingRoom.model.dto.MeetingRoom;

@Mapper
public interface MeetingRoomMapper {

	/** 회의실 목록 조회
	 * @param comNo
	 * @return meetingRoomList
	 */
	List<MeetingRoom> meetingRoomList(int comNo);

}
