package com.example.TaskManagement.service;

import java.net.IDN;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    public String emailToUnicode(String email) {
        int atIndex = email.lastIndexOf("@");
        if (atIndex > 0 && atIndex < email.length() - 1) {
            String local = email.substring(0, atIndex);
            String domain = email.substring(atIndex + 1);
            String unicodeDomain = IDN.toUnicode(domain);
            return local + "@" + unicodeDomain;
        }
        return email;
    }
}
