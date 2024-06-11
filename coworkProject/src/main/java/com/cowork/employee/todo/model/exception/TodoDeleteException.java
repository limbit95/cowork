package com.cowork.employee.todo.model.exception;

public class TodoDeleteException extends RuntimeException {
	
	public TodoDeleteException() {
		super("이미지 삭제 중 예외 발생");
	}
	
	public TodoDeleteException(String message) {
		super(message);
	}
}
