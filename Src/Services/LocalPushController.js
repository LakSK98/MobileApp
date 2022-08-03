import PushNotification from 'react-native-push-notification';

PushNotification.configure({
  onNotification: function (notification) {
    console.log('NOTIFICATION:', notification);
  },
  popInitialNotification: true,
  requestPermissions: true,
});

PushNotification.createChannel(
  {
    channelId: 'channel-id-1',
    channelName: 'my channel',
    channelDescription: 'this is my channel',
    playSound: true,
    soundName: 'default',
    importance: 10,
    vibrate: true,
    vibration: 1000,
  },
  created => console.log(`channel created ${created}`),
);

export const LocalNotification = () => {
  PushNotification.localNotification({
    channelId: 'channel-id-1',
    channelName: 'my channel',
    autoCancel: true,
    bigText: 'This is a big text',
    subText: 'This is a sub text',
    title: 'This is a title',
    message: 'expand me!',
    playSound: true,
    soundName: 'default',
    importance: 10,
    vibrate: true,
    vibration: 1000,
  });
};
