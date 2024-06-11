package com.cowork.employee.chatting.model.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class Employee {
	
	private Integer empCode;
	private String empNo; // 사번 
	private String empId; 
	private String empPw; 
	private String empLastName; 
	private String empFirstName; 
	private String phone; 
	private String language;
	private String empAddress; 
	private String empBirth;
	private String hireDate;
	private String contractType;
	private String empTel; 
	private String workPlace;
	private String empEmail;
	private Integer comNo;
	private Integer teamNo;
	private Integer positionNo;
	private String profileImg;
	
	// Team 테이블 
	private String teamNm;
	
	// Department 테이블 
	private String deptNm;
}
