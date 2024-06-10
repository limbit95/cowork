package com.cowork.common.nlp;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;

@Component
@PropertySource("classpath:/config.properties")
public class Stopword {

    private static Set<String> stopWords = new HashSet<>();

    @Value("${nlp.stopword.data.path}")
    private String stopwordDataPath;

    @PostConstruct
    public void init() {
        loadStopWords();
    }

    private void loadStopWords() {
        try (BufferedReader br = new BufferedReader(new FileReader(stopwordDataPath))) {
            String line;
            while ((line = br.readLine()) != null) {
            	stopWords.add(line.trim());
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public static boolean isStopWord(String word) {
        return stopWords.contains(word);
    }
}
