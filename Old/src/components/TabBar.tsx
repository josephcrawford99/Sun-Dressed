import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type TabBarProps = {
  activeTab: 'home' | 'wardrobe' | 'social' | 'account';
};

const TabBar: React.FC<TabBarProps> = ({ activeTab }) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  return (
    <View style={styles.tabBar}>
      <TouchableOpacity
        style={styles.tabIcon}
        onPress={() => navigation.navigate('Home')}
      >
        <Ionicons
          name="partly-sunny-outline"
          size={28}
          color={activeTab === 'home' ? '#000' : '#757575'}
        />
      </TouchableOpacity>
      <TouchableOpacity style={styles.tabIcon}>
        <Ionicons
          name="shirt-outline"
          size={28}
          color={activeTab === 'wardrobe' ? '#000' : '#757575'}
        />
      </TouchableOpacity>
      <TouchableOpacity style={styles.tabIcon}>
        <Ionicons
          name="globe-outline"
          size={28}
          color={activeTab === 'social' ? '#000' : '#757575'}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.tabIcon}
        onPress={() => navigation.navigate('Account')}
      >
        <Ionicons
          name="person-outline"
          size={28}
          color={activeTab === 'account' ? '#000' : '#757575'}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 60,
    backgroundColor: '#fff'
  },
  tabIcon: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
});

export default TabBar;
