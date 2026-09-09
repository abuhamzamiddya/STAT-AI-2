package com.sih.learningplatform.service;
import org.apache.tika.Tika; import org.springframework.stereotype.Service; import org.springframework.web.multipart.MultipartFile; import java.io.*;
@Service public class DocumentParsingService { private final Tika tika=new Tika(); public String extractText(MultipartFile file){try{return tika.parseToString(file.getInputStream());}catch(IOException e){throw new IllegalArgumentException("Unable to read document: "+e.getMessage(),e);}} }
