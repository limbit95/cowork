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

	// 읽어온 엑셀 파일의 사원 정보 DB에 저장(계정 등록)
	@Override
	public int registEmployee(List<Employee2> inputEmployeeList) {
		
		
		List<Employee2> employeeList = mapper.selectEmployeeList();
		
		log.info("test : " + inputEmployeeList); 
		
		for(int i = 0; i < inputEmployeeList.size(); i++) {
			for(int x = 0; x < employeeList.size(); x++) {
				if(employeeList.get(x).getEmpNo().equals(inputEmployeeList.get(i).getEmpNo())) {
					return -1;
				}
			}
		}
		
		int result = 0;
		
		for(Employee2 employee : inputEmployeeList) {
			result = mapper.registEmployee(employee);
			if(result == 0) {
				return 0;
			}
		}
		
		return 1;
	}

}