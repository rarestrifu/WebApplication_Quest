package com.develop.nightout.controllers;

import com.develop.nightout.models.QuestModel;
import com.develop.nightout.service.QuestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(
        origins = {"http://localhost:3000"},
        methods = {RequestMethod.GET, RequestMethod.POST},
        allowedHeaders = {"Content-Type", "Authorization"},
        allowCredentials = "true"
)
@RestController
@RequestMapping("/Quests")
public class QuestController {

    @Autowired
    private QuestService questService;

    @GetMapping("/displayAll")
    public List<QuestModel> getAllQuests(){
        return questService.getAllQuests();
    }
    @PostMapping("/addQuest")
    public void addQuest(@RequestBody QuestModel quest) throws Exception{
        questService.addQuest(
                quest.getName(),
                quest.getDescription(),
                quest.getUsername(),
                quest.getAnswer(),
                quest.getTokens_required(),
                quest.getTokensGained()
        );
    }
}
