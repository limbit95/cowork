//package com.cowork.common.config;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
//import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
//
//import com.cowork.common.interceptor.LoginInterceptor;
//
//@Configuration
//public class WebConfig implements WebMvcConfigurer{
//    @Autowired
//    private LoginInterceptor loginInterceptor;
//
//    @Override
//    public void addInterceptors(InterceptorRegistry  registry) {
//        registry.addInterceptor(loginInterceptor)
//                .addPathPatterns("/**") 
//                .excludePathPatterns(
//                		/* 홈 */
//                        "/",                 
//                        /* CSS, JS IMAGES */
//                        "/css/**",           
//                        "/js/**",            
//                        "/images/**",
//                        /* 파비콘 */
//                        "/favicon.ico",     
//                        /* 에러 페이지 => 이거 경로가 아닌거 같은데 에러페이지 어디에 위치해 있나 확인필요  */
//                        "/error",            
//                        "/error/**",
//                        /* 이용약관 */
//                        "/user/term",
//                        /* 로그인 */
//                        "/user/login",
//                        /* 회원가입 */
//                        "/user/signUp",
//                        /* ID 체크 */
//                        "/user/checkId",
//                        /* 이거뭐임? */
//                        "/user/checkDomain",
//                        /* 서비스키를 얻는 URL  */
//                        "/user/getServiceKey",
//                        /* 아이디 찾기 */
//                        "/user/findId",
//                        /* 비밀번호 찾기 */
//                        "/user/findPw",
//                        /* 비밀번호 재설정 */
//                        "/user/resetPwPage",
//                        "/user/resetPw",
//                        /* 퀵 로그인 -> 나중에 지워야 함*/
//                        "/user/quick",
//                        /* 비밀번호 찾기에서 핸드폰번호로 찾기 -> 인증번호 맞았을 경우 넘겨지는 페이지 */
//                        "/user/resetPwPhoneVersion",
//                        /* 회원가입시 이메일 보내는 fetch 요청 url  */
//                        "/email/signup", // 회원가입시 이메일 보내는 url
//                        
//                        /* COOL SMS*/
//                        "/coolSMS/**",
//                        
//                        /* 비밀번호 찾기에서 FETCH 문 */
//                        "/email/**"
//                        
//                		); 
//
//    }
//}
