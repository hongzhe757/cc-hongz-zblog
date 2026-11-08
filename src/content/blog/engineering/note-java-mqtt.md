---
title: 'java实现简单的MQTT协议'
description: '<dependencies>'
pubDate: 'Jul 01, 2026'
heroImage: '../../../assets/blog-placeholder-3.jpg'
tags: ["笔记", "技术总结", "java"]
category: 'engineering'
---

# step1: 创建maven工程，添加maven依赖

```java

 <dependencies>
        <dependency>
            <groupId>org.eclipse.paho</groupId>
            <artifactId>org.eclipse.paho.client.mqttv3</artifactId>
            <version>1.1.0</version>
        </dependency>
 </dependencies>

```

# step2: 服务端类

```java

import org.eclipse.paho.client.mqttv3.*;
import org.eclipse.paho.client.mqttv3.persist.MemoryPersistence;

import java.util.Scanner;

public class ServiceMQTT {

    public static final String HOST = "tcp://localhost:1883";
    private String ServiceID = "ServiceFirst";
    private String topic;
    private MqttClient client;
    private MqttTopic mqttTopic;
    private MqttConnectOptions options;
    private String user = "admin";
    private String password = "public";

    private MqttMessage message;

    public ServiceMQTT() throws MqttException {
        //创建连接
        client = new MqttClient(HOST,ServiceID,new MemoryPersistence());
        options = new MqttConnectOptions();
        options.setCleanSession(false);
        options.setKeepAliveInterval(20);
        options.setConnectionTimeout(50);
        options.setUserName(user);
        options.setPassword(password.toCharArray());
        message = new MqttMessage();
    }

    public void getConnect(){
        try {
            client.setCallback(new PublishCallBack());
            client.connect(options);
            mqttTopic = client.getTopic(topic);
        } catch (MqttException e) {
            e.printStackTrace();
        }
    }

    public void publish(MqttTopic topic, MqttMessage message) throws MqttException {
        MqttDeliveryToken token = topic.publish(message);
        token.waitForCompletion();
        System.out.println("消息推送的状态--->"+token.isComplete());
    }


    public static void main(String[] args) throws MqttException {
        ServiceMQTT service = new ServiceMQTT();
        Scanner input = new Scanner(System.in);

        System.out.print("请输入消息的主题：");
        service.topic = input.next();

        System.out.print("请输入消息的内容：");
        String messageVal = input.next();

        service.getConnect();

        service.message.setQos(1);
        service.message.setRetained(true);
        service.message.setPayload(messageVal.getBytes());

        service.publish(service.mqttTopic,service.message);
        System.out.println("消息的保持状态："+service.message.isRetained());
    }
}



```

# step3: 客户端类

```java

import org.eclipse.paho.client.mqttv3.*;
import org.eclipse.paho.client.mqttv3.persist.MemoryPersistence;

import java.util.Scanner;

public class ClientMQTT {

    public static final String HOST = "tcp://localhost:1883";
    private static final String clientID = "clientFirst";
    private String TOPIC;
    private MqttClient client;
    private MqttConnectOptions options;
    private String user = "admin";
    private String password = "public";


    public void clientStart(){
        try {
            client = new MqttClient(HOST,clientID,new MemoryPersistence());
            options = new MqttConnectOptions();
            options.setCleanSession(true);
            options.setKeepAliveInterval(10);
            options.setConnectionTimeout(50);
            options.setUserName(user);
            options.setPassword(password.toCharArray());
            client.setCallback(new PublishCallBack());
            Scanner input = new Scanner(System.in);
            System.out.print("请输入订阅的主题：");
            TOPIC = input.next();
            MqttTopic topic = client.getTopic(TOPIC);
            //setWill方法，如果项目中需要知道客户端是否掉线可以调用该方法。设置最终端口的通知消息
            options.setWill(topic,"close".getBytes(),1,true);
            client.connect(options);
            int[] Qos = {1};
            String[] topic1 = {TOPIC};
            client.subscribe(topic1,Qos);
        } catch (MqttException e) {
            e.printStackTrace();
        }
    }

    public static void main(String[] args) throws MqttException {
        ClientMQTT clientMQTT = new ClientMQTT();
        clientMQTT.clientStart();
    }
}



```

# step4: 回调函数类

```java

import org.eclipse.paho.client.mqttv3.IMqttDeliveryToken;
import org.eclipse.paho.client.mqttv3.MqttCallback;
import org.eclipse.paho.client.mqttv3.MqttMessage;

public class PublishCallBack implements MqttCallback {
    public void connectionLost(Throwable throwable) {
        //连接断掉会执行到这里
        System.out.println("连接以断，请重新连接！！！");
    }

    public void messageArrived(String s, MqttMessage mqttMessage) throws Exception {
        //subscribe后会执行到这里
        System.out.println("消息的主题是："+s);
        System.out.println("消息的Qos是："+mqttMessage.getQos());
        System.out.println("消息的ID是："+mqttMessage.getId());
        System.out.println("消息的内容是："+new String(mqttMessage.getPayload()));
    }

    public void deliveryComplete(IMqttDeliveryToken iMqttDeliveryToken) {
        //publish可以执行到这里
        System.out.println("This is deliveryComplete method----->"+iMqttDeliveryToken.isComplete());
    }
}

```
