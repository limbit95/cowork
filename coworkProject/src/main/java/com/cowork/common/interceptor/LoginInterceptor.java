/*package com.cowork.common.interceptor;

import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import com.cowork.user.model.dto.Employee2;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

@Component
public class LoginInterceptor implements HandlerInterceptor{
	
	@Override
	public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
			throws Exception {
		HttpSession session = request.getSession();
		Employee2 loginEmp = (Employee2) session.getAttribute("loginEmp");
		
        // 로그인이 되어 있지 않으면 홈 페이지로 리다이렉트
        if (loginEmp == null) {
            response.sendRedirect(request.getContextPath() + "/");
            return false; // 요청 처리를 중단하고 리다이렉트
        }
        
		return true;
	}
	

}*/
