package com.cowork.employee.todo.controller;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.SessionAttribute;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.cowork.employee.todo.model.dto.Todo;
import com.cowork.employee.todo.model.dto.TodoFile;
import com.cowork.employee.todo.model.service.TodoService;
import com.cowork.user.model.dto.Employee2;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RequiredArgsConstructor
@Slf4j
@RequestMapping("todo")
@Controller
public class TodoController {
	// 김선규 왔다감
	private final TodoService service; 
	
	/**
     * Todo List 조회
     * @return
     */
    @GetMapping("todoList")
    public String todoList(Model model, @SessionAttribute("loginEmp") Employee2 loginEmp) {
        
    	int empCode = loginEmp.getEmpCode();
        log.info("empCode 는?? : " + empCode);

        List<Todo> todoList = service.selectTodoList(empCode);
        model.addAttribute("todo", todoList);
        model.addAttribute("loginEmp", loginEmp);

        return "employee/todo/todoList";
    }

    /**
     * 조건별 조회 
     * @param todoComplete
     * @param inCharge
     * @param request
     * @param sortBy
     * @param todoQuery
     * @param loginEmp
     * @return
     */
    @GetMapping("todos")
    @ResponseBody
    public List<Todo> getTodos(@RequestParam(value = "todoComplete", required = false) String todoComplete,
                               @RequestParam(value = "inCharge", required = false) Boolean inCharge,
                               @RequestParam(value = "request", required = false) Boolean request,
                               @RequestParam(value = "sortBy", required = false) String sortBy,
                               @RequestParam(value = "todoQuery", required = false) String todoQuery,
                               @SessionAttribute("loginEmp") Employee2 loginEmp) {

        int empCode = loginEmp.getEmpCode();

        log.info("Received parameters - todoComplete: " + todoComplete + ", inCharge: " + inCharge + ", "
                + "request: " + request + ", sortBy: " + sortBy + ", todoQuery: " + todoQuery);

        // 검색어가 있는 경우
        if (todoQuery != null && !todoQuery.isEmpty()) {
            log.info("Returning search results for query: " + todoQuery);
            return service.todoQueryList(todoQuery, empCode);
        }

        // 필터링 조건 처리
        Map<String, Object> filters = new HashMap<>();
        filters.put("empCode", empCode);
        filters.put("todoComplete", todoComplete);
        filters.put("inCharge", inCharge);
        filters.put("request", request);
        filters.put("sortBy", sortBy);

        return service.getFilteredTodos(filters);
    }
   
    
    

	/** 할 일 상세 조회 
	 * @param todoNo
	 * @param model
	 * @return
	 */
	@ResponseBody
	@GetMapping("{todoNo:[0-9]+}")
    public Todo todoDetail(@PathVariable("todoNo") int todoNo,
    						Model model, 
    						@SessionAttribute("loginEmp") Employee2 loginEmp) {	
		
		int empCode = loginEmp.getEmpCode(); 
		
		Map<String, Integer> map = new HashMap<>(); 
	    map.put("todoNo", todoNo); 
	    map.put("empCode", empCode);
	    
	    // 할 일 상세 조회
	    Todo todo = service.todoDetail(map);
	    log.info("todo 상세조회시 requestEmp : " + todo.getRequestEmp());
	    
	    // 담당자 조회 
	    List<String> inChargeEmpList = service.getEmpList(todoNo); 
	    todo.setInChargeEmpList(inChargeEmpList);
	     
	    
	    if (!inChargeEmpList.isEmpty()) {
	    	
	        if (inChargeEmpList.size() == 1) {	        	
	            todo.setInChargeEmp(inChargeEmpList.get(0));
	            
	        } else {
	            todo.setInChargeEmp(String.join(", ", inChargeEmpList));
	        }
	    }
	   
	    // 첨부 파일 목록 조회
	    List<TodoFile> fileList = service.todoFiles(todoNo);
	    todo.setFileList(fileList);

	    
	    model.addAttribute("todo", todo); 
	    model.addAttribute("loginEmp", loginEmp);
	    
	    log.info("todo 상세 : " + todo); 
	    
	    return todo; 
    }

	

	/** 할 일 등록하기 
	 * @param files
	 * @param model
	 * @param inputTodo
	 * @param ra
	 * @return
	 * @throws IllegalStateException
	 * @throws IOException
	 */
	@PostMapping("insert")
	public String todoInsert(@RequestParam("files") List<MultipartFile> files, 
								Model model, 
								Todo inputTodo, 
								RedirectAttributes ra,
								@SessionAttribute("loginEmp") Employee2 loginEmp
								) throws IllegalStateException, IOException {
		
			int empCode = loginEmp.getEmpCode(); 
			inputTodo.setEmpCode(empCode); 
			
			// 담당자 여러명인 경우 
			String inChargeEmpStr = inputTodo.getInChargeEmp(); 
			List<String> inChargeEmpList = Arrays.asList(inChargeEmpStr.split("\\s*,\\s*")); 
			
			log.info("담당자 여러명일때 넘겨받은 리스트 : " + inChargeEmpList.toString());
			
			int result = service.todoInsert(inputTodo, files, inChargeEmpList); 

			model.addAttribute("todo", inputTodo);
			
			String message; 
			
			if(result > 0) {
				message = "등록 완료"; 
			} else {
				message = "등록 실패"; 
			}
			
			ra.addFlashAttribute("message", message); 
			
		
		return "redirect:/todo/todoList"; 
	} 
	

	/** 할 일 수정 
	 * @param files
	 * @param model
	 * @param inputTodo
	 * @param ra
	 * @return
	 * @throws IllegalStateException
	 * @throws IOException
	 */
/*	@PostMapping("update")
	public String todoUpdate(@RequestParam("files") List<MultipartFile> files, 
							Model model,
							Todo inputTodo, 
							RedirectAttributes ra, 
							@SessionAttribute("loginEmp") Employee2 loginEmp) throws IllegalStateException, IOException {
		
		int todoNo = inputTodo.getTodoNo(); 
		int empCode = loginEmp.getEmpCode(); 
		
		inputTodo.setEmpCode(empCode);
		
		log.info("todoNo ::: " + todoNo);
		log.info("파일 개수 : " + files.size());
		
		// 담당자 여러명인 경우 
		String inChargeEmpStr = inputTodo.getInChargeEmp(); 
		List<String> inChargeEmpList = Arrays.asList(inChargeEmpStr.split("\\s*,\\s*")); 

		int result = service.todoUpdate(inputTodo, files, inChargeEmpList); 
		
		model.addAttribute("todo", inputTodo); 
		
		
		String message; 
		
		if(result > 0) {
			message = "수정 완료"; 
		} else {
			message = "수정 실패"; 
		}
		
		ra.addFlashAttribute("message", message); 
		
		
		return "redirect:/todo/todoList"; 
	}
	*/
	
/*	@ResponseBody
	@PostMapping("update")
	public int todoUpdate(@RequestParam(value="files", required=false) List<MultipartFile> files, 
	                      @RequestParam("todoNo") int todoNo,
	                      Model model, 
	                      Todo inputTodo, 
	                      @RequestParam(value="uploadedFiles", required=false) String uploadedFiles, 
	                      @RequestParam(value="newFiles", required=false) String newFiles, 
	                      @RequestParam(value="deletedFiles", required=false) String deletedFiles, 
	                      @SessionAttribute("loginEmp") Employee2 loginEmp) throws IllegalStateException, IOException {

		int empCode = loginEmp.getEmpCode(); 
		    inputTodo.setEmpCode(empCode); 
		    inputTodo.setTodoNo(todoNo); 
		    
		  
		  
		    log.info("업로드 리스트트트트트트트 : " + uploadedFileList); 
		    log.info("새파일 리스트트트트트트트 : " + newFileList); 
		    log.info("삭제 리스트트트트트트트 : " + deletedFileList); 
		    log.info("넘어온 파일 리스트 : " + files.size()); 

	    // 담당자 여러명인 경우 
	    String inChargeEmpStr = inputTodo.getInChargeEmp(); 
	    List<String> inChargeEmpList = Arrays.asList(inChargeEmpStr.split("\\s*,\\s*")); 

	    log.info("담당자 여러명일때 넘겨받은 리스트 : " + inChargeEmpList.toString());

	    int result = service.todoUpdate(inputTodo, files, inChargeEmpList, uploadedFileList, newFileList, deletedFileList); 

	    model.addAttribute("todo", inputTodo);

	    return result; 
	}*/
	
	@ResponseBody
	@PostMapping("update/{todoNo}")
	public int todoUpdate(	@PathVariable("todoNo") int todoNo,
							Todo inputTodo, 
							@RequestParam("files") List<MultipartFile> files,
							@RequestParam(value="deleteOrder", required=false) String deleteOrder,
							@RequestParam(value="updateOrder", required=false) String updateOrder,
	                      	@SessionAttribute("loginEmp") Employee2 loginEmp,
	                      	@RequestParam(value="queryString", required = false, defaultValue="") String querystring) throws IllegalStateException, IOException {

		log.info("files :    : " + files); 
		log.info("Received request to update Todo with id: " + todoNo);
	    log.info("Files: " + files);
	    log.info("Delete Order: " + deleteOrder);
	    log.info("Update Order: " + updateOrder);
		
		inputTodo.setEmpCode(loginEmp.getEmpCode()); 
		
		if (files == null) {
	        files = new ArrayList<>();
	    }
		
				
		// 담당자 여러명인 경우 
	    String inChargeEmpStr = inputTodo.getInChargeEmp(); 
	    List<String> inChargeEmpList = Arrays.asList(inChargeEmpStr.split("\\s*,\\s*")); 

	    log.info("담당자 여러명일때 넘겨받은 리스트 : " + inChargeEmpList.toString());
		
		int result = service.todoUpdate(inputTodo, files, deleteOrder, updateOrder, inChargeEmpList); 
				
		return result; 
	     
	}
	
	
	 	/** 할 일 삭제 
	 	 * @param payload
	 	 * @return
	 	 */
	 	@PostMapping("delete")
	    public ResponseEntity<Map<String, Object>> todoDelete(@RequestBody Map<String, 
	    													List<Integer>> payload) {
		 
	        List<Integer> todoNos = payload.get("todoNos");
	        int result = service.todoDelete(todoNos);
	        
	        log.info("todoNos :: " + todoNos.toString());
	
	        Map<String, Object> response = new HashMap<>();
	        if (result > 0) {
	            response.put("success", true);
	            response.put("message", "삭제 되었습니다.");
	        } else {
	            response.put("success", false);
	            response.put("message", "삭제 실패");
	        }
	
	        return ResponseEntity.ok(response);
	    }
	 	
	 	 /** 할 일 완료 여부 수정 
	 	 * @param request
	 	 * @return
	 	 */
	 	@PostMapping("updateTodoComplete")
	     public ResponseEntity<String> updateTodoComplete(@RequestBody Todo request) {
	 		
	         try {
	        	 
	             boolean success = service.updateTodoComplete(request.getTodoNo(), request.getTodoComplete());
	             
	             if (success) {
	            	 
	                 return ResponseEntity.ok("{\"message\": \"Update successful\"}");
	                 
	             } else {
	            	 
	                 return ResponseEntity.status(500).body("{\"message\": \"Update failed\"}");
	             }
	         } catch (Exception e) {
	             // 예외 처리, 메시지 반환
	             e.printStackTrace();
	             return ResponseEntity.status(500).body("{\"message\": \"Internal Server Error: " + e.getMessage() + "\"}");
	         }
	     }
	    
	

}
