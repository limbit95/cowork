package com.cowork.common.nlp;

import opennlp.tools.util.ObjectStream;

import java.io.IOException;
import java.util.List;

public class ListObjectStream<T> implements ObjectStream<T> {
	
		private final List<T> list; 
		private int index; 
		
		public ListObjectStream(List<T> list) {
			this.list = list; 
		}
	
		@Override
	    public T read() throws IOException {
	        if (index < list.size()) {
	            return list.get(index++);
	        }
	        return null;
	    }

	    @Override
	    public void reset() throws IOException, UnsupportedOperationException {
	        index = 0;
	    }

	    @Override
	    public void close() throws IOException {
	    
	    }

}
