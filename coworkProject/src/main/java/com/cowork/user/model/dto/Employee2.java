
package com.cowork.user.model.dto;

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
public class Employee2 {

	private int empCode; // 사원 식별키
	private String empNo; // 사번
	private String empId;
	private String empPw;
	private String empLastName; // 사원 성
	private String empFirstName; // 사원 이름
	private String empEmail;
	private String phone;
	private String empAddress;
	private String empBirth;
	private String hireDate;
	private String contractType;
	private String empTel;
	private String workPlace;
	private String profileImg;
	private String enrollDate;
	private String inviteAuthKey;
	private String empDelFl;
	
	private int comNo; // 회사 식별키
	private String comNm; // 회사명
	private String deptNm; // 부서명
	private String teamNm; // 팀명
	private Integer teamNo;
	private String positionNm; // 직급명
	private int positionNo; // 직급 식별키
	private String domain; // 도메인
	private int generalManager; // 관리자 번호
	private String comLogo;
	private String empName;
	private String empIp;
	private int managerType;
	
	private String arrivalTime;
	private String departureTime;
	
	// 06.21 PEB
	private String attendanceYn; // 근태관리 권한
	private String functionYn;   // 기능관리 권한
	private String teamBoardYn;  // 팀게시판 권한
	
	// 06.22 최재준
	private Integer businessCardFl;
	
	
}