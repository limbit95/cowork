package com.cowork.common.aop;

import org.aspectj.lang.annotation.Pointcut;

public class PointcutBundle {

	@Pointcut("execution(* com.cowork..*Controller*.*(..)) && !execution(* com.cowork.employee.chatting.controller.ChattingController.sendMessage(..))")	
	public void controllerPointcut() {}
	
	@Pointcut("execution(* com.cowork..*ServiceImpl*.*(..))")
	public void serviceImplPointcut() {}
}
