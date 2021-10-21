package com.arun.controller;

import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.Map;
import java.util.Set;
import java.util.TreeSet;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import com.arun.entity.Live;
import com.arun.entity.Message;

@Controller
public class Controllers {

	private int id = 1;
	private Set<Live> liveList;
	private Map<String, Object> map;

	public Controllers() {
		liveList = new LinkedHashSet<>();
		map = new LinkedHashMap<>();
		map.put("type", "LIST");
	}

	@MessageMapping("/message")
	@SendTo("/topic/return-to")
	public Message getMessage(@Payload Message message) {
		message.setId(id++);
		return message;
	}

	@MessageMapping("/setlive")
	@SendTo("/topic/return-to")
	public Map<String, Object> getLive(@Payload Live live) {
		if (live.isJoin())
			liveList.add(live);
		else
			liveList.removeIf(x -> x.getId().equals(live.getId()));
		map.put("list", new TreeSet<>(liveList));
		return map;
	}

	@MessageMapping("/liveStrem")
	@SendTo("/topic/getLiveStremData")
	public String getLive(@Payload String data) {
		return data;
	}

}
