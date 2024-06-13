package com.cowork.employee.reservation.model.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@ToString
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Setter
@Getter
public class ReserveInfo {
	private int reserveInfoNo;
	private String reserveInfoTitle;
	private String reserveInfoColor;
	private int empCode;
	private int meetingRoomNo;
	private String reserveInfoStart;
	private String reserveInfoEnd;
	private List<String> teamReserve;
	private List<String> deptReserve;
	private int comReserve;
	private int comNo;
	private String meetingRoomNm;
	
	private String deptShare;
	private String teamShare;
}
