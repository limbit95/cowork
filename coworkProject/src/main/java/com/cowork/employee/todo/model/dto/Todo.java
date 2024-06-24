package com.cowork.employee.todo.model.dto;

import java.util.List;

import com.cowork.user.model.dto.Employee2;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Builder
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Todo {

	private int todoNo; 
	private String todoTitle; 
	private String todoContent; 
	private String todoWriteDate; 
	private String todoEndDate; 
	private String todoComplete; 
	private int empCode;
	private String empName; 
	
	private int todoMgrNo; 
	
	private String requestEmp; // 요청자 
	private String inChargeEmp;  // 담당자 
	
	private List<TodoFile> fileList;
	private List<String> inChargeEmpList; // 담당자 리스트
	private List<String> inChargeEmpNames;

		
}
