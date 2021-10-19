package com.arun;

import java.util.LinkedList;
import java.util.List;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;

@Controller
public class Controllers {

	private int id = 1;
	private int liveId = 1;
	private List<Live> liveList;

	public Controllers() {
		liveList = new LinkedList<>();
	}

	@MessageMapping("/message")
	@SendTo("/topic/return-to")
	public Message getMessage(@RequestBody Message message) {
		message.setId(id++);
		return message;
	}

//	@MessageMapping("/setlive")
//	@SendTo("/topic/getAllLive")
//	public List<Live> getLive(@RequestBody Live live) {
//		live.setId(liveId++);
//		liveList.add(live);
//		System.out.println("live => " + live);
//		return liveList;
//	}

}
