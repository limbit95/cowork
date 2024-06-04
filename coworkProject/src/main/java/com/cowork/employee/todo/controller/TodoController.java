package com.cowork.employee.todo.controller;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import com.cowork.employee.todo.model.dto.Todo;
import com.cowork.employee.todo.model.service.TodoService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RequiredArgsConstructor
@Slf4j
@RequestMapping("todo")
@Controller
public class TodoController {
	
	private final TodoService service; 

	/** todo List 조회 
	 * @return
	 */
	@GetMapping("todoList")
	public String todoList(Model model) {
		
		List<Todo> todoList = service.selectTodoList(); 
		model.addAttribute("todo", todoList); 	

		log.info("todo 목록 :: " , todoList.toString());
		
		return "employee/todo/todoList"; 
	}
	
	/** 할 일 상세 조회 
	 * @param todoNo
	 * @param model
	 * @return
	 */
	/*@GetMapping("detail/{todoNo}")
    public String todoDetail(@PathVariable int todoNo, Model model) {
        Todo todo = service.todoDetail(todoNo);
        log.info("todo 상세 정보 :: " + todo.toString());
        model.addAttribute("todoDetail", todo);
        return "employee/todo/todoDetail";
    }
	

	@PostMapping("insert")
	public String todoInsert() {
		return "employee/todo/todoList"; 
	} */
}
