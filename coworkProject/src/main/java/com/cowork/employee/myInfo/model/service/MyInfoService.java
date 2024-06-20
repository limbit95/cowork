package com.cowork.employee.myInfo.model.service;

import java.io.IOException;

import org.springframework.web.multipart.MultipartFile;

import com.cowork.user.model.dto.Employee2;

public interface MyInfoService {

	int validateDuplicateEmpId(String empId);

	int updateProfileImg(Employee2 loginEmp, MultipartFile file)  throws IllegalStateException, IOException;

}
