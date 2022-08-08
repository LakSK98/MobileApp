import React, {useEffect, useState} from 'react';
import {View, Text, Button, StyleSheet, FlatList} from 'react-native';
import notifee from '@notifee/react-native';
import {Searchbar} from 'react-native-paper';

import {
  Container,
  Card,
  UserInfo,
  UserImgWrapper,
  UserImg,
  UserInfoText,
  UserName,
  PostTime,
  MessageText,
  TextSection,
} from '../styles/MessageStyles';

// const Messages = [
//   {
//     id: '1',
//     userName: 'Aleena Mitchel',
//     userImg: require('../Assets/img01.png'),
//     messageTime: '10 mins ago',
//     messageText: 'Hello !',
//   },
//   {
//     id: '2',
//     userName: 'John Smith',
//     userImg: require('../Assets/img02.png'),
//     messageTime: '2 hours ago',
//     messageText: 'what about the project evaluation?',
//   },
//   {
//     id: '3',
//     userName: 'Ken William',
//     userImg: require('../Assets/img01.png'),
//     messageTime: '1 hours ago',
//     messageText: '🤩✌️',
//   },
// ];

function modelChats(data){
  let chats = [];
  data.map((chat,index)=>{
    chats.push({
      id: index,
      _id: chat._id,
      userName: chat.chatName,
      userImg: require('../Assets/img01.png'),
      messageTime: latestMessage.createdAt,
      messageText: latestMessage.content,
    });
  });
  return chats;
}

const MessagesScreen = ({navigation}) => {

  const [Messages,setMessages] = useState([]);
  // const onChangeSearch = searchQuery => {
  //   if (searchQuery) {
  //     const formatedData = searchQuery.toLowerCase();
  //     const filterData = filter(data, creative => {
  //       return contains(creative, formatedData);
  //     });
  //     setData(filterData);
  //   } else {
  //     setData(data);
  //   }
  // };

  // const contains = ({creativeHeading, creativeDescription}, searchQuery) => {
  //   if (
  //     creativeHeading.toLowerCase().includes(searchQuery) ||
  //     creativeDescription.toLowerCase().includes(searchQuery)
  //   ) {
  //     return true;
  //   }
  //   return false;
  // };

  const getToken = async()=>{
    return await fetch(`http://10.0.2.2:8000/api/login/`,{
      method:"POST",
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
    fetch('http://10.0.2.2:8000/api/chat', { headers : {Authorization:`Bearer ${token}`}})
      .then((res)=>{
        setMessages(modelChats(res.data));
      })
      .catch((error)=>{
        console.log(error);
      });
    }
  },[]);

  return (
    <Container>
      <View style={styles.searchBarContainer}>
        <Searchbar
          placeholder="Search"
          onChangeText={searchQuery => onChangeSearch(searchQuery)}
          autoCapitalize="none"
          style={styles.searchBar}
        />
      </View>
      <FlatList
        data={Messages}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <Card
            onPress={() =>
              navigation.navigate('Chat', {chatId: item._id, chatName: item.userName})
            }>
            <UserInfo>
              <UserImgWrapper>
                <UserImg source={item.userImg} />
              </UserImgWrapper>
              <TextSection>
                <UserInfoText>
                  <UserName>{item.userName}</UserName>
                  <PostTime>{item.messageTime}</PostTime>
                </UserInfoText>
                <MessageText>{item.messageText}</MessageText>
              </TextSection>
            </UserInfo>
          </Card>
        )}
      />
    </Container>
  );
};

export default MessagesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBarContainer: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    padding: 0,
    margin: 0,
  },
  searchBar: {
    flex: 1,
    marginVertical: 10,
    height: 45,
    fontSize: 18,
  },
});
