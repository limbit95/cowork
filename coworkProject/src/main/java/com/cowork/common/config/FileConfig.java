package com.cowork.common.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.servlet.MultipartConfigFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.util.unit.DataSize;
import org.springframework.web.multipart.MultipartResolver;
import org.springframework.web.multipart.support.StandardServletMultipartResolver;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import jakarta.servlet.MultipartConfigElement;

@PropertySource("classpath:/config.properties")
@Configuration
public class FileConfig implements WebMvcConfigurer {

		// 파일 업로드 임계값
		@Value("${spring.servlet.multipart.file-size-threshold}")
		private long fileSizeThreshold;
		
		// 요청당 파일 최대 크기
		@Value("${spring.servlet.multipart.max-request-size}")
		private long maxRequestSize;
		
		// 개별 파일당 최대 크기
		@Value("${spring.servlet.multipart.max-file-size}")
		private long maxFileSize;
		
		// 임계값 초과 시 임시 저장 폴더 경로
		@Value("${spring.servlet.multipart.location}")
		private String location;
		
		// TODO 
		@Value("${todo.file.resource-handler}")
	    private String todoFileResourceHandler; 

	    @Value("${todo.file.resource-location}")
	    private String todoFileResourceLocation; 

	    // logo
	    @Value("${logo.file.resource-handler}")
	    private String logoFileResourceHandler;
	    
	    @Value("${logo.file.resource-location}")
	    private String logoFileResourceLocation;
	    
	    // 게시판
	    @Value("${board.file.resource-handler}")
	    private String boardFileResourceHandler;
	    
	    @Value("${board.file.resource-location}")
	    private String boardFileResourceLocation;
	    
	    // 채팅 
	    @Value("${chatting.file.resource-handler}")
	    private String chattingFileResourceHandler;
	    
	    @Value("${chatting.file.resource-location}")
	    private String chattingFileResourceLocation;
	    
	    // 메일 
	    @Value("${mail.file.resource-handler}")
	    private String mailFileResourceHandler;
	    
	    @Value("${mail.file.resource-location}")
	    private String mailFileResourceLocation;
	    
		// 엑셀 파일
		@Value("${excel.resource-handler}")
		private String excelResourceHandler;
		@Value("${excel.resource-location}")
		private String excelResourceLocation;
	    
	    
	    @Override
	    public void addResourceHandlers(ResourceHandlerRegistry registry) {
	        registry
	            .addResourceHandler("/images/todo/**") // 클라이언트 요청 주소 패턴
	            .addResourceLocations("file:///C:/uploadFiles/todo/");

	        // 투두 
	        registry
	            .addResourceHandler(todoFileResourceHandler) 
	            .addResourceLocations(todoFileResourceLocation);
	        
	        // 로고
	        registry
	        	.addResourceHandler(logoFileResourceHandler)
	        	.addResourceLocations(logoFileResourceLocation);
	        
	        // 게시판
	        registry
        		.addResourceHandler(boardFileResourceHandler)
        		.addResourceLocations(boardFileResourceLocation);
	        
	        // 채팅
	        registry
	        	.addResourceHandler(chattingFileResourceHandler)
	        	.addResourceLocations(chattingFileResourceLocation);
	        
	        // 메일 
	        registry
	        .addResourceHandler(mailFileResourceHandler)
	        .addResourceLocations(mailFileResourceLocation);
	        
			// 엑셀
			registry.addResourceHandler(excelResourceHandler)
			.addResourceLocations(excelResourceLocation);
	        
	    }
		

		/* MultipartResolver 설정 */
		@Bean
		public MultipartConfigElement configElement() {
			
			MultipartConfigFactory factory = new MultipartConfigFactory();
			
			factory.setFileSizeThreshold(DataSize.ofBytes(fileSizeThreshold));
			
			factory.setMaxFileSize(DataSize.ofBytes(maxFileSize));
			
			factory.setMaxRequestSize(DataSize.ofBytes(maxRequestSize));
			
			factory.setLocation(location);
			
			return factory.createMultipartConfig();
			
		}
		
		
		
		@Bean
		public MultipartResolver multipartResolver() {
			
			StandardServletMultipartResolver multipartResolver
				= new StandardServletMultipartResolver();
			
			return multipartResolver;
		}
		
	
	
}
