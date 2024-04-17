// screen to view all the goals you have ever set regardless both completed and non completed and it should seperate them into seperate lists based on that and then clicking each goal in the list should give you chance to edit the goal

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Button, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import * as goalsActions from '../../store/actions/goals';
import GoalItem from '../../components/GoalItem';
import Colors from '../../constants/Colors';
