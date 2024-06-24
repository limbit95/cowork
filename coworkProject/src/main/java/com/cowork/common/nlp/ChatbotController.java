package com.cowork.common.nlp;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;


import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
@RequestMapping("/chatbot")
@Controller
public class ChatbotController {
	
	private final NLPModel nlpModel; 
	
	@GetMapping("")
	public String chatbot() {
		return "common/chatbot"; 
	}
	
	// 챗봇 응답 
	@ResponseBody
	@PostMapping
    public ChatbotResponse chatbot(@RequestBody ChatbotRequest request) {
		
        String question = request.getMessage();
        String response = nlpModel.categorize(question);
        
        List<String> imageUrls = new ArrayList<>(); 
        
        if(question.equals("특정 질문1")) {
        	
        	imageUrls.add("/images/addrDes.png"); 
        	
        } else if(question.equals("특정질문")) {
        	
        	imageUrls.add("/images/todo1.png"); 
        }
        
        log.info("response : {}, images : {}" , response, imageUrls); 
        
        
        return new ChatbotResponse(response, imageUrls);
    }

    public static class ChatbotRequest {
    	
        private String message;

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }
    }

    public static class ChatbotResponse {
    	
        private String response;
        private List<String> imageUrls; // 이미지 응답용 
        
       

        public ChatbotResponse(String response, List<String> imageUrls) {
            this.response = response;
            this.imageUrls = imageUrls; 
        }

        public String getResponse() {
            return response;
        }

        public void setResponse(String response) {
            this.response = response;
        }
        
        public List<String> getImageUrls() {
            return imageUrls;
        }

        public void setImageUrls(List<String> imageUrls) {
            this.imageUrls = imageUrls;
        }
    } 

}
