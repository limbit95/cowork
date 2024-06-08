package com.cowork.employee.todo.model.dto;

import java.util.List;

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
	
	private int todoMgrNo; 
	private String requestEmp; 
	private String inChargeEmp; 
	
	private List<TodoFile> fileList;
		
}
