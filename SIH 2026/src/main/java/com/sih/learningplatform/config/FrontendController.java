package com.sih.learningplatform.config;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class FrontendController {
    @GetMapping({"/", "/dashboard", "/competency-gap", "/training", "/quiz-studio"})
    public String frontend() {
        return "forward:/index.html";
    }
}
