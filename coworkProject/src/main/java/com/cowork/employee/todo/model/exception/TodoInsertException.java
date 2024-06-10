package com.cowork.employee.todo.model.exception;

public class TodoInsertException extends RuntimeException{

	public TodoInsertException() {
		super("할 일 등록 중 예외 발생"); 
	}
	
	public TodoInsertException(String message) {
		super(message); 
	}
}
