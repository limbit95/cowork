package com.cowork.employee.reservation.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.SessionAttribute;

import com.cowork.user.model.dto.Employee2;

@Controller
@RequestMapping("reservation")
public class ReservationController {

	@GetMapping("reservation")
	public String reservation() {
		return "employee/reservation/reservation";
	}
	
	@GetMapping("reservationInsert")
	public String reservationInsert(@SessionAttribute("loginEmp") Employee2 loginEmp) {
		// 페이지 요청이 왔을 때 보여줄 거 session scope 에 있는 loginEmp 에서
		// comNo 로 부서, 팀 조회해오기
		int comNo = loginEmp.getComNo();
		
		// comNo 로 회사 모든 부서와 팀 조회해오기
		
		return "employee/reservation/reservationInsert";
	}
}
