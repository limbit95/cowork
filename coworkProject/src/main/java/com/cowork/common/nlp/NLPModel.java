package com.cowork.common.nlp;


import java.io.FileInputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.stereotype.Component;

import lombok.extern.slf4j.Slf4j;
import opennlp.tools.doccat.DoccatFactory;
import opennlp.tools.doccat.DoccatModel;
import opennlp.tools.doccat.DocumentCategorizerME;
import opennlp.tools.doccat.DocumentSample;
import opennlp.tools.doccat.DocumentSampleStream;

import opennlp.tools.util.InputStreamFactory;
import opennlp.tools.util.ObjectStream;
import opennlp.tools.util.PlainTextByLineStream;
import opennlp.tools.util.TrainingParameters;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


@Slf4j
@Component
@PropertySource("classpath:/config.properties")
public class NLPModel {
	
	
		private static final Logger log = LoggerFactory.getLogger(NLPModel.class);

	    private final String trainingDataPath;

	    private DocumentCategorizerME categorizer;

	    public NLPModel(@Value("${nlp.training.data.path}") String trainingDataPath) throws IOException {
	        this.trainingDataPath = trainingDataPath;
	        initializeModel();
	    }

	    private void initializeModel() throws IOException {
	        log.info("모델 초기화 시작");
	        InputStreamFactory inputStreamFactory = () -> new FileInputStream(trainingDataPath);

	        try (ObjectStream<String> lineStream = new PlainTextByLineStream(inputStreamFactory, StandardCharsets.UTF_8);
	             ObjectStream<DocumentSample> sampleStream = new DocumentSampleStream(lineStream) {
	                 @Override
	                 public DocumentSample read() throws IOException {
	                     String line = lineStream.read();
	                     if (line == null) {
	                         return null;
	                     }
	                     String[] parts = line.split(",", 2);
	                     if (parts.length != 2) {
	                         return null;
	                     }
	                     String[] tokens = parts[0].trim().split("\\s+");
	                     return new DocumentSample(parts[1].trim(), tokens);
	                 }
	             }) {

	            log.info("모델 학습 시작...");

	            TrainingParameters params = new TrainingParameters();
	            params.put(TrainingParameters.ITERATIONS_PARAM, 100);
	            params.put(TrainingParameters.CUTOFF_PARAM, 1);

	            DoccatModel model = DocumentCategorizerME.train("ko", sampleStream, params, new DoccatFactory());
	            this.categorizer = new DocumentCategorizerME(model);

	            log.info("모델이 학습을 성공적으로 완료했습니다~");
	        }
	    }
	    
	    public String categorize(String text) {
	        String[] tokens = text.split("\\s+");
	        //double[] outcomes = categorizer.categorize(tokens);
	        //String category = categorizer.getBestCategory(outcomes);
	        //return category;
	        
	     // 입력 문장 전처리
			List<String> docWordsList = preprocess(text); // 입력된 증상을 단어로 분리
			String[] docWords = docWordsList.toArray(new String[0]);
			double[] outcomes = categorizer.categorize(tokens); // 분류 결과 얻기

			log.info("단어 배열 {}", docWords);
			log.info("카테고리 일치 확률 {}", outcomes);

			return categorizer.getBestCategory(outcomes); // 가장 가능성이 높은 카테고리 반환
	        
	    }

		private List<String> preprocess(String text) {
			log.info("전처리 시작...");
			// 불필요한 공백 및 특수문자 제거
			text = text.trim().replaceAll("[^가-힣a-zA-Z0-9\\s]", ""); // 한글, 영문자, 숫자, 공백을 제외한 모든 문자를 제거
			String[] words = text.split("\\s+"); // 하나 이상의 공백 문자를 의미

			// 불용어 필터링 및 n-그램 생성 (1-그램 및 2-그램)
			List<String> ngrams = new ArrayList<>();
			
			for (int i = 0; i < words.length; i++) { // words 각 요소 순회
				
				if (!Stopword.isStopWord(words[i])) { // 불용어 필터링
					
					ngrams.add(words[i]); // 1-그램(단일 단어) 추가
					
					// 현재 단어가 배열의 마지막 단어가 아니고, 다음단어도 불용어가 아닐 때
					if (i < words.length - 1 && !Stopword.isStopWord(words[i + 1])) {
						ngrams.add(words[i] + " " + words[i + 1]); // 2-그램 추가
					}
				}
				
			}
			
			log.info("전처리 완료!");
			return ngrams;
		}
	
	    
}



/*
 * Performing 100 iterations. 1: ... loglikelihood=-776.9180683866715
 * 0.1111111111111111 2: ... loglikelihood=-462.24446061968683
 * 0.9845679012345679 3: ... loglikelihood=-325.71850864498776
 * 0.9938271604938271 4: ... loglikelihood=-250.64916359131857
 * 0.9969135802469136 5: ... loglikelihood=-203.27878242612152
 * 0.9969135802469136 6: ... loglikelihood=-170.73873097026637
 * 0.9969135802469136 7: ... loglikelihood=-147.06011520444238
 * 0.9969135802469136 8: ... loglikelihood=-129.09185726567983 1.0 9: ...
 * loglikelihood=-115.01237709784371 1.0 10: ...
 * loglikelihood=-103.69578688623884 1.0
 * 
 * 순서대로 Iteration (반복) - 모델 학습이 몇 번째 반복되는지 loglikelihood (로그우도) - 현재 모델이 데이터를
 * 얼마나 잘 설명하는지(값이 작을수록 모델이 데이터 설명을 더 잘함) Accuracy (정확도) - 학습 데이터에 대한 모델의 정확도(0과
 * 1 사이의 값으로 표시되며, 1에 가까울수록 정확도가 높음)
 * 
 * 
 */
