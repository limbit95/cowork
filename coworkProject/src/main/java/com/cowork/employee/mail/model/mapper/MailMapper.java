package com.cowork.employee.mail.model.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.cowork.employee.mail.model.dto.Mail;

@Mapper
public interface MailMapper {

	/** 전체 메일함 조회 
	 * @param empCode
	 * @return
	 */
	List<Mail> mailList(int empCode);

}
