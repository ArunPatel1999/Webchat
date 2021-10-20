package com.arun.controller;

import java.util.LinkedList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.user.SimpUser;
import org.springframework.messaging.simp.user.SimpUserRegistry;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;

import com.arun.entity.Live;
import com.arun.entity.Message;

@Controller
public class Controllers {

	private int id = 1;
	private int liveId = 1;
	private List<Live> liveList;

	private final SimpUserRegistry simpUserRegistry;

	public Controllers(SimpUserRegistry simpUserRegistry) {
        this.simpUserRegistry = simpUserRegistry;
        liveList = new LinkedList<>();
	}
	

	public void connectedEquipments() {
	    System.out.println( this.simpUserRegistry);
	}

	@MessageMapping("/message")
	@SendTo("/topic/return-to")
	public Message getMessage(@RequestBody Message message) {
		message.setId(id++);
		connectedEquipments();
		return message;
	}

	@MessageMapping("/setlive")
	@SendTo("/topic/getAllLive")
	public List<Live> getLive(@RequestBody Live live) {
		live.setId(liveId++);
		liveList.add(live);
		return liveList;
	}
	
	
	
}
