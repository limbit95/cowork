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
	
	private int comNo; // 회사 식별키
	private String comNm; // 회사명
	private String deptNm; // 부서명
	private String teamNm; // 팀명
	private String positionNm; // 직급명
	private String domain; // 도메인
	
	
	
}