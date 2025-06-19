package com.circuitlearn.dto;

/**
 * DTO para encapsular as credenciais de login (email e senha) na requisição.
 */
public class LoginRequestDTO {
    private String email;
    private String password;

    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }
    public String getPassword() {
        return password;
    }
    public void setPassword(String password) {
        this.password = password;
    }
}