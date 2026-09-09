package com.sih.learningplatform.exception;
import lombok.*; import java.time.*; import java.util.*;
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ErrorResponse { private int status; private String error; private String message; private String path; private Map<String,String> validationErrors; @Builder.Default private LocalDateTime timestamp=LocalDateTime.now(); }
