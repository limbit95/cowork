package com.cowork.employee.todo.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@RequestMapping("todo")
@Controller
public class TodoController {

	/** 투 두 페이지 이동 
	 * @return
	 */
	@GetMapping("todoList")
	public String todoList() {
		return "employee/todo/todoList"; 
	}
	
	
}
