package com.develop.nightout.config;

import com.develop.nightout.service.UserService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.authentication.logout.LogoutSuccessHandler;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import java.util.Arrays;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain config(HttpSecurity http) throws Exception{
        return http
                    .csrf().disable()
                    .cors().and()
                    .authenticationProvider(authenticationProvider())
                    .authorizeHttpRequests()
                    .antMatchers("/account/signup").permitAll()
                    .antMatchers("/account/admin").hasAuthority("ROLE_Admin")
                    .and()
                    .authorizeHttpRequests()
                    .antMatchers("/account","/swagger").authenticated()
                    .and()
                    .formLogin()
                    .loginPage("http://localhost:3000/login")
                    .loginProcessingUrl("/login")
                    .successHandler(successHandler())
                    .failureHandler(failureHandler())
                    .and()
                    .logout()
                    .clearAuthentication(true)
                    .logoutSuccessHandler(logoutSuccessHandler())
                    .and()
                    .httpBasic()
                    .and()
                    .build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000"));
        configuration.setAllowCredentials(true);
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE"));
        configuration.setAllowedHeaders(Arrays.asList("Content-Type", "Authorization"));
        configuration.setExposedHeaders(Arrays.asList("Set-Cookie"));
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);

        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }

    @Bean
    public UserDetailsService userDetailsService(){
        return new UserService();
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider(){
        DaoAuthenticationProvider auth = new DaoAuthenticationProvider();
        auth.setUserDetailsService(userDetailsService());
        auth.setPasswordEncoder(passwordEncoder());
        return auth;
    }

    @Bean
    public AuthenticationSuccessHandler successHandler(){
        return new SuccessHandler();
    }

    @Bean
    public AuthenticationFailureHandler failureHandler(){
        return new FailureHandler();
    }

    @Bean
    public LogoutSuccessHandler logoutSuccessHandler(){
        return new SuccessLogoutHandler();
    }
}
