package com.cowork.employee.mail.model.service;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.apache.ibatis.session.RowBounds;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.cowork.admin.notice.model.exception.BoardInsertException;
import com.cowork.common.utility.Utility;
import com.cowork.common.utility.model.dto.Pagination;
import com.cowork.employee.mail.model.dto.Mail;
import com.cowork.employee.mail.model.dto.MailFile;
import com.cowork.employee.mail.model.dto.Recipient;
import com.cowork.employee.mail.model.exception.MailFileDeleteException;
import com.cowork.employee.mail.model.mapper.MailMapper;
import com.cowork.user.model.dto.Employee2;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

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
	
	@Value("${mail.file.resource-location}")
	private String mailFileResourceLocation;
	
	private final MailMapper mapper; 

	// 전체 메일함 조회 
	@Override
	public Map<String, Object> mailList(Map<String, Object> paramMap, int cp) {
		
		int empCode = (int) paramMap.get("empCode"); 
		log.info("empCode 넘어왔니? : " + empCode);
		
		Integer listCount = mapper.listCount(paramMap);				
		Integer mailCount = mapper.mailCount(empCode); 				
		Integer noReadCount = mapper.noReadCount(empCode); 
		
		listCount = listCount != null ? listCount : 0;
	    mailCount = mailCount != null ? mailCount : 0;
	    noReadCount = noReadCount != null ? noReadCount : 0;
		
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
		
		map.put("senderEmpCode", mail.getSenderEmpCode()); 
		map.put("sender", mail.getSender()); 
		map.put("senderMail", mail.getSenderMail()); 
		map.put("mail", mail); 
		map.put("fileList", fileList);
		map.put("recipientList", recipients); 
		map.put("refererList", referers);
		
		mapper.updateReadFl(mailNo); 
		
		return map;
	}

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
		
		Integer sentListCount = mapper.sentListCount(paramMap);				
		Integer sentMailCount = mapper.sentMailCount(empCode); 				
		Integer sentMailNoReadCount = mapper.sentMailNoReadCount(empCode);
		
		sentListCount = sentListCount != null ? sentListCount : 0;
		sentMailCount = sentMailCount!= null ? sentMailCount : 0;
		sentMailNoReadCount = sentMailNoReadCount != null ? sentMailNoReadCount : 0;
		
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
		
		Integer inListCount = mapper.inListCount(paramMap);				
		Integer inMailCount = mapper.inMailCount(empCode); 				
		Integer inMailNoReadCount = mapper.inMailNoReadCount(empCode); 
		
		inListCount = inListCount  != null ? inListCount  : 0;
		inMailCount = inMailCount!= null ? inMailCount : 0;
		inMailNoReadCount = inMailNoReadCount != null ? inMailNoReadCount : 0;
		
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
		
		log.info("empName : " + empName);
		
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
		log.info("empCode : " + empCode);
		
		Integer outListCount = mapper.outListCount(paramMap);		
		outListCount = outListCount  != null ? outListCount  : 0; 
		
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
		log.info("empCode : " + empCode);
		
		Integer binListCount = mapper.binListCount(paramMap);
		binListCount = binListCount  != null ? binListCount  : 0; 
		
		
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

	// 휴지통 메일 복구하기 
	@Override
	public void restoreMails(List<Integer> mailIds) {
		
		for (Integer mailId : mailIds) {
            mapper.restoreMail(mailId, '1'); 
        }
	}

	// 영구 삭제하기 
	@Override
	public void eliminateMails(List<Integer> mailIds) {
		
		for (Integer mailId : mailIds) {
            
            mapper.eliminateFile(mailId);
            mapper.eliminateRecipient(mailId);
            mapper.eliminateMail(mailId); 
        }
	}

	// 답장하기 
	@Override
	public int reply(Mail inputMail, List<MultipartFile> files, String recipient, String referer) throws IllegalStateException, IOException {
		
		int result = mapper.replyMail(inputMail);
		
		if(result == 0) return 0; 
		
		int mailNo = inputMail.getMailNo(); 
		
		log.info("mailNo: " + mailNo);
		
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

	// 전달하기 
	/*	@Override
	public int forward(Mail inputMail, List<MultipartFile> files, String recipient, String referer,  Map<String, Object> params,
			String updateOrder, List<MailFile> existingFiles) throws IllegalStateException, IOException {
			
		int fileMailNo = inputMail.getMailNo(); 
		
		int result = mapper.sendMail(inputMail);
		
		if(result == 0) return 0; 
		
		int mailNo = inputMail.getMailNo(); 
		
		
		log.info("기존 메일번호 : " + fileMailNo);
		log.info("mailNo: " + mailNo);
		
		List<Recipient> recipientList = new ArrayList<>(); 
		
		String[] recipientArr = recipient.split(","); 
		String[] refererArr = referer.split(","); 
		
		if (recipient != null && !recipient.isEmpty()) {
		    for (String empCodeStr : recipientArr) {
		        if (!empCodeStr.trim().isEmpty()) {
		            Recipient recipients = Recipient.builder()
		                    .empCode(Integer.parseInt(empCodeStr.trim()))
		                    .mailNo(mailNo)
		                    .referenceFl("1")
		                    .build();
		            recipientList.add(recipients);
		        }
		    }
		}

		if (referer != null && !referer.isEmpty()) {
		    for (String empCodeStr : refererArr) {
		        if (!empCodeStr.trim().isEmpty()) {
		            Recipient referers = Recipient.builder()
		                    .empCode(Integer.parseInt(empCodeStr.trim()))
		                    .mailNo(mailNo)
		                    .referenceFl("2")
		                    .build();
		            recipientList.add(referers);
		        }
		    }
		}
		
		log.info("받은 사람 : " + recipientList);
		
		result = mapper.recipientList(recipientList); 
		
		log.info("삭제 순서 : " + params);
		
		if(params != null && !params.equals("") ) {
			 
			 Map<String, Object> map = new HashMap<>();
				
				map.put("deleteOrder", params);
				map.put("mailNo", mailNo);
				
				result = mapper.deleteFile(map); 
				
				if(result == 0) throw new MailFileDeleteException(); 
				
				if(updateOrder != null && !updateOrder.equals("")) {
					

					String[] updateArr = updateOrder.split(",");
					
					for(int i=0; i<updateArr.length; i++) {
						
						log.info("i : " + i);
						log.info("updateArr[i] : " + updateArr[i]);
						log.info("mailNo : " + mailNo);
						MailFile upFile = MailFile.builder()
								.fileOrder(i)
								.mailNo(mailNo)
								.uploadFile(files.get(i))
								.orderUpdate(updateArr[i])
								.build(); 
						
						result = mapper.mailFileUpdate(upFile); 
				}
			}
		 }
		 
		 if(files != null && !files.isEmpty()) {
			 
			 List<MailFile> uploadList = new ArrayList<>(); 
			 
			 int fileOrder = 0; 
			 String[] updateArr = null; 

			if(updateOrder != null && updateOrder.equals("")) {
				
				updateArr = updateOrder.split(",");
				fileOrder = updateArr.length;
			}
			
			for(int i=0; i<files.size(); i++) {
				
				if(updateOrder != null ) fileOrder += 1;
				else fileOrder = i;
				
				if(!files.get(i).isEmpty()) {
					String originalName = files.get(i).getOriginalFilename(); // 원본명
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
			
			if(uploadList.isEmpty()) return mailNo; 
			
			result = mapper.mailFileInsert(uploadList); 
			
			if(result == uploadList.size()) {
				for(MailFile file : uploadList) {
					file.getUploadFile().transferTo(new File(folderPath + file.getFileRename()));
				}
			} else {
				throw new BoardInsertException("파일이 정상 삽입되지 않음"); 
			}
			
		 }			 
		    return result;
	
} */


	// 임시저장하기 
	@Override
	public int saveMail(Mail inputMail, List<MultipartFile> files, String recipient, String referer) throws IllegalStateException, IOException {
		
		int result = mapper.saveMail(inputMail);
		
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


	// 임시보관함 수정 
	@Override
	public int outUpdate(Mail inputMail, List<MultipartFile> files, String recipient, String referer,
			String deleteOrder, String updateOrder) throws IllegalStateException, IOException {
			
		
		int mailNo = inputMail.getMailNo(); 
		
		int result = mapper.updateSave(inputMail);
		if (result == 0) return 0;
		
		String[] recipientArr = recipient.split(",");
		String[] refererArr = referer.split(",");
		log.info("배열로 변경 : " + recipientArr.length);
		log.info("배열로 변경 : " + refererArr.length);

		List<Recipient> originRecipient = mapper.getRecipients(mailNo);
		List<Recipient> originReferer = mapper.getReferers(mailNo);

		List<Recipient> recipientList = new ArrayList<>();
		List<Recipient> refererList = new ArrayList<>();

		if (recipient != null && !recipient.isEmpty()) {
		    for (String empCode : recipientArr) {
		        Recipient recipients = Recipient.builder()
		                .empCode(Integer.parseInt(empCode))
		                .mailNo(mailNo)
		                .referenceFl("1")
		                .build();
		        recipientList.add(recipients);
		    }
		}

		if (referer != null && !referer.isEmpty()) {
		    for (String empCode : refererArr) {
		        Recipient referers = Recipient.builder()
		                .empCode(Integer.parseInt(empCode))
		                .mailNo(mailNo)
		                .referenceFl("2")
		                .build();
		        refererList.add(referers);
		    }
		}

		// 삭제할 수신자와 참조자 찾기
		List<Recipient> toDelete = new ArrayList<>(originRecipient);
		toDelete.addAll(originReferer);
		toDelete.removeAll(recipientList);
		toDelete.removeAll(refererList);
		
		log.info("toDelete : " + toDelete);

		// 추가할 수신자와 참조자 찾기
		List<Recipient> toAdd = new ArrayList<>(recipientList);
		toAdd.addAll(refererList);
		toAdd.removeAll(originRecipient);
		toAdd.removeAll(originReferer);
		
		log.info("toAdd : " + toAdd);

		// 기존 수신자 및 참조자 삭제
		for (Recipient recipients : toDelete) {
		    Map<String, Object> map = new HashMap<>();
		    map.put("mailNo", mailNo);
		    map.put("empCode", recipients.getEmpCode());
		    map.put("recipientNo", recipients.getRecipientNo());
		    result = mapper.deleteRecipient(map);
		    if (result == 0) {
		        log.error("수신자/참조자 삭제 실패: " + recipients);
		    }
		}

		// 새로운 수신자 및 참조자 추가
		if (!toAdd.isEmpty()) {
		    for (Recipient recipients : toAdd) {
		        result = mapper.insertRecipient(recipients);
		        if (result == 0) {
		            log.error("수신자/참조자 추가 실패: " + recipients);
		        }
		    }
		}

		
		 if(deleteOrder != null && !deleteOrder.equals("") ) {
			 
			 Map<String, Object> map = new HashMap<>();
				
				map.put("deleteOrder", deleteOrder);
				map.put("mailNo", mailNo);
				
				result = mapper.deleteFile(map); 
				
				if(result == 0) throw new MailFileDeleteException(); 
				
				if(updateOrder != null && !updateOrder.equals("")) {
					

					String[] updateArr = updateOrder.split(",");
					
					for(int i=0; i<updateArr.length; i++) {
						
						log.info("i : " + i);
						log.info("updateArr[i] : " + updateArr[i]);
						log.info("mailNo : " + mailNo);
						MailFile upFile = MailFile.builder()
								.fileOrder(i)
								.mailNo(mailNo)
								.uploadFile(files.get(i))
								.orderUpdate(updateArr[i])
								.build(); 
						
						result = mapper.mailFileUpdate(upFile); 
				}
			}
		 }
		 
		 if(files != null && !files.isEmpty()) {
			 
			 List<MailFile> uploadList = new ArrayList<>(); 
			 
			 int fileOrder = 0; 
			 String[] updateArr = null; 

			if(updateOrder != null && updateOrder.equals("")) {
				
				updateArr = updateOrder.split(",");
				fileOrder = updateArr.length;
			}
			
			for(int i=0; i<files.size(); i++) {
				
				if(updateOrder != null ) fileOrder += 1;
				else fileOrder = i;
				
				if(!files.get(i).isEmpty()) {
					String originalName = files.get(i).getOriginalFilename(); // 원본명
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
			
			if(uploadList.isEmpty()) return mailNo; 
			
			result = mapper.mailFileInsert(uploadList); 
			
			if(result == uploadList.size()) {
				for(MailFile file : uploadList) {
					file.getUploadFile().transferTo(new File(folderPath + file.getFileRename()));
				}
			} else {
				throw new BoardInsertException("파일이 정상 삽입되지 않음"); 
			}
			
		 }			 
		    return result;
	
	}

	
	// 임시보관함에서 전송 
	@Override
	public int outSend(Mail inputMail, List<MultipartFile> files, String recipient, String referer, String deleteOrder,
			String updateOrder) throws IllegalStateException, IOException {
		
		int mailNo = inputMail.getMailNo(); 
		
		int result = mapper.outSend(inputMail);
		if (result == 0) return 0;
		
		String[] recipientArr = recipient.split(",");
		String[] refererArr = referer.split(",");
		log.info("배열로 변경 : " + recipientArr.length);
		log.info("배열로 변경 : " + refererArr.length);

		List<Recipient> originRecipient = mapper.getRecipients(mailNo);
		List<Recipient> originReferer = mapper.getReferers(mailNo);

		List<Recipient> recipientList = new ArrayList<>();
		List<Recipient> refererList = new ArrayList<>();

		if (recipient != null && !recipient.isEmpty()) {
		    for (String empCode : recipientArr) {
		        Recipient recipients = Recipient.builder()
		                .empCode(Integer.parseInt(empCode))
		                .mailNo(mailNo)
		                .referenceFl("1")
		                .build();
		        recipientList.add(recipients);
		    }
		}

		if (referer != null && !referer.isEmpty()) {
		    for (String empCode : refererArr) {
		        Recipient referers = Recipient.builder()
		                .empCode(Integer.parseInt(empCode))
		                .mailNo(mailNo)
		                .referenceFl("2")
		                .build();
		        refererList.add(referers);
		    }
		}

		// 삭제할 수신자와 참조자 찾기
		List<Recipient> toDelete = new ArrayList<>(originRecipient);
		toDelete.addAll(originReferer);
		toDelete.removeAll(recipientList);
		toDelete.removeAll(refererList);
		
		log.info("toDelete : " + toDelete);

		// 추가할 수신자와 참조자 찾기
		List<Recipient> toAdd = new ArrayList<>(recipientList);
		toAdd.addAll(refererList);
		toAdd.removeAll(originRecipient);
		toAdd.removeAll(originReferer);
		
		log.info("toAdd : " + toAdd);

		// 기존 수신자 및 참조자 삭제
		for (Recipient recipients : toDelete) {
		    Map<String, Object> map = new HashMap<>();
		    map.put("mailNo", mailNo);
		    map.put("empCode", recipients.getEmpCode());
		    map.put("recipientNo", recipients.getRecipientNo());
		    result = mapper.deleteRecipient(map);
		    if (result == 0) {
		        log.error("수신자/참조자 삭제 실패: " + recipients);
		    }
		}

		// 새로운 수신자 및 참조자 추가
		if (!toAdd.isEmpty()) {
		    for (Recipient recipients : toAdd) {
		        result = mapper.insertRecipient(recipients);
		        if (result == 0) {
		            log.error("수신자/참조자 추가 실패: " + recipients);
		        }
		    }
		}

		
		 if(deleteOrder != null && !deleteOrder.equals("") ) {
			 
			 Map<String, Object> map = new HashMap<>();
				
				map.put("deleteOrder", deleteOrder);
				map.put("mailNo", mailNo);
				
				result = mapper.deleteFile(map); 
				
				if(result == 0) throw new MailFileDeleteException(); 
				
				if(updateOrder != null && !updateOrder.equals("")) {
					

					String[] updateArr = updateOrder.split(",");
					
					for(int i=0; i<updateArr.length; i++) {
						
						log.info("i : " + i);
						log.info("updateArr[i] : " + updateArr[i]);
						log.info("mailNo : " + mailNo);
						MailFile upFile = MailFile.builder()
								.fileOrder(i)
								.mailNo(mailNo)
								.uploadFile(files.get(i))
								.orderUpdate(updateArr[i])
								.build(); 
						
						result = mapper.mailFileUpdate(upFile); 
				}
			}
		 }
		 
		 if(files != null && !files.isEmpty()) {
			 
			 List<MailFile> uploadList = new ArrayList<>(); 
			 
			 int fileOrder = 0; 
			 String[] updateArr = null; 

			if(updateOrder != null && updateOrder.equals("")) {
				
				updateArr = updateOrder.split(",");
				fileOrder = updateArr.length;
			}
			
			for(int i=0; i<files.size(); i++) {
				
				if(updateOrder != null ) fileOrder += 1;
				else fileOrder = i;
				
				if(!files.get(i).isEmpty()) {
					String originalName = files.get(i).getOriginalFilename(); // 원본명
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
			
			if(uploadList.isEmpty()) return mailNo; 
			
			result = mapper.mailFileInsert(uploadList); 
			
			if(result == uploadList.size()) {
				for(MailFile file : uploadList) {
					file.getUploadFile().transferTo(new File(folderPath + file.getFileRename()));
				}
			} else {
				throw new BoardInsertException("파일이 정상 삽입되지 않음"); 
			}
			
		 }			 
		    return result;
	
	}

	// 전달하기 
	@Override
	public int forward(Mail inputMail, List<MultipartFile> files, String recipient, String referer, String updateOrder,
			String deleteOrder, int originMailNo) throws IllegalStateException, IOException {
		
		log.info("기존 메일 번호 : " + originMailNo);
		
		
		int result = mapper.sendMail(inputMail);
		if (result == 0) return 0;
		
		int mailNo = inputMail.getMailNo(); 
		
		List<Recipient> recipientList = new ArrayList<>(); 
		
		String[] recipientArr = recipient.split(","); 
		String[] refererArr = referer.split(","); 
		
		if (recipient != null && !recipient.isEmpty()) {
		    for (String empCodeStr : recipientArr) {
		        if (!empCodeStr.trim().isEmpty()) {
		            Recipient recipients = Recipient.builder()
		                    .empCode(Integer.parseInt(empCodeStr.trim()))
		                    .mailNo(mailNo)
		                    .referenceFl("1")
		                    .build();
		            recipientList.add(recipients);
		        }
		    }
		}

		if (referer != null && !referer.isEmpty()) {
		    for (String empCodeStr : refererArr) {
		        if (!empCodeStr.trim().isEmpty()) {
		            Recipient referers = Recipient.builder()
		                    .empCode(Integer.parseInt(empCodeStr.trim()))
		                    .mailNo(mailNo)
		                    .referenceFl("2")
		                    .build();
		            recipientList.add(referers);
		        }
		    }
		}
		
		log.info("받은 사람 : " + recipientList);
		
		result = mapper.recipientList(recipientList); 
	
		
		 // 기존 파일 정보를 가져오기
        List<MailFile> existingFiles = mapper.getMailFilesByMailNo(originMailNo);
        List<MailFile> filesToKeep = new ArrayList<>();

        // deleteOrder 처리
        List<Integer> deleteOrders = new ArrayList<>();
        if (deleteOrder != null && !deleteOrder.isEmpty()) {
            String[] deleteArr = deleteOrder.split(",");
            for (String order : deleteArr) {
                deleteOrders.add(Integer.parseInt(order.trim()));
            }
        }

        // 유지할 파일 필터링
        for (MailFile existingFile : existingFiles) {
            if (!deleteOrders.contains(existingFile.getFileOrder())) {
                filesToKeep.add(existingFile);
            }
        }

        // 유지할 기존 파일을 새로운 메일로 복사
        List<MailFile> uploadList = new ArrayList<>();
        for (MailFile fileToKeep : filesToKeep) {
            MailFile file = MailFile.builder()
                    .filePath(fileToKeep.getFilePath())
                    .fileOriginName(fileToKeep.getFileOriginName())
                    .fileRename(fileToKeep.getFileRename())
                    .fileOrder(fileToKeep.getFileOrder())
                    .mailNo(mailNo)
                    .build();

            uploadList.add(file);
        }

        // 새로운 파일 업로드 처리
        if (files != null && !files.isEmpty()) {
            int fileOrder = filesToKeep.size();
            for (int i = 0; i < files.size(); i++) {
                if (!files.get(i).isEmpty()) {
                    String originalName = files.get(i).getOriginalFilename(); // 원본명
                    String rename = Utility.fileRename(originalName);

                    MailFile file = MailFile.builder()
                            .filePath(webPath)
                            .fileOriginName(originalName)
                            .fileRename(rename)
                            .fileOrder(fileOrder++)
                            .mailNo(mailNo)
                            .uploadFile(files.get(i))
                            .build();

                    uploadList.add(file);
                }
            }
        }

        if (uploadList.isEmpty()) return mailNo;

        result = mapper.mailFileInsert(uploadList);

        // 다중 파일 성공확인
        if (result == uploadList.size()) {
            // 서버에 파일 저장
            for (MailFile file : uploadList) {
                if (file.getUploadFile() != null) { // 새로운 파일만 서버에 저장
                    file.getUploadFile().transferTo(new File(folderPath + file.getFileRename()));
                } else { // 기존 파일 복사
                    File sourceFile = new File(mailFileResourceLocation + file.getFileRename());
                    File destFile = new File(folderPath + file.getFileRename());
                    Utility.copyFile(sourceFile, destFile);
                }
            }
        } else {
            throw new BoardInsertException("파일이 정상 삽입되지 않음");
        }

        return result;
		
	}

	

}

	


	
	
	
	
	

	

	

