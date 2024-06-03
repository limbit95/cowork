package com.cowork.common.nlp;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;


import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RequestMapping("/chatbot")
@Controller
public class ChatbotController {
	
	private final NLPModel nlpModel; 
	
	@GetMapping("")
	public String chatbot() {
		return "common/chatbot"; 
	}
	
	@ResponseBody
	@PostMapping
    public ChatbotResponse chatbot(@RequestBody ChatbotRequest request) {
        String question = request.getMessage();
        String response = nlpModel.categorize(question);
        return new ChatbotResponse(response);
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

        public ChatbotResponse(String response) {
            this.response = response;
        }

        public String getResponse() {
            return response;
        }

        public void setResponse(String response) {
            this.response = response;
        }
    } 

}
