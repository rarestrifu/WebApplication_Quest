package com.develop.nightout.repository;
import com.develop.nightout.models.QuestModel;
import com.develop.nightout.models.UserModel;
import org.apache.catalina.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface QuestRepository extends JpaRepository<QuestModel, Long> {
    Optional<QuestModel> findQuestByUsername(String username);

    QuestModel findTopByOrderByIdDesc();
}
