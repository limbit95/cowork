package com.cowork.employee.chatting.model.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import com.cowork.employee.chatting.model.mapper.ChatMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Transactional
@Slf4j
@Service
@RequiredArgsConstructor
@PropertySource("classpath:/config.properties")
public class GPTServiceImpl implements GPTService {
    
    private final RestTemplate restTemplate;
    
    @Value("${gpt.api.key}")
    private String gptApiKey; // gpt api 키 

    private static final int MAX_RETRIES = 5;
    private static final long RETRY_DELAY_MS = 60000; // 60 seconds
    
    @Override
    public String translate(String content, String targetLanguage) {
        String url = "https://api.openai.com/v1/chat/completions"; // gpt 엔드포인트 

        HttpHeaders headers = new HttpHeaders(); //HTTP 요청 헤더 
        headers.set("Authorization", "Bearer " + gptApiKey); // Authorization 에 API 키 담아줌 
        headers.set("Content-Type", "application/json"); // 내가 보내는 HTTP 요청 바디의 타입 

        Map<String, Object> request = new HashMap<>(); // Map 자료구조 만듦.  
        String prompt = String.format("Translate the following text to %s and only provide the translation: %s", targetLanguage, content);
        request.put("model", "gpt-3.5-turbo"); // 사용하고자 하는 GPT 모델의 이름 
        request.put("messages", List.of( // 불변하는 List 요소를 만드는 법 add 대신 .of를 쓰면 됨 
            Map.of("role", "system", "content", "You are a helpful assistant."), // Map도 .of 쓰면 불변함.
            // role 과 content 가 key 이고, system 과 you are a helpful assistant 가 value 이다. 
            // role 에는 system 과 user 가 있는 거 같음. 
            // system(gpt) 이고, user 는 나 인듯. 
            // 잘은 모르지만, 대화의 맥락을 잡도록 하며, 적절한 답변이 생성되도록 하는데 도움을 준다고 함. 
            
            Map.of("role", "user", "content", prompt)
            // user 라는 role 에서 prompt 를 제공한다는 뜻이겠지. 
        ));
        request.put("max_tokens", 100); // 최대 토큰을 100으로 설정함. 보통 단어 하나당 3~4개의 토큰이라고 함. 
        
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(request, headers);

        for (int attempt = 1; attempt <= MAX_RETRIES; attempt++) {
            try {
                ResponseEntity<Map<String, Object>> response = restTemplate.exchange(url, HttpMethod.POST, entity, (Class<Map<String, Object>>)(Class<?>)Map.class);
                
                log.debug("response===={}", response);

                Map<String, Object> responseBody = response.getBody();
                List<Map<String, Object>> choices = (List<Map<String, Object>>) responseBody.get("choices");
                Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");
                String translatedText = (String) message.get("content");

                log.debug("translated text === {}", translatedText); // Nice to meet you 만 옴. 

                return translatedText.trim();
            } catch (HttpClientErrorException.TooManyRequests e) {
                if (attempt == MAX_RETRIES) {
                    throw e;
                }
                log.warn("Request failed, attempt {} of {}: {}", attempt, MAX_RETRIES, e.getMessage());
                try {
                    Thread.sleep(RETRY_DELAY_MS);
                } catch (InterruptedException ie) {
                    Thread.currentThread().interrupt();
                }
            }
        }
        return null;
    }
}
