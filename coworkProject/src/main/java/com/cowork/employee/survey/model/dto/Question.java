package com.cowork.employee.survey.model.dto;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.cowork.employee.chatting.model.dto.ChatMessage;
import com.cowork.employee.chatting.model.dto.ChatMessage.MessageType;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Builder // 인스턴스 쉽게 만들게해줌.
public class Question {
    private String type;
    private String title;
    private List<String> options;

}
