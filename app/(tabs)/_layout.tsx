import React, {useContext} from 'react';
import {Tabs, useRouter} from 'expo-router';
import {TouchableOpacity, useColorScheme} from 'react-native';
import {AuthContext} from '@/context/AuthContext';
import {TabBarIcon} from '@/components/navigation/TabBarIcon';
import {Colors} from '@/constants/Colors';

export default function TabLayout() {
    const colorScheme = useColorScheme();
    const {userToken} = useContext(AuthContext);
    const router = useRouter();

    const handleProfileTabPress = () => {
        if (!userToken) {
            router.push('/(auth)/Login');
            return false;
        }
        return true;
    };

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
                headerShown: false,
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: ({color, focused}) => (
                        <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color}/>
                    ),
                }}
            />
            <Tabs.Screen
                name="KebabList"
                options={{
                    title: 'Lista Kebabów',
                    tabBarIcon: ({color, focused}) => (
                        <TabBarIcon name={focused ? 'list' : 'list-outline'} color={color}/>
                    ),
                }}
            />
            <Tabs.Screen
                name="Profile"
                options={{
                    title: 'Profil',
                    tabBarIcon: ({color, focused}) => (
                        <TabBarIcon name={focused ? 'person' : 'person-outline'} color={color}/>
                    ),
                    tabBarButton: (props) => (
                        <TouchableOpacity
                            {...props}
                            onPress={(event) => {
                                if (handleProfileTabPress()) {
                                    props.onPress?.(event);
                                }
                            }}
                        />

                    ),
                }}
            />
            <Tabs.Screen
                name="Feedback"
                options={{
                    title: 'Feedback',
                    tabBarIcon: ({color, focused}) => (
                        <TabBarIcon name={focused ? 'chatbox-ellipses' : 'chatbox-ellipses-outline'} color={color}/>
                    ),
                    tabBarButton: (props) => (
                        <TouchableOpacity
                            {...props}
                            onPress={(event) => {
                                if (handleProfileTabPress()) {
                                    props.onPress?.(event);
                                }
                            }}
                        />

                    ),
                }}
            />
        </Tabs>
    );
}
