package com.cowork.admin.meetingRoom.model.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cowork.admin.meetingRoom.model.dto.MeetingRoom;
import com.cowork.admin.meetingRoom.model.mapper.MeetingRoomMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(rollbackFor = Exception.class)
public class MeetingRoomServiceImpl implements MeetingRoomService {

	private final MeetingRoomMapper mapper;
	
	/** 회의실 목록 조회
	 * @return meetingRoomList
	 */
	@Override
	public List<MeetingRoom> meetingRoomList(int comNo) {

		List<MeetingRoom> meetingRoomList = mapper.meetingRoomList(comNo);
		
		return meetingRoomList;
	}

	/** 회의실 목록 추가
	 * @return result
	 */
	@Override
	public int meetingRoomInsert(MeetingRoom meetingRoom) {
		return mapper.meetingRoomInsert(meetingRoom);
	}

	/** 회의실 삭제
	 * @return result
	 */
	@Override
	public int meetingRoomDelete(MeetingRoom meetingRoom) {
		return mapper.meetingRoomDelete(meetingRoom);
	}

	
}
