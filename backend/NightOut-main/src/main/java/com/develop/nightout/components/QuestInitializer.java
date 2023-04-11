package com.develop.nightout.components;

import com.develop.nightout.models.QuestModel;
import com.develop.nightout.repository.QuestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.util.Arrays;
import java.util.List;

@Component
public class QuestInitializer {
    @Autowired
    private QuestRepository questRepository;

    @PostConstruct
    public void init() {
        List<QuestModel> quests = Arrays.asList(
            new QuestModel(1L,"What is 2+2 equal to?","A boost question to give you tokens.","Admin","4",0,1),
            new QuestModel(2L,"Who is the father of modern physics?","Pretty interesting question, right?","Admin","Newton",0,2),
            new QuestModel(3L,"What is the capital of China?","Though one.","Admin","Beijing",0,3)
        );
        questRepository.saveAll(quests);
    }
}
