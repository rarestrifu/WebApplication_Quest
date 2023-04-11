package com.develop.nightout.service;


import com.develop.nightout.models.UserModel;
import com.develop.nightout.repository.UserRepository;
import org.apache.catalina.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
public class UserService implements UserDetailsService {

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserRepository userRepository;

    public List<UserModel> getAllUsers(){
        return userRepository.findAll();
    }

    public List<UserModel> sortUsersByTokens(){
        List<UserModel> users = userRepository.findAll();
        List<UserModel> sortedList = users.stream()
                .sorted(Comparator.comparingInt(UserModel::getTokens).reversed())
                .collect(Collectors.toList());
        for(int i=0;i<sortedList.size();i++){
            System.out.println(i+sortedList.get(i).getUsername());
        }
        return sortedList;
    }

    public boolean isUsernameTaken(String username){
        UserModel user = userRepository.findByUsername(username);
        return user != null;
    }

    public boolean isEmailTaken(String email){
        UserModel user = userRepository.findByEmail(email);
        return user != null;
    }

    public UserModel getUserByEmail(String email){
        UserModel optionalUser = userRepository.findByEmail(email);
        if (optionalUser!=null) {
            return optionalUser;
        } else {
            throw new RuntimeException("User not found");
        }
    }

    public UserModel getUserByUsername(String username){
        UserModel optionalUser = userRepository.findByUsername(username);
        if (optionalUser!=null) {
            return optionalUser;
        } else {
            throw new RuntimeException("User not found");
        }
    }


    public boolean isValidEmail(String email){
        String regex = "^[a-zA-Z][\\w\\-._]*[a-zA-Z0-9]@[a-zA-Z0-9]+(\\.[a-zA-Z]+)+$";
        Pattern pattern = Pattern.compile(regex);
        Matcher matcher = pattern.matcher(email);
        return matcher.matches();
    }

    public boolean isValidUsername(String username){
        String regex = "[a-zA-Z0-9]+";
        Pattern pattern = Pattern.compile(regex);
        Matcher matcher = pattern.matcher(username);
        return matcher.matches();
    }

    public boolean isValidPhoneNumber(String phone){
        String regex = "\\d{10}";
        Pattern pattern = Pattern.compile(regex);
        Matcher matcher = pattern.matcher(phone);
        return matcher.matches();
    }


    public boolean isValidPassword(String password){
        String regex = "^.{8,}$";
        Pattern pattern = Pattern.compile(regex);
        Matcher matcher = pattern.matcher(password);
        return matcher.matches();
    }

    public void saveUser(UserModel user) {
        if (userRepository.findByEmail(user.getEmail()) == null && userRepository.findByUsername(user.getUsername()) == null) {
            if (!isValidEmail(user.getEmail())) {
                ResponseStatusException exception = new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Email not valid");
                throw exception;
            }
            if (!isValidUsername(user.getUsername())) {
                ResponseStatusException exception = new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Username not valid");
                throw exception;
            }
            if (!isValidPhoneNumber(user.getPhoneNumber())) {
                ResponseStatusException exception = new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Phone number not valid");
                throw exception;
            }
            if (!isValidPassword(user.getPassword())) {
                ResponseStatusException exception = new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Password not valid");
                throw exception;
            }
            user.setPassword(passwordEncoder.encode(user.getPassword()));
            userRepository.save(user);
        } else {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "User already exists");
        }
    }

    public void deleteUser(Long id){
        userRepository.deleteById(id);
    }

    public void updateUser(UserModel updateUser, Long id){
        UserModel user = userRepository
                .findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setEmail(updateUser.getEmail());
        user.setUsername(updateUser.getUsername());
        user.setPassword(updateUser.getPassword());
        user.setPhoneNumber(updateUser.getPhoneNumber());
        user.setDateOfBirth(updateUser.getDateOfBirth());
        user.setRankingName(updateUser.getRankingName());
        user.setRankingNumber(updateUser.getRankingNumber());
        user.setTokens(updateUser.getTokens());
        user.setBadgeURL(updateUser.getBadgeURL());
        user.setUserIconURL(updateUser.getUserIconURL());
        user.setSolvedQuestIds(updateUser.getSolvedQuestIds());

        userRepository.save(user);
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        if(userRepository.findByEmail(username) == null)
            throw new UsernameNotFoundException("Email not found!");
        return userRepository.findByEmail(username);
    }


}
