package com.cowork.employee.mail.model.service;

import java.util.List;

import com.cowork.employee.mail.model.dto.Mail;

public interface MailService {

	/** 전체 메일함 조회 
	 * @param empCode
	 * @return
	 */
	List<Mail> mailList(int empCode);

}
