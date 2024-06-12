package com.cowork.employee.mail.model.service;

import java.util.List;

import com.cowork.employee.mail.model.dto.Mail;

public interface MailService {

	/** 전체 메일함 조회 
	 * @param empCode
	 * @return
	 */
	List<Mail> mailList(int empCode);

	/** 메일 상세 조회 
	 * @param mailNo
	 * @return
	 */
	int mailDetail(int mailNo);

	/** 전체 메일 개수 조회 
	 * @param empCode
	 * @return
	 */
	int mailCount(int empCode);

	/** 안 읽은 메일 개수 조회 
	 * @param empCode
	 * @return
	 */
	int noReadCount(int empCode);

}
