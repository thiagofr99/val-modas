package com.devthiagofurtado.valmodas.util;

import com.devthiagofurtado.valmodas.exception.ResourceBadRequestException;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.http.HttpServletRequest;
import java.util.Optional;

public class HeaderUtil {

    public static String obterToken() {

        Optional<HttpServletRequest> optHttpRequest = obterHttpRequestAtual();

        if (optHttpRequest.isPresent()) {

            return optHttpRequest.get().getHeader("Authorization") == null ? null : optHttpRequest.get().getHeader("Authorization");
        }

        throw new ResourceBadRequestException("Request HTTP não obtido.");
    }

    // recuperando a request atual
    public static Optional<HttpServletRequest> obterHttpRequestAtual() {
        return Optional.ofNullable(RequestContextHolder.getRequestAttributes())
                .filter(ServletRequestAttributes.class::isInstance)
                .map(ServletRequestAttributes.class::cast)
                .map(ServletRequestAttributes::getRequest);
    }
}
