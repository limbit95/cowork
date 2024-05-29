package com.cowork.employee.todo;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@RequestMapping("todo")
@Controller
public class TodoController {

	@GetMapping("todoList")
	public String todoList() {
		return "employee/todo/todoList"; 
	}
	
	
}
