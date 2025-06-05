import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { DrawerContentScrollView, DrawerItem, } from "@react-navigation/drawer";
import { useNavigation } from '@react-navigation/native';

import ICONS from "../../assets/icons";
import { iconSize, spacing } from "../../constants/dimensions";

const CustomDrawer = (props, userData) => {
    const navigation = useNavigation();

    const handleToggleDrawer = () => {
        props.navigation.closeDrawer();
    };
    const logoutPressed = () => {
        navigation.navigate("Login"); 
    }
    if (props.userData.role == "Trainer") {
        return (
            <>
                <DrawerContentScrollView>
                    {/* header container */}
                    <View style={styles.headerContainer}>
                        <TouchableOpacity onPress={handleToggleDrawer}>
                            <Image
                                source={ICONS["CLOSE"]}
                                style={{ width: iconSize.md, height: iconSize.md }}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {}}>
                            <Image
                                source={ICONS["LIGHT"]}
                                style={{ width: iconSize.md, height: iconSize.md }}
                            />
                        </TouchableOpacity>
                    </View>
                    {/* custom drawer items */}
                    <View style={styles.drawerItemContainerr}>
                        <DrawerItem
                            label={"Home"}
                            onPress={() => {
                                props.navigation.navigate("Home");
                            }}
                            activeTintColor="red"
                            inactiveTintColor="black"
                            icon={() => 
                                <Image
                                    source={ICONS["HOME"]}
                                    style={{ width: iconSize.md, height: iconSize.md }}
                                />}
                            labelStyle={[styles.labelStyle, {}]}
                            style={styles.drawerItem}
                        />
                    </View>
                    <View>
                        <DrawerItem
                            label={"Profile"}
                            onPress={() => {
                                props.navigation.navigate("Profile");
                            }}
                            icon={() => (
                                <Image
                                    source={ICONS["PERSON"]}
                                    style={{ width: iconSize.md, height: iconSize.md }}
                                />
                            )}
                            labelStyle={[styles.labelStyle, {}]}
                            style={styles.drawerItem}
                        />
                    </View>
                    <View>
                        <DrawerItem
                            label={"Manage BMI"}
                            onPress={() => {
                                props.navigation.navigate("Manage BMI");
                            }}
                            icon={() => (
                                <Image
                                    source={ICONS["MANAGE"]}
                                    style={{ width: iconSize.md, height: iconSize.md }}
                                />
                            )}
                            labelStyle={[styles.labelStyle, {}]}
                            style={styles.drawerItem}
                        />
                    </View>
                    <View>
                        <DrawerItem
                            label={"Manage Frequency"}
                            onPress={() => {
                                props.navigation.navigate("Manage Frequency");
                            }}
                            icon={() => (
                                <Image
                                    source={ICONS["CALENDAR"]}
                                    style={{ width: iconSize.md, height: iconSize.md }}
                                />
                            )}
                            labelStyle={[styles.labelStyle, {}]}
                            style={styles.drawerItem}
                        />
                    </View>
                    <View>
                        <DrawerItem
                            label={"Rule Program"}
                            onPress={() => {
                                props.navigation.navigate("Formula Program");
                            }}
                            icon={() => (
                                <Image
                                    source={ICONS["EXPERIMENT"]}
                                    style={{ width: iconSize.md, height: iconSize.md }}
                                />
                            )}
                            labelStyle={[styles.labelStyle, {}]}
                            style={styles.drawerItem}
                        />
                    </View>
                    <View>
                        <DrawerItem
                            label={"Rule Workout"}
                            onPress={() => {
                                props.navigation.navigate("Formula Workout");
                            }}
                            icon={() => (
                                <Image
                                    source={ICONS["PATTERN"]}
                                    style={{ width: iconSize.md, height: iconSize.md }}
                                />
                            )}
                            labelStyle={[styles.labelStyle, {}]}
                            style={styles.drawerItem}
                        />
                    </View>
                    <View>
                        <DrawerItem
                            label={"Workout Planner"}
                            onPress={() => {
                                props.navigation.navigate("Training Plan");
                            }}
                            icon={() => (
                                <Image
                                    source={ICONS["EDIT_CALENDAR"]}
                                    style={{ width: iconSize.md, height: iconSize.md }}
                                />
                            )}
                            labelStyle={[styles.labelStyle, {}]}
                            style={styles.drawerItem}
                        />
                    </View>
                    <View>
                        <DrawerItem
                            label={"Workout Guide"}
                            onPress={() => {
                                props.navigation.navigate("List Guide");
                            }}
                            icon={() => (
                                <Image
                                    source={ICONS["GUIDE"]}
                                    style={{ width: iconSize.md, height: iconSize.md }}
                                />
                            )}
                            labelStyle={[styles.labelStyle, {}]}
                            style={styles.drawerItem}
                        />
                    </View>
                    <View>
                        <DrawerItem
                            label={"Calculate BMI"}
                            onPress={() => {
                                props.navigation.navigate("BMI");
                            }}
                            icon={() => (
                                <Image
                                    source={ICONS["CALCULATE"]}
                                    style={{ width: iconSize.md, height: iconSize.md }}
                                />
                            )}
                            labelStyle={[styles.labelStyle, {}]}
                            style={styles.drawerItem}
                        />
                    </View>
                    <View>
                        <DrawerItem
                            label={"About"}
                            onPress={() => {
                                props.navigation.navigate("About");
                            }}
                            icon={() => (
                                <Image
                                    source={ICONS["INFO"]}
                                    style={{ width: iconSize.md, height: iconSize.md }}
                                />
                            )}
                            labelStyle={[styles.labelStyle, {}]}
                            style={styles.drawerItem}
                        />
                    </View>
                </DrawerContentScrollView>
                <View style={styles.headerContainer}>
                    <TouchableOpacity onPress={logoutPressed}>
                        <Image
                            source={ICONS["LOGOUT"]}
                            style={{ width: iconSize.md, height: iconSize.md }}
                        />
                    </TouchableOpacity>
                </View>
            </>
        );
    } else if(props.userData.role == "Client") {
        return (
            <>
                <DrawerContentScrollView>
                    {/* header container */}
                    <View style={styles.headerContainer}>
                        <TouchableOpacity onPress={handleToggleDrawer}>
                            <Image
                                source={ICONS["CLOSE"]}
                                style={{ width: iconSize.md, height: iconSize.md }}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {}}>
                            <Image
                                source={ICONS["LIGHT"]}
                                style={{ width: iconSize.md, height: iconSize.md }}
                            />
                        </TouchableOpacity>
                    </View>
                    {/* custom drawer items */}
                    <View style={styles.drawerItemContainerr}>
                        <DrawerItem
                            label={"Home"}
                            onPress={() => {
                                props.navigation.navigate("Home");
                            }}
                            activeTintColor="red"
                            inactiveTintColor="black"
                            icon={() => 
                                <Image
                                    source={ICONS["HOME"]}
                                    style={{ width: iconSize.md, height: iconSize.md }}
                                />}
                            labelStyle={[styles.labelStyle, {}]}
                            style={styles.drawerItem}
                        />
                    </View>
                    <View>
                        <DrawerItem
                            label={"Profile"}
                            onPress={() => {
                                props.navigation.navigate("Profile");
                            }}
                            icon={() => (
                                <Image
                                    source={ICONS["PERSON"]}
                                    style={{ width: iconSize.md, height: iconSize.md }}
                                />
                            )}
                            labelStyle={[styles.labelStyle, {}]}
                            style={styles.drawerItem}
                        />
                    </View>
                    <View>
                        <DrawerItem
                            label={"Create Program Workout"}
                            onPress={() => {
                                props.navigation.navigate("Create Program");
                            }}
                            icon={() => (
                                <Image
                                    source={ICONS["SEARCH"]}
                                    style={{ width: iconSize.md, height: iconSize.md }}
                                />
                            )}
                            labelStyle={[styles.labelStyle, {}]}
                            style={styles.drawerItem}
                        />
                    </View>
                    <View>
                        <DrawerItem
                            label={"Go Workout"}
                            onPress={() => {
                                props.navigation.navigate("List Program");
                            }}
                            icon={() => (
                                <Image
                                    source={ICONS["FITNESS"]}
                                    style={{ width: iconSize.md, height: iconSize.md }}
                                />
                            )}
                            labelStyle={[styles.labelStyle, {}]}
                            style={styles.drawerItem}
                        />
                    </View>
                    <View>
                        <DrawerItem
                            label={"Workout Guide"}
                            onPress={() => {
                                props.navigation.navigate("List Guide");
                            }}
                            icon={() => (
                                <Image
                                    source={ICONS["GUIDE"]}
                                    style={{ width: iconSize.md, height: iconSize.md }}
                                />
                            )}
                            labelStyle={[styles.labelStyle, {}]}
                            style={styles.drawerItem}
                        />
                    </View>
                    <View>
                        <DrawerItem
                            label={"Calculate BMI"}
                            onPress={() => {
                                props.navigation.navigate("BMI");
                            }}
                            icon={() => (
                                <Image
                                    source={ICONS["CALCULATE"]}
                                    style={{ width: iconSize.md, height: iconSize.md }}
                                />
                            )}
                            labelStyle={[styles.labelStyle, {}]}
                            style={styles.drawerItem}
                        />
                    </View>
                    <View>
                        <DrawerItem
                            label={"About"}
                            onPress={() => {
                                props.navigation.navigate("About");
                            }}
                            icon={() => (
                                <Image
                                    source={ICONS["INFO"]}
                                    style={{ width: iconSize.md, height: iconSize.md }}
                                />
                            )}
                            labelStyle={[styles.labelStyle, {}]}
                            style={styles.drawerItem}
                        />
                    </View>
                </DrawerContentScrollView>
                <View style={styles.headerContainer}>
                    <TouchableOpacity onPress={logoutPressed}>
                        <Image
                            source={ICONS["LOGOUT"]}
                            style={{ width: iconSize.md, height: iconSize.md }}
                        />
                    </TouchableOpacity>
                </View>
            </>
        );
    }
    else if(props.userData.role == "Admin") {
        return (
            <>
                <DrawerContentScrollView>
                    {/* header container */}
                    <View style={styles.headerContainer}>
                        <TouchableOpacity onPress={handleToggleDrawer}>
                            <Image
                                source={ICONS["CLOSE"]}
                                style={{ width: iconSize.md, height: iconSize.md }}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {}}>
                            <Image
                                source={ICONS["LIGHT"]}
                                style={{ width: iconSize.md, height: iconSize.md }}
                            />
                        </TouchableOpacity>
                    </View>
                    {/* custom drawer items */}
                    <View style={styles.drawerItemContainerr}>
                        <DrawerItem
                            label={"Home"}
                            onPress={() => {
                                props.navigation.navigate("Home");
                            }}
                            activeTintColor="red"
                            inactiveTintColor="black"
                            icon={() => 
                                <Image
                                    source={ICONS["HOME"]}
                                    style={{ width: iconSize.md, height: iconSize.md }}
                                />}
                            labelStyle={[styles.labelStyle, {}]}
                            style={styles.drawerItem}
                        />
                    </View>
                    <View>
                        <DrawerItem
                            label={"Profile"}
                            onPress={() => {
                                props.navigation.navigate("Profile");
                            }}
                            icon={() => (
                                <Image
                                    source={ICONS["PERSON"]}
                                    style={{ width: iconSize.md, height: iconSize.md }}
                                />
                            )}
                            labelStyle={[styles.labelStyle, {}]}
                            style={styles.drawerItem}
                        />
                    </View>
                    <View>
                        <DrawerItem
                            label={"Manage Users"}
                            onPress={() => {
                                props.navigation.navigate("Users");
                            }}
                            icon={() => (
                                <Image
                                    source={ICONS["USERS"]}
                                    style={{ width: iconSize.md, height: iconSize.md }}
                                />
                            )}
                            labelStyle={[styles.labelStyle, {}]}
                            style={styles.drawerItem}
                        />
                    </View>
                    <View>
                        <DrawerItem
                            label={"About"}
                            onPress={() => {
                                props.navigation.navigate("About");
                            }}
                            icon={() => (
                                <Image
                                    source={ICONS["INFO"]}
                                    style={{ width: iconSize.md, height: iconSize.md }}
                                />
                            )}
                            labelStyle={[styles.labelStyle, {}]}
                            style={styles.drawerItem}
                        />
                    </View>
                </DrawerContentScrollView>
                <View style={styles.headerContainer}>
                    <TouchableOpacity onPress={logoutPressed}>
                        <Image
                            source={ICONS["LOGOUT"]}
                            style={{ width: iconSize.md, height: iconSize.md }}
                        />
                    </TouchableOpacity>
                </View>
            </>
        );
    }
    else {
        return (
            <>
                <DrawerContentScrollView>
                    {/* header container */}
                    <View style={styles.headerContainer}>
                        <TouchableOpacity onPress={handleToggleDrawer}>
                            <Image
                                source={ICONS["CLOSE"]}
                                style={{ width: iconSize.md, height: iconSize.md }}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {}}>
                            <Image
                                source={ICONS["LIGHT"]}
                                style={{ width: iconSize.md, height: iconSize.md }}
                            />
                        </TouchableOpacity>
                    </View>
                    {/* custom drawer items */}
                    <View style={styles.drawerItemContainerr}>
                        <DrawerItem
                            label={"Home"}
                            onPress={() => {
                                props.navigation.navigate("Home");
                            }}
                            activeTintColor="red"
                            inactiveTintColor="black"
                            icon={() => 
                                <Image
                                    source={ICONS["HOME"]}
                                    style={{ width: iconSize.md, height: iconSize.md }}
                                />}
                            labelStyle={[styles.labelStyle, {}]}
                            style={styles.drawerItem}
                        />
                    </View>
                    <View>
                        <DrawerItem
                            label={"Profile"}
                            onPress={() => {
                                props.navigation.navigate("Profile");
                            }}
                            icon={() => (
                                <Image
                                    source={ICONS["PERSON"]}
                                    style={{ width: iconSize.md, height: iconSize.md }}
                                />
                            )}
                            labelStyle={[styles.labelStyle, {}]}
                            style={styles.drawerItem}
                        />
                    </View>
                    <View>
                        <DrawerItem
                            label={"About"}
                            onPress={() => {
                                props.navigation.navigate("About");
                            }}
                            icon={() => (
                                <Image
                                    source={ICONS["INFO"]}
                                    style={{ width: iconSize.md, height: iconSize.md }}
                                />
                            )}
                            labelStyle={[styles.labelStyle, {}]}
                            style={styles.drawerItem}
                        />
                    </View>
                </DrawerContentScrollView>
                <View style={styles.headerContainer}>
                    <TouchableOpacity onPress={logoutPressed}>
                        <Image
                            source={ICONS["LOGOUT"]}
                            style={{ width: iconSize.md, height: iconSize.md }}
                        />
                    </TouchableOpacity>
                </View>
            </>
        );
    }
};

export default CustomDrawer;

const styles = StyleSheet.create({
    container: {
        paddingVertical: spacing.lg,
        paddingHorizontal: spacing.lg,
    },
    headerContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingRight: spacing.sm,
        marginBottom: spacing.xl,
        marginTop: spacing.md,
        marginLeft: spacing.md,
        marginRight: spacing.md,
    },
    drawerItemContainerr: {},
    labelStyle: {
        // fontSize: spacing.md,
    },
    drawerItem: {
        marginVertical: spacing.xs,
    },
});