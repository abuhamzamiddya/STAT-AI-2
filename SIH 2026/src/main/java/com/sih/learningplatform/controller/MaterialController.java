package com.sih.learningplatform.controller;
import com.sih.learningplatform.service.*; import lombok.RequiredArgsConstructor; import org.springframework.http.*; import org.springframework.web.bind.annotation.*; import org.springframework.web.multipart.MultipartFile; import java.util.*;
@RestController @RequestMapping("/api/materials") @RequiredArgsConstructor @CrossOrigin(origins="*") public class MaterialController { private final DocumentParsingService parser; private final NlpAnalysisService nlp;
 @PostMapping(value="/extract",consumes=MediaType.MULTIPART_FORM_DATA_VALUE) public Map<String,Object> extract(@RequestPart("file") MultipartFile file){String text=parser.extractText(file);return Map.of("filename",file.getOriginalFilename(),"text",text,"analysis",nlp.analyze(text));}
 @PostMapping("/analyze") public Map<String,Object> analyze(@RequestBody Map<String,String> body){return nlp.analyze(body.getOrDefault("text",""));}
}
