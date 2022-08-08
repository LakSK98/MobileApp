import {View, Text, StyleSheet} from 'react-native';
import React, {useState, useCallback, useEffect} from 'react';
import {Bubble, GiftedChat, Send} from 'react-native-gifted-chat';
import {LocalNotification} from '../Services/LocalPushController';
import notifee, {EventType} from '@notifee/react-native';
import {AndroidColor} from '@notifee/react-native';

function modelMessages(data){
  {
    let messages = [];
    data.map((message,index)=>{
      messages.push({
        _id: index,
        text: message.content,
        createdAt: message.createdAt,
        user: {
          _id: message.sender._id,
          name: message.sender.name,
          avatar: 'https://placeimg.com/140/140/any',
        }}
        );
    });
    return messages;
  }
};

export default function ChatsScreen({route}) {
  const [messages, setMessages] = useState([]);

  async function onDisplayNotification() {
    await notifee.requestPermission();

    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
    });

    await notifee.displayNotification({
      title: 'Notification Title',
      body: 'Main body content of the notification',
      android: {
        channelId,
        smallIcon: 'name-of-a-small-icon', // optional, defaults to 'ic_launcher'.
        // pressAction is needed if you want the notification to open the app when pressed
        pressAction: {
          id: 'default',
        },
      },
    });
  }

  const getToken = async()=>{
    return await fetch(`http://10.0.2.2:8000/api/login/`,{
      method:"POST",
      headers:{
        'Content-Type':'application/json'
      },
      body: JSON.stringify({
        email:"jokeekak@gmail.com",
        password:"Lak1234"
      })
    })
      .then((res)=>{
        return res.data.token;
      })
      .catch((err)=>{
        return null;
      });
  }

  useEffect(()=>{
    const token = getToken();
    if(token!==null){
    fetch(`http://10.0.2.2:8000/api/message/${route.params.chatId}`,{ headers : {Authorization:`Bearer ${token}`}})
      .then((res)=>{
        setMessages(modelMessages(res.data));
      })
      .catch((err)=>{
        console.log(err);
      });
    }
  },[]);

  // useEffect(() => {
  //   setMessages([
  //     {
  //       _id: 1,
  //       text: 'Hello developer',
  //       createdAt: new Date(),
  //       user: {
  //         _id: 2,
  //         name: 'React Native',
  //         avatar: 'https://placeimg.com/140/140/any',
  //       },
  //     },
  //     {
  //       _id: 2,
  //       text: 'Hello',
  //       createdAt: new Date(),
  //       user: {
  //         _id: 1,
  //         name: 'React Native',
  //         avatar: 'https://placeimg.com/140/140/any',
  //       },
  //     },
  //   ]);
  // }, []);

  const onSend = useCallback((messages = []) => {
    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, messages),
    );
    onDisplayNotification();
  }, []);

  const renderBubble = props => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#0EA35D',
          },
        }}
      />
    );
  };

  return (
    <GiftedChat
      messages={messages}
      onSend={messages => onSend(messages)}
      user={{
        _id: 1,
      }}
      renderBubble={renderBubble}
      alwaysShowSend={true}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
