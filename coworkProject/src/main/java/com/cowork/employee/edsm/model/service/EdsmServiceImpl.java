package com.cowork.employee.edsm.model.service;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.cowork.admin.edsm.model.dto.Draft;
import com.cowork.admin.edsm.model.mapper.AdminEdsmMapper;
import com.cowork.admin.notice.model.exception.BoardInsertException;
import com.cowork.common.utility.Utility;
import com.cowork.employee.edsm.model.dto.Approver;
import com.cowork.employee.edsm.model.dto.DraftKeep;
import com.cowork.employee.edsm.model.dto.Edsm;
import com.cowork.employee.edsm.model.dto.EdsmFile;
import com.cowork.employee.edsm.model.mapper.EdsmMapper;
import com.cowork.user.model.dto.Employee2;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Transactional(rollbackFor = Exception.class)
@PropertySource("classpath:/config.properties")
@Slf4j
public class EdsmServiceImpl implements EdsmService{
	
	private final AdminEdsmMapper mapperDraft;
	private final EdsmMapper mapper;
	
	@Value("${edsm.file.web-path}")
	private String webPath;
	
	@Value("${edsm.file.folder-path}")
	private String folderPath;

	
	// 결재문서 조회
	@Override
	public Map<String, Object> edsmDraftList(Map<String, Object> paramMap) {
		
		
		List<Draft> draftList = mapperDraft.draftList(paramMap); // 결재문서 조회
		List<Draft> draftKeepList = mapper.draftKeepList(paramMap); // 자주찾는 결재문서 조회
		Map<String, Object> map = new HashMap<>();
		
		map.put("draftList", draftList);
		map.put("draftKeepList", draftKeepList);
		
		return map;
	}

	// 자주찾는 결재 등록
	@Override
	public int draftKeepYn(DraftKeep draftKeep) {
		
		// 자주찾는 결재 등록되어 있는 경우 수정
		int result = mapper.draftKeepUpdate(draftKeep);
		
		if(result == 0) mapper.draftKeepInsert(draftKeep);
		
		return result;
	}
	
	// 전자결재 양식 상세
	@Override
	public Map<String, Object> edsmDetailDraft(int draftNo, int comNo) {
		
		Draft draft = mapperDraft.edsmDetailDraft(draftNo); // 양식 상세
		List<Employee2> employeeList = mapper.employeeSearch(comNo); // 결재인, 참조인 검색
		Map<String, Object> map = new HashMap<>();
		
		map.put("draft", draft);
		map.put("employeeList", employeeList);
		
		return map;
	}

	// 전자결재 등록
	@Override
	public int edsmRequest(Edsm inputEdsm, List<MultipartFile> files, String approver , String referrer) throws IllegalStateException, IOException {
		
		// 전자결재 등록
		int result = mapper.edsmRequest(inputEdsm);
		
		if(result == 0) return 0;
		
		int edsmNo = inputEdsm.getEdsmNo(); // 삽입된 전자결재 번호를 변수로 저장
		
		log.info("edsmNo " + edsmNo);
		
		// 결재자, 참조자 APPROVER에 넣기
		List<Approver> approverList = new ArrayList<>();
		
		String[] approverArr = approver.split(","); // 결재자
		String[] referrerArr = referrer.split(","); // 참조자
		
		for(int i=0; i<approverArr.length; i++) {
			Approver appr = Approver.builder()
					.approverFlage("1")
					.empCode(Integer.parseInt(approverArr[i]))
					.edsmNo(edsmNo)
					.build();
		    
		    approverList.add(appr);
		}
		
		if(!referrer.equals("")) {
			for(int i=0; i<referrerArr.length; i++) {
				Approver appr = Approver.builder()
						.approverFlage("2")
						.empCode(Integer.parseInt(referrerArr[i]))
						.edsmNo(edsmNo)
						.build();
			    
			    approverList.add(appr);
			}
		}
		
		/*for (Map.Entry<Integer, String> entry : approverMap.entrySet()) {
			
		    Approver approver = Approver.builder()
					.approverFlage(entry.getValue())
					.empCode(entry.getKey())
					.edsmNo(edsmNo)
					.build();
		    
		    approverList.add(approver);
		}*/
		
		// 결재자 등록
		result = mapper.approverInsert(approverList);
		
		// 다중 성공확인
		if(result == approverList.size()) {
			
			if(files != null) {
				List<EdsmFile> uploadList = new ArrayList<>(); // 실제 업로드된 파일의 정보를 모아둘 List 생성
				
				for(int i=0; i<files.size(); i++) {
					
					if(!files.get(i).isEmpty()) {
						String originalName = files.get(i).getOriginalFilename(); // 원본명
						String rename = Utility.fileRename(originalName);
						
						EdsmFile file = EdsmFile.builder()
								.filePath(webPath)
								.fileOriginName(originalName)
								.fileRename(rename)
								.fileOrder(i)
								.edsmNo(edsmNo)
								.uploadFile(files.get(i))
								.build();
						uploadList.add(file);
					}
				}
					
				if(uploadList.isEmpty()) return edsmNo;
				
				result = mapper.edsmFileInsert(uploadList);
				
				// 다중 파일 성공확인
				if(result == uploadList.size()) {
					
					// 서버에 파일 저장
					for(EdsmFile file : uploadList) {
						file.getUploadFile().transferTo(new File(folderPath + file.getFileRename()));
					}
				} else {
					throw new BoardInsertException("전자결재 파일이 정상 삽입되지 않음");
				}
			}
			
		} else {
			throw new BoardInsertException("전자결재 결재자가 정상 삽입되지 않음");
		}
		
		
		return edsmNo;
	}

	// 결재인, 참조인 검색
	@Override
	public List<Employee2> edsmSerach(String empFirstName, int comNo) {
		
		List<Employee2> employeeList = new ArrayList<>();
		
		if(empFirstName.equals("")) {
			employeeList = mapper.employeeSearch(comNo);
		} else {
			Map<String, Object> map = new HashMap<>();
			
			map.put("empFirstName", empFirstName);
			map.put("comNo", comNo);
			
			employeeList = mapper.edsmSerach(map);
		}
		
		// TODO Auto-generated method stub
		return employeeList;
	}

}
