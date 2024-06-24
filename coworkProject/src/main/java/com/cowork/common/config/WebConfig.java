/*package com.cowork.common.config;

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
                        "/",                 // 루트 페이지
                        "/login",            // 로그인 페이지
                        "/resources/**",     // 정적 자원
                        "/static/**",        // 정적 자원
                        "/css/**",           // CSS 파일
                        "/js/**",            // JavaScript 파일
                        "/images/**",        // 이미지 파일
                        "/favicon.ico",      // 파비콘
                        "/error",            // 에러 페이지
                        "/error/**",
                        "/user/term",
                        "/user/login",
                        "/user/signUp",
                        "/user/checkId",
                        "/user/checkDomain",
                        "/user/getServiceKey",
                        "/user/findId",
                        "/user/findPw",
                        "/user/resetPwPage",
                        "/user/quick",
                        "/user/resetPwPhoneVersion"
                		); 
    }
}*/
