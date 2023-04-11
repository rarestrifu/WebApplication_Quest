package com.develop.nightout.repository;
import com.develop.nightout.models.UserModel;
import org.apache.catalina.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<UserModel, Long> {
    <Optional> UserModel findByEmail(String email);
    <Optional> UserModel findByUsername(String username);

}
