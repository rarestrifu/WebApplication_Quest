package com.develop.nightout.controllers;

import com.develop.nightout.models.UserModel;
import com.develop.nightout.service.UserService;
import org.apache.catalina.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.parameters.P;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(
        origins = {"http://localhost:3000"},
        methods = {RequestMethod.GET, RequestMethod.POST},
        allowedHeaders = {"Content-Type", "Authorization"},
        allowCredentials = "true"
)
@RestController
@RequestMapping("/account")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/signup")
    public void saveUser(@RequestBody UserModel user) throws Exception{
        userService.saveUser(user);
    }
    @PostMapping("/login")
    public UserModel loginUser(@RequestBody UserModel user) throws Exception {
        // Retrieve user information from database
        UserModel userFromDatabase = userService.getUserByUsername(user.getUsername());

        // Check if user exists and if password matches
        if(userFromDatabase == null ) {
            throw new Exception("user doesn't exist");
        }

        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

        if(!passwordEncoder.matches(user.getPassword(), userFromDatabase.getPassword())) {
            throw new Exception("Invalid password");
        }

        // Return UserModel instance as response
        return userFromDatabase;
    }

    @DeleteMapping
    public void deleteUser(Long id){
        userService.deleteUser(id);
    }

    @PutMapping("/updateUser")
    public void updateUser(@RequestBody UserModel user){
        userService.updateUser(user, user.getId());
    }

    @GetMapping("/getAllUsers")
    public List<UserModel> getAllUsers(){
        return userService.getAllUsers();
    }

    @GetMapping("/leaderboard")
    public List<UserModel> sortByTokens(){ return userService.sortUsersByTokens();}

    @GetMapping("/user")
    public UserModel getUserDetails(@RequestParam(required=false) String email,
                                    @RequestParam(required=false) String username) throws Exception {

        // Retrieve user information from database
        UserModel userFromDatabase = null;
        if(email!=null){
            if(userService.getUserByEmail(email)!=null) {
                userFromDatabase = userService.getUserByEmail(email);
            }
        }
        else if(username!=null){
            if(userService.getUserByUsername(username)!=null) {
                userFromDatabase = userService.getUserByUsername(username);
            }
        }
        if(userFromDatabase == null){
            throw new Exception("User not found");
        }

        // Return UserModel instance as response
        return userFromDatabase;
    }


    @GetMapping("/usernameTaken")
    public boolean isUsernameTaken(@RequestParam String username) {
        return userService.isUsernameTaken(username);
    }

    @GetMapping("/emailTaken")
    public boolean isEmailTaken(@RequestParam String email) {
        return userService.isEmailTaken(email);
    }

    @GetMapping("/emailValid")
    public boolean isEmailValid(@RequestParam String email) {
        return userService.isValidEmail(email);
    }

    @GetMapping("/usernameValid")
    public boolean isUsernameValid(@RequestParam String username) {
        return userService.isValidUsername(username);
    }

    @GetMapping("/phoneValid")
    public boolean isPhoneValid(@RequestParam String phone) {
        return userService.isValidPhoneNumber(phone);
    }

    @GetMapping("/passwordValid")
    public boolean isPassword(@RequestParam String password) {
        return userService.isValidPassword(password);
    }

    @GetMapping("/isUsernamesPassword")
    public boolean isUsernamesPassword(@RequestParam String username, @RequestParam String password) throws Exception {
        UserModel user = userService.getUserByUsername(username);
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        System.out.println("passed pass is: " + password);
        System.out.println(user.getPassword());

        // Hash the user-entered password
        String hashedPassword = passwordEncoder.encode(password);
        System.out.println(hashedPassword);

        if (passwordEncoder.matches( password,user.getPassword())) {
            System.out.println("password match");
            return true;
        } else {
            System.out.println("password doesn't match");
            throw new Exception("no match");
        }
    }

    @GetMapping("/getUserByUsername")
    public UserModel getUser(@RequestParam String username){
        return userService.getUserByUsername(username);
    }

    @GetMapping("/solved-quests")
    public List<Long> getUserSolvedQuestIds(@RequestParam String username) {
        UserModel user = userService.getUserByUsername(username);
        return user.getSolvedQuestIds();
    }

}
