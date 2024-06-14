package com.cowork.employee.mail.model.service;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.RowBounds;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.cowork.common.utility.Utility;
import com.cowork.common.utility.model.dto.Pagination;
import com.cowork.employee.mail.model.dto.Mail;
import com.cowork.employee.mail.model.dto.MailFile;
import com.cowork.employee.mail.model.dto.Recipient;
import com.cowork.employee.mail.model.mapper.MailMapper;
import com.cowork.employee.notice.model.dto.Notice;
import com.cowork.user.model.dto.Employee2;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class MailServiceImpl implements MailService {
	
	@Value("${mail.file.web-path}")
	private String webPath;
	
	@Value("${mail.file.folder-path}")
	private String folderPath;
	
	private final MailMapper mapper; 

	// 전체 메일함 조회 
	@Override
	public Map<String, Object> mailList(Map<String, Object> paramMap, int cp) {
		
		int empCode = (int) paramMap.get("empCode"); 
		log.info("empCode 넘어왔니? : " + empCode);
		
		int listCount = mapper.listCount(paramMap);				
		int mailCount = mapper.mailCount(empCode); 				
		int noReadCount = mapper.noReadCount(empCode); 
		
		Pagination pagination = new Pagination(cp, listCount); 
		
		int limit = pagination.getLimit();
		int offset = (cp - 1) * limit;
		RowBounds rowBounds = new RowBounds(offset, limit);
		
		List<Mail> mailList = mapper.mailList(paramMap, rowBounds);
		
		Map<String, Object> map = new HashMap<>(); 
		
		map.put("pagination", pagination); 
		map.put("mailList", mailList); 
		map.put("mailCount", mailCount); 
		map.put("noReadCount", noReadCount);
		map.put("listCount", listCount);
		
		return map;
	}

	// 메일 상세 조회 
	@Override
	public Map<String, Object> mailDetail(int mailNo) {
		
		Map<String, Object> map = new HashMap<>(); 
		Map<String, Object> fileMap = new HashMap<>(); 
		
		List<Recipient> recipients = mapper.getRecipients(mailNo);
		List<Recipient> referers = mapper.getReferers(mailNo);
		
		fileMap.put("mailNo", mailNo); 
		
		Mail mail = mapper.mailDetail(mailNo);
		List<MailFile> fileList = mapper.fileList(fileMap); 
		
		map.put("mail", mail); 
		map.put("fileList", fileList);
		map.put("recipientList", recipients); 
		map.put("refererList", referers);
		
		mapper.updateReadFl(mailNo); 
		
		return map;
	}

	// 전체 메일 개수 조회 
/*	@Override
	public int mailCount(int empCode) {
		
		return mapper.mailCount(empCode);
	} */

	// 안 읽은 메일 개수 조회 
	@Override
	public int noReadCount(int empCode) {
		
		return mapper.noReadCount(empCode);
	}

	// 파일 조회 
	@Override
	public List<MailFile> getMailFiles(int mailNo) {
		
		return mapper.getMailFiles(mailNo);
	}

	// 보낸 메일 리스트 
	@Override
	public Map<String, Object> sentMailList (Map<String, Object> paramMap, int cp) {
		
		int empCode = (int) paramMap.get("empCode"); 
		log.info("empCode 넘어왔니? : " + empCode);
		
		int sentListCount = mapper.sentListCount(paramMap);				
		int sentMailCount = mapper.sentMailCount(empCode); 				
		int sentMailNoReadCount = mapper.sentMailNoReadCount(empCode); 
		
		Pagination pagination = new Pagination(cp, sentListCount); 
		
		int limit = pagination.getLimit();
		int offset = (cp - 1) * limit;
		RowBounds rowBounds = new RowBounds(offset, limit);
		
		List<Mail> sentMailList = mapper.sentMailList(paramMap, rowBounds);
		
		Map<String, Object> map = new HashMap<>(); 
		
		map.put("pagination", pagination); 
		map.put("sentMailList", sentMailList); 
		map.put("sentMailCount", sentMailCount); 
		map.put("sentMailNoReadCount", sentMailNoReadCount);
		map.put("sentListCount", sentListCount);
		
		return map;
	}

	// 보낸 메일 개수 
	@Override
	public int sentMailCount(int empCode) {
		
		return mapper.sentMailCount(empCode);
	}
	
	// 보낸 메일 안 읽은 개수 
	@Override
	public int sentMailNoReadCount(int empCode) {
		
		return mapper.sentMailNoReadCount(empCode);
	}

	// 받은 메일 리스트 
	@Override
	public Map<String, Object> inMailList (Map<String, Object> paramMap, int cp) {
		
		int empCode = (int) paramMap.get("empCode"); 
		log.info("empCode 넘어왔니? : " + empCode);
		
		int inListCount = mapper.inListCount(paramMap);				
		int inMailCount = mapper.inMailCount(empCode); 				
		int inMailNoReadCount = mapper.inMailNoReadCount(empCode); 
		
		Pagination pagination = new Pagination(cp, inListCount); 
		
		int limit = pagination.getLimit();
		int offset = (cp - 1) * limit;
		RowBounds rowBounds = new RowBounds(offset, limit);
		
		List<Mail> inMailList = mapper.inMailList(paramMap, rowBounds);
		
		Map<String, Object> map = new HashMap<>(); 
		
		map.put("pagination", pagination); 
		map.put("inMailList", inMailList); 
		map.put("inMailCount", inMailCount); 
		map.put("inMailNoReadCount", inMailNoReadCount); 
		map.put("inListCount", inListCount);
		
		return map;
		
	}

	// 받은 메일 전체 개수 
	@Override
	public int inMailCount(int empCode) {
		
		return mapper.inMailCount(empCode);
	}

	// 받은 메일 안 읽은 개수 
	@Override
	public int inMailNoReadCount(int empCode) {
		
		return mapper.inMailNoReadCount(empCode);
	}

	@Override
	public int mailCount(int empCode) {
		// TODO Auto-generated method stub
		return 0;
	}

	// 사원 검색 - 받는이, 참조 
	@Override
	public List<Employee2> mailEmpSearch(String empName, int comNo) {
		
		List<Employee2> employeeList = new ArrayList<>(); 
		
		if(empName.equals("")) {
			employeeList = mapper.employeeSearch(comNo); 
		} else {
			Map<String, Object> map = new HashMap<>(); 
			
			map.put("empName", empName); 
			map.put("comNo", comNo); 
			
			employeeList = mapper.employeeListSearch(map); 
		}
		
		log.info("empName  못가져왔냐고!! : " + empName);
		
		return employeeList;
	}

	// 메일 보내기 
	@Override
	public int sendMail(Mail inputMail, List<MultipartFile> files, String recipient, String referer) throws IllegalStateException, IOException {
		
		int result = mapper.sendMail(inputMail);
		
		if(result == 0) return 0; 
		
		int mailNo = inputMail.getMailNo(); 
		
		log.info("mailNo 가져왔나요 : " + mailNo);
		
		List<Recipient> recipientList = new ArrayList<>(); 
		
		String[] recipientArr = recipient.split(","); 
		String[] refererArr = referer.split(","); 
		
		if (recipient != null && !recipient.isEmpty()) {
			
			for (int i=0; i<recipientArr.length; i++ ) {
				Recipient recipients = Recipient.builder()
										.empCode(Integer.parseInt(recipientArr[i]))
										.mailNo(mailNo)
										.referenceFl("1")
										.build(); 
				
				recipientList.add(recipients); 
			}
		}
  		
		if (referer != null && !referer.isEmpty()) {
			
			for(int i=0; i<refererArr.length; i++) {
				Recipient referers = Recipient.builder()
									.empCode(Integer.parseInt(refererArr[i]))
									.mailNo(mailNo)
									.referenceFl("2")
									.build(); 
				
				recipientList.add(referers); 
			}
		}
		
		log.info("받은 사람 : " + recipientList);
		
		result = mapper.recipientList(recipientList); 
		
		if(result == recipientList.size()) {
			
			if(files != null && !files.isEmpty()) {
				List<MailFile> uploadList = new ArrayList<>(); 
				
				for(int i=0; i<files.size(); i++) {
					
					MultipartFile mfile = files.get(i);
					
					if(!files.get(i).isEmpty()) {
						
						
						String originalName = files.get(i).getOriginalFilename(); 
						String rename = Utility.fileRename(originalName); 
						
						MailFile file = MailFile.builder()
										.filePath(webPath)
										.fileOriginName(originalName)
										.fileRename(rename)
										.fileOrder(i)
										.mailNo(mailNo)
										.uploadFile(files.get(i))
										.build(); 
						
						uploadList.add(file); 
					}
				}
				
				if(!uploadList.isEmpty()) {
					
					result = mapper.mailFileInsert(uploadList); 
					
					if( result == uploadList.size() ) {
						
						for(MailFile file : uploadList) {
							file.getUploadFile().transferTo(new File(folderPath + file.getFileRename()));
						}
					} else {
						return mailNo; 
					}
				}
				
			}
			
			return mailNo; 
		}
		
		
		return 0;
	}

	// 휴지통으로 옮기기 
	@Override
	public boolean toBin(List<Integer> mailIds) {

            mapper.updateMailFlag(mailIds); 
            
            return true;

	}

	// 임시보관함 조회 
	@Override
	public Map<String, Object> outMailList(Map<String, Object> paramMap, int cp) {
		
		int empCode = (int) paramMap.get("empCode"); 
		log.info("empCode 넘어왔니? : " + empCode);
		
		int outListCount = mapper.outListCount(paramMap);				
		
		Pagination pagination = new Pagination(cp, outListCount); 
		
		int limit = pagination.getLimit();
		int offset = (cp - 1) * limit;
		RowBounds rowBounds = new RowBounds(offset, limit);
		
		List<Mail> outMailList = mapper.outMailList(paramMap, rowBounds);
		
		Map<String, Object> map = new HashMap<>(); 
		
		map.put("pagination", pagination); 
		map.put("outMailList", outMailList); 
		map.put("outListCount", outListCount);
		
		return map;
	}

	// 휴지통 
	@Override
	public Map<String, Object> binList(Map<String, Object> paramMap, int cp) {
		
		int empCode = (int) paramMap.get("empCode"); 
		log.info("empCode 넘어왔니? : " + empCode);
		
		int binListCount = mapper.binListCount(paramMap);				
		
		Pagination pagination = new Pagination(cp, binListCount); 
		
		int limit = pagination.getLimit();
		int offset = (cp - 1) * limit;
		RowBounds rowBounds = new RowBounds(offset, limit);
		
		List<Mail> binList = mapper.binList(paramMap, rowBounds);
		
		Map<String, Object> map = new HashMap<>(); 
		
		map.put("pagination", pagination); 
		map.put("binList", binList); 
		map.put("binListCount", binListCount);
		
		return map;
	}

	

	

}
