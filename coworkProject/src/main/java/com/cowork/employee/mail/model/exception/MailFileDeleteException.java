package com.cowork.employee.mail.model.exception;

public class MailFileDeleteException extends RuntimeException {

	public MailFileDeleteException() {
		super("파일 삭제 중 예외 발생"); 
	}
	
	public MailFileDeleteException(String message) {
		super("message"); 
	}
	
}
