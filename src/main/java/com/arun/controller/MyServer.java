package com.arun.controller;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.Scanner;

import org.springframework.stereotype.Component;

@Component
 class MyServer {

	private BufferedReader in;
	private PrintWriter out;
	
	
	public MyServer() {
		try {
		ServerSocket sk = new ServerSocket(8888);
		System.out.println("server is start.....");
		Socket s = sk.accept();
		System.out.println("Connection accepted...");
		in = new BufferedReader(new InputStreamReader(s.getInputStream()));
		out = new PrintWriter(s.getOutputStream());
		
		startReading();
		startWriting();

		
		}catch (Exception e) {
			System.out.println(e.getLocalizedMessage());
		}
	}
	
	private void startReading() {
		Runnable r = () -> {
			boolean stop = false;
				do {
					try {

						String msg= in.readLine();
						System.out.println("Client : "+msg);
						if(msg.equals("exit"))
						{	stop = true; 
							out.close();
						}
					} catch (Exception e) {
						System.out.println("client stop");
						System.out.println(e.getLocalizedMessage());
					}
			} while(stop == false);
		};
		Thread  t = new Thread(r);
		t.start();
	
	}
	
	private void startWriting() {
		
		Runnable r = () -> {
			try {
			while (true) {
				Scanner input = new Scanner(System.in);
				String msg =input.nextLine();
				out.println(msg);
				out.flush();
			}
			}catch (Exception e) {
				throw new RuntimeException("Client Stop Chating");
			}
		};
		Thread  t = new Thread(r);
		t.start();
		
	}
	
}
