package com.cowork.employee.myInfo.model.service;

import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.cowork.common.utility.Utility;
import com.cowork.employee.myInfo.model.mapper.MyInfoMapper;
import com.cowork.employee.survey.model.mapper.SurveyMapper;
import com.cowork.employee.survey.model.service.SurveyServiceImpl;
import com.cowork.user.model.dto.Employee2;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Transactional
@Slf4j
@Service
@RequiredArgsConstructor
@PropertySource("classpath:/config.properties")
public class MyInfoServiceImpl implements MyInfoService{
	
	private final MyInfoMapper myInfoMapper;
	
	@Value("${profile.file.web-path}")
	private String webPath; // 앞에 붙이는 조각
	
	@Value("${profile.file.folder-path}")
	private String folderPath; //찐 저장소
	
	@Override
	public int validateDuplicateEmpId(String empId) {
		
		int result = myInfoMapper.validateDuplicateEmpId(empId);
		return result;
	}

	// 프로필 사진 바꾸는 것 
	@Override
	public int updateProfileImg(Employee2 loginEmp, MultipartFile file) throws IllegalStateException, IOException {						
		//--------------------------------------------------------
		 String updatePath = null; 
		 String rename = null;
		 
		 if(!file.isEmpty()) { 
			 rename = Utility.fileRename(file.getOriginalFilename());
			 updatePath = webPath + rename; // 고유키 앞에 조각을 붙임.
		 }
		 
		Integer empCode = loginEmp.getEmpCode();
		Map<String, Object> paramMap = new HashMap<>();
		paramMap.put("empCode", empCode);
		paramMap.put("updatePath", updatePath);

		 int result = myInfoMapper.updateProfileImg(paramMap);
		 
		 if(result > 0) {
			 if(!file.isEmpty()) {  // 사용자가 이미지 제출시 
				 file.transferTo(new File(folderPath + rename));  // 찐 저장소에 이미지 저장
			 }
		 }

		 loginEmp.setProfileImg(updatePath); // 세션객체 안에 있는 이미지 경로도 바꿔줌.
		 // @SessionAttribute 를 쓰면 // 거기서 쓴 객체를 이렇게 바꾸면, 반영이 된다고 함. 
		 return result;
		
		
		//-----------------------------------------------------

			

		

	}

}
