package com.cowork.admin.meetingRoom.model.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.cowork.admin.meetingRoom.model.dto.MeetingRoom;
import com.cowork.admin.meetingRoom.model.mapper.MeetingRoomMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MeetingRoomServiceImpl implements MeetingRoomService {

	private final MeetingRoomMapper mapper;
	
	@Override
	public List<MeetingRoom> meetingRoomList(int comNo) {

		List<MeetingRoom> meetingRoomList = mapper.meetingRoomList(comNo);
		
		return meetingRoomList;
	}

	
}
