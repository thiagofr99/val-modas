package com.devthiagofurtado.valmodas.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

import javax.naming.AuthenticationException;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class InvalidJwtAuthenticationException extends AuthenticationException{

    private static final long serialVersionUID = 1L;

    public InvalidJwtAuthenticationException(String exception) {
        super(exception);
    }

}

