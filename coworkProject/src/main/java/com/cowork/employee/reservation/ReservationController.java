package com.cowork.employee.reservation;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ReservationController {

	@GetMapping("reservation")
	public String reservation() {
		return "employee/reservation/reservation";
	}
}
