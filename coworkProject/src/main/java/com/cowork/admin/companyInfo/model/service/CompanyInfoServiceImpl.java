package com.cowork.admin.companyInfo.model.service;

import java.io.File;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.cowork.admin.companyInfo.model.dto.Company;
import com.cowork.admin.companyInfo.model.mapper.CompanyInfoMapper;
import com.cowork.common.utility.Utility;

import lombok.RequiredArgsConstructor;

@Service
@Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
@PropertySource("classpath:/config.properties")
public class CompanyInfoServiceImpl implements CompanyInfoService {

	private final CompanyInfoMapper mapper;
	
	@Value("${logo.file.web-path}")
	private String logoWebPath;
	
	@Value("${logo.file.folder-path}")
	private String logoFolderPath;

	@Override
	public int companyLogoUpdate(MultipartFile comLogo, Company myCompany) throws Exception {
		// 수정할 경로
		String updatePath = null;
		
		// 변경명 저장
		String rename = null;
		
		// 업로드한 이미지가 있을 경우
		// - 있을 경우 : 수정할 경로 조합 (클라이언트 접근 경로+리네임파일명)
		if(!comLogo.isEmpty()) {
			// updatePath 조합
			
			// 1. 파일명 변경
			rename = Utility.fileRename(comLogo.getOriginalFilename());
			
			// 2. /images/logo/변경된파일명
			updatePath = logoWebPath + rename;
			
		}
		
		// 수정된 로고 이미지 경로 + 회사 번호를 저장할 DTO 객체
		Company com = Company.builder()
				.comNo(myCompany.getComNo())
				.comLogo(updatePath)
				.build();
		
		// UPDATE 수행
		int result = mapper.companyLogoUpdate(com);
		
		if(result > 0) {
			// DB에 수정 성공 시
			// 프로필 이미지를 없앤 경우(NULL로 수정한 경우)를 제외
			// -> 업로드한 이미지가 있을 경우
			if(!comLogo.isEmpty()) {
				// 파일을 서버 지정된 폴더에 저장
				comLogo.transferTo(new File(logoFolderPath + rename));
			}
			
			// 세션 회사 정보에서 로고 이미지 경로를
			// 업데이트한 경로로 변경
			myCompany.setComLogo(updatePath);
		}
		return result;
	}
}
