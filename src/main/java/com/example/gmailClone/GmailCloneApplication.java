package com.example.gmailClone;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class GmailCloneApplication {

	public static void main(String[] args) {
		SpringApplication.run(GmailCloneApplication.class, args);
	}

}
