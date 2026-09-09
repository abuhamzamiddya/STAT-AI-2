package com.sih.learningplatform.exception;
import jakarta.servlet.http.HttpServletRequest; import org.springframework.http.*; import org.springframework.validation.FieldError; import org.springframework.web.bind.MethodArgumentNotValidException; import org.springframework.web.bind.annotation.*; import java.time.*; import java.util.*;
@RestControllerAdvice public class GlobalExceptionHandler {
 @ExceptionHandler(ResourceNotFoundException.class) public ResponseEntity<ErrorResponse> notFound(ResourceNotFoundException e,HttpServletRequest r){return body(404,"Not Found",e.getMessage(),r.getRequestURI(),null);}
 @ExceptionHandler(AiServiceException.class) public ResponseEntity<ErrorResponse> ai(AiServiceException e,HttpServletRequest r){return body(502,"Bad Gateway",e.getMessage(),r.getRequestURI(),null);}
 @ExceptionHandler(MethodArgumentNotValidException.class) public ResponseEntity<ErrorResponse> validation(MethodArgumentNotValidException e,HttpServletRequest r){Map<String,String> m=new HashMap<>();for(FieldError f:e.getBindingResult().getFieldErrors())m.put(f.getField(),f.getDefaultMessage());return body(400,"Validation Failed","Request payload contains validation errors",r.getRequestURI(),m);}
 @ExceptionHandler(Exception.class) public ResponseEntity<ErrorResponse> general(Exception e,HttpServletRequest r){return body(500,"Internal Server Error","An unexpected internal error occurred.",r.getRequestURI(),null);}
 private ResponseEntity<ErrorResponse> body(int s,String err,String msg,String path,Map<String,String> v){return ResponseEntity.status(s).body(ErrorResponse.builder().status(s).error(err).message(msg).path(path).validationErrors(v).timestamp(LocalDateTime.now()).build());}
}
