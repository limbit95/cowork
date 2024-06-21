package com.cowork.employee.myInfo.model.service;

import java.io.IOException;
import java.util.Map;

import org.springframework.web.multipart.MultipartFile;

import com.cowork.user.model.dto.Employee2;

public interface MyInfoService {

	int validateDuplicateEmpId(String empId);

	int updateProfileImg(Employee2 loginEmp, MultipartFile file)  throws IllegalStateException, IOException;

	int update(Map<String, Object> paramMap, int empCode);

	int validateCurPw(String currentPwVal, Integer empCode);

	int updateAsNewPw(String newPw, Integer empCode);

}
