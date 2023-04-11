package com.develop.nightout.service;

import com.develop.nightout.models.QuestModel;
import com.develop.nightout.repository.QuestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class QuestService {

    @Autowired
    private QuestRepository questRepository;

    public List<QuestModel> getAllQuests() {
        return questRepository.findAll();
    }

    public void addQuest(String name,
                               String description,
                               String username,
                               String answer,
                               int tokens_required,
                               int tokensGained){
        if (name == null || name.isEmpty()) {
            throw new IllegalArgumentException("Quest name cannot be empty");
        }
        if (description == null || description.isEmpty()) {
            throw new IllegalArgumentException("Quest description cannot be empty");
        }
        if (username == null || username.isEmpty()) {
            throw new IllegalArgumentException("Quest username cannot be empty");
        }
        if(tokensGained==0){
            throw new IllegalArgumentException("You need to give at least 1 token as a reward");
        }

        Long id = questRepository.findTopByOrderByIdDesc().getId()+1;
        QuestModel addedQuest = new QuestModel(id,
                name,
                description,
                username,
                answer,
                tokens_required,
                tokensGained);

        questRepository.save(addedQuest);
    }






}
