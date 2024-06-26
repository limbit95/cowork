package com.cowork.admin.addr.model.service;

import java.io.File;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.cowork.admin.addr.model.mapper.AddInBulkMapper;
import com.cowork.admin.addr.model.mapper.AdminAddrMapper;
import com.cowork.common.utility.ReadExcel;
import com.cowork.common.utility.Utility;
import com.cowork.user.model.dto.Employee2;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Transactional(rollbackFor = Exception.class)
@Slf4j
@RequiredArgsConstructor
public class AddInBulkServiceImpl implements AddInBulkService{
	
	private final AddInBulkMapper mapper;
	
    private final BCryptPasswordEncoder bcrypt;
	
	@Value("${excel.folder-path}")
	private String excelFolderPath;

	// employee 테이블에 사원 정보 저장
	@Override
	public List<Map<String, Object>> readExcel(MultipartFile excel) throws Exception {
		
		String fileRename = Utility.fileRename(excel.getOriginalFilename());
		
		excel.transferTo(new File(excelFolderPath + fileRename));
		
		List<Map<String, Object>> excelList =  ReadExcel.readExcel(fileRename, excelFolderPath);

		if(excelList.isEmpty()) {
			return null;
		}
		
		return excelList;
	}

	// 사원 계정 정보 조회
	@Override
	public List<Employee2> selectEmployeeList() {
		return mapper.selectEmployeeList();
	}

	// 일괄 추가하려는 구성원 정보 DB에 저장(계정 생성)
	@Override
	public int regist(List<Map<String, Object>> data) {
		int result = 0;
		
		for(int i = 0; i < data.size(); i++) {
			String encPw = bcrypt.encode((String)data.get(i).get("empPw"));
			data.get(i).put("empPw", encPw);
			
			result = mapper.regist(data.get(i));
		}
		
		return 1;
	}

	// ID 리스트 조회
	@Override
	public List<String> getEmpIdList(int comNo) {
		return mapper.getEmpIdList(comNo);
	}

	// 팀이 존재하는지 확인
	@Override
	public int checkTeamNm(Map<String, Object> data) {
		return mapper.checkTeamNm(data);
	}


}