import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import CustomDrawer from '../components/CustomDrawer';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ManageBMIScreen from '../screens/ManageBMIScreen';
import ProgramScreen from '../screens/ProgramScreen';
import ResultScreen from '../screens/ProgramScreen/ResultScreen';
import ListProgramScreen from '../screens/ListProgramScreen';
import ScheduleWorkoutScreen from '../screens/ListProgramScreen/ScheduleWorkoutScreen';
import WorkoutTrainingScreen from '../screens/ListProgramScreen/WorkoutTrainingScreen';
import ListWorkoutGuideScreen from '../screens/WorkoutGuideScreen';
import WorkoutGuideScreen from '../screens/WorkoutGuideScreen/WorkoutGuideScreen';
import BMIScreen from '../screens/BMIScreen';
import ManageFrequencyScreen from '../screens/ManageFrequencyScreen';
import FormulaProgramScreen from '../screens/FormulaProgramScreen';
import FormulaWorkoutScreen from '../screens/FormulaWorkoutScreen';
import TrainingPlanScreen from '../screens/TrainingPlanScreen';
import WorkoutPlanscreen from '../screens/TrainingPlanScreen/WorkoutPlanScreen';
import AboutScreen from '../screens/AboutScreen/AboutScreen';
import ManageUsersScreen from '../screens/ManageUsersScreen';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const Navigation = () => {
  return (
    <NavigationContainer initialRouteName="Login">
      <Stack.Navigator
        screenOptions={{headerTintColor: '#fff', headerTitleAlign: 'center'}}>
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Navigator"
          component={Navigator}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const Navigator = ({route}) => {
  const {userData, apiUrl} = route.params;

  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawer {...props} userData={userData} />}
      screenOptions={{drawerType: 'back'}}>
      <Drawer.Screen
        name={'Expert System Workout '}
        component={ScreenNavigator}
        initialParams={{userData, apiUrl}}
      />
    </Drawer.Navigator>
  );
};

const ScreenNavigator = ({route}) => {
  const {userData, apiUrl} = route.params;

  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen
        name={'Home'}
        component={HomeScreen}
        initialParams={{userData, apiUrl}}
      />
      <Stack.Screen
        name="Users"
        component={ManageUsersScreen}
        initialParams={{userData, apiUrl}}
      />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        initialParams={{userData, apiUrl}}
      />
      <Stack.Screen
        name="Manage BMI"
        component={ManageBMIScreen}
        initialParams={{userData, apiUrl}}
      />
      <Stack.Screen
        name="Manage Frequency"
        component={ManageFrequencyScreen}
        initialParams={{userData, apiUrl}}
      />
      <Stack.Screen
        name="Formula Program"
        component={FormulaProgramScreen}
        initialParams={{userData, apiUrl}}
      />
      <Stack.Screen
        name="Formula Workout"
        component={FormulaWorkoutScreen}
        initialParams={{userData, apiUrl}}
      />
      <Stack.Screen
        name="Training Plan"
        component={TrainingPlanScreen}
        initialParams={{userData, apiUrl}}
      />
      <Stack.Screen
        name="Workout Plan"
        component={WorkoutPlanscreen}
        initialParams={{userData, apiUrl}}
      />
      <Stack.Screen
        name="Create Program"
        component={ProgramScreen}
        initialParams={{userData, apiUrl}}
      />
      <Stack.Screen
        name="Result"
        component={ResultScreen}
        initialParams={{userData, apiUrl}}
      />
      <Stack.Screen
        name="List Program"
        component={ListProgramScreen}
        initialParams={{userData, apiUrl}}
      />
      <Stack.Screen
        name="Schedule"
        component={ScheduleWorkoutScreen}
        initialParams={{userData, apiUrl}}
      />
      <Stack.Screen
        name="Training"
        component={WorkoutTrainingScreen}
        initialParams={{userData, apiUrl}}
      />
      <Stack.Screen
        name="List Guide"
        component={ListWorkoutGuideScreen}
        initialParams={{userData, apiUrl}}
      />
      <Stack.Screen
        name="Workout Guide"
        component={WorkoutGuideScreen}
        initialParams={{userData, apiUrl}}
      />
      <Stack.Screen
        name="BMI"
        component={BMIScreen}
        initialParams={{userData, apiUrl}}
      />
      <Stack.Screen
        name="About"
        component={AboutScreen}
        initialParams={{userData, apiUrl}}
      />
    </Stack.Navigator>
  );
};

export default Navigation;
