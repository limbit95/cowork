package com.cowork.common.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import com.cowork.common.interceptor.LoginInterceptor;

@Configuration
public class WebConfig implements WebMvcConfigurer{
    @Autowired
    private LoginInterceptor loginInterceptor;

    @Override
    public void addInterceptors(InterceptorRegistry  registry) {
        registry.addInterceptor(loginInterceptor)
                .addPathPatterns("/**") 
                .excludePathPatterns(
                		
                		/* 여기 적힌 url 만이 로그인 없이 접근가능한 url 입니다. */
                		/* 체크할 문제들 : 사업자등록번호 입력이 안됨 */
                		
                		/* 홈 */
                        "/",                 
                        /* CSS, JS IMAGES */
                        "/css/**",           
                        "/js/**",            
                        "/images/**",
                        /* 파비콘 */
                        "/favicon.ico",     
                        /* 회원가입시 이메일 보내는 fetch 요청 url  */
                        "/email/signup",
                        /* COOL SMS*/
                        "/coolSMS/**",
                        /* 비밀번호 찾기에서 FETCH 문 */
                        "/email/**",
                        /* 이 경로에 있는 모든 것들이 접근가능해야 함 */
                        "/user/**",
                        "/chatbot"
 
                		); 

    }
}
