package com.selab.labspace;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@ComponentScan(basePackages = "com.selab.labspace")
@EnableJpaRepositories(basePackages = "com.selab.labspace.repository")
public class LabspaceApplication {

    public static void main(String[] args) {
        SpringApplication.run(LabspaceApplication.class, args);
    }
}