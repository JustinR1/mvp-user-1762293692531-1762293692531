import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Switch,
  useColorScheme,
  Appearance,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import Modal from './components/Modal';
import Input from './components/Input';
import Button from './components/Button';
import Toast from './components/Toast';

type Tab = 'workouts' | 'schedule' | 'profile';

interface Workout {
  id: number;
  name: string;
  duration: number;
  calories: number;
  emoji: string;
}

interface ScheduledWorkout {
  id: number;
  workoutName: string;
  day: string;
  time: string;
  emoji: string;
}

export default function App() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [activeTab, setActiveTab] = useState<Tab>('workouts');
  const [workouts, setWorkouts] = useState<Workout[]>([
    { id: 1, name: 'Morning Run', duration: 30, calories: 250, emoji: '🏃' },
    { id: 2, name: 'Yoga Session', duration: 45, calories: 150, emoji: '🧘' },
    { id: 3, name: 'Weight Training', duration: 60, calories: 400, emoji: '💪' },
  ]);

  const [scheduledWorkouts, setScheduledWorkouts] = useState<ScheduledWorkout[]>([
    { id: 1, workoutName: 'Morning Run', day: 'Monday', time: '07:00 AM', emoji: '🏃' },
    { id: 2, workoutName: 'Yoga Session', day: 'Wednesday', time: '06:00 PM', emoji: '🧘' },
    { id: 3, workoutName: 'Weight Training', day: 'Friday', time: '05:30 PM', emoji: '💪' },
  ]);

  const [showAddWorkoutModal, setShowAddWorkoutModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [newWorkoutName, setNewWorkoutName] = useState('');
  const [newWorkoutDuration, setNewWorkoutDuration] = useState('');
  const [newWorkoutCalories, setNewWorkoutCalories] = useState('');
  const [scheduleWorkoutName, setScheduleWorkoutName] = useState('');
  const [scheduleDay, setScheduleDay] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [toast, setToast] = useState({ visible: false, message: '', type: 'info' as const });

  const totalCalories = workouts.reduce((sum, w) => sum + w.calories, 0);
  const totalMinutes = workouts.reduce((sum, w) => sum + w.duration, 0);

  const backgroundColor = isDark ? '#000000' : '#F9FAFB';
  const surfaceColor = isDark ? '#1C1C1E' : '#FFFFFF';
  const textColor = isDark ? '#FFFFFF' : '#1C1C1E';
  const secondaryTextColor = '#8E8E93';
  const borderColor = isDark ? '#38383A' : '#E5E5EA';

  const handleTabChange = (tab: Tab) => {
    Haptics.selectionAsync();
    setActiveTab(tab);
  };

  const handleToggleDarkMode = (value: boolean) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Appearance.setColorScheme(value ? 'dark' : 'light');
  };

  const handleAddWorkout = () => {
    if (!newWorkoutName || !newWorkoutDuration || !newWorkoutCalories) {
      setToast({ visible: true, message: 'Please fill all fields', type: 'error' });
      return;
    }

    const emojis = ['🏃', '🧘', '💪', '🚴', '🏊', '⛹️', '🤸', '🧗'];
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];

    const newWorkout: Workout = {
      id: Date.now(),
      name: newWorkoutName,
      duration: parseInt(newWorkoutDuration),
      calories: parseInt(newWorkoutCalories),
      emoji: randomEmoji,
    };

    setWorkouts([...workouts, newWorkout]);
    setShowAddWorkoutModal(false);
    setNewWorkoutName('');
    setNewWorkoutDuration('');
    setNewWorkoutCalories('');
    setToast({ visible: true, message: 'Workout added successfully!', type: 'success' });
  };

  const handleScheduleWorkout = () => {
    if (!scheduleWorkoutName || !scheduleDay || !scheduleTime) {
      setToast({ visible: true, message: 'Please fill all fields', type: 'error' });
      return;
    }

    const emojis = ['🏃', '🧘', '💪', '🚴', '🏊', '⛹️', '🤸', '🧗'];
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];

    const newSchedule: ScheduledWorkout = {
      id: Date.now(),
      workoutName: scheduleWorkoutName,
      day: scheduleDay,
      time: scheduleTime,
      emoji: randomEmoji,
    };

    setScheduledWorkouts([...scheduledWorkouts, newSchedule]);
    setShowScheduleModal(false);
    setScheduleWorkoutName('');
    setScheduleDay('');
    setScheduleTime('');
    setToast({ visible: true, message: 'Workout scheduled successfully!', type: 'success' });
  };

  const renderWorkoutsTab = () => (
    <ScrollView style={styles.content}>
      <View style={styles.statsContainer}>
        <View style={[styles.statCard, { backgroundColor: surfaceColor, borderColor }]}>
          <Ionicons name="flame" size={32} color="#FF3B30" />
          <Text style={[styles.statValue, { color: textColor }]}>{totalCalories}</Text>
          <Text style={styles.statLabel}>Calories</Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: surfaceColor, borderColor }]}>
          <Ionicons name="time" size={32} color="#007AFF" />
          <Text style={[styles.statValue, { color: textColor }]}>{totalMinutes}</Text>
          <Text style={styles.statLabel}>Minutes</Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: surfaceColor, borderColor }]}>
          <Ionicons name="barbell" size={32} color="#5856D6" />
          <Text style={[styles.statValue, { color: textColor }]}>{workouts.length}</Text>
          <Text style={styles.statLabel}>Workouts</Text>
        </View>
      </View>

      <Text style={[styles.sectionTitle, { color: textColor }]}>Today's Workouts</Text>

      {workouts.map(workout => (
        <View key={workout.id} style={[styles.workoutCard, { backgroundColor: surfaceColor, borderColor }]}>
          <View style={[styles.workoutEmoji, { backgroundColor: isDark ? '#2C2C2E' : '#F2F2F7' }]}>
            <Text style={styles.emoji}>{workout.emoji}</Text>
          </View>

          <View style={styles.workoutInfo}>
            <Text style={[styles.workoutName, { color: textColor }]}>{workout.name}</Text>
            <View style={styles.workoutStats}>
              <View style={styles.workoutStat}>
                <Ionicons name="time-outline" size={14} color={secondaryTextColor} />
                <Text style={styles.workoutStatText}>{workout.duration} min</Text>
              </View>
              <View style={styles.workoutStat}>
                <Ionicons name="flame-outline" size={14} color={secondaryTextColor} />
                <Text style={styles.workoutStatText}>{workout.calories} cal</Text>
              </View>
            </View>
          </View>

          <Ionicons name="checkmark-circle" size={28} color="#34C759" />
        </View>
      ))}

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          setShowAddWorkoutModal(true);
        }}
      >
        <Ionicons name="add" size={24} color="#FFFFFF" />
        <Text style={styles.addButtonText}>Log New Workout</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  const renderScheduleTab = () => (
    <ScrollView style={styles.content}>
      <Text style={[styles.sectionTitle, { color: textColor }]}>Scheduled Workouts</Text>

      {scheduledWorkouts.map(schedule => (
        <View key={schedule.id} style={[styles.scheduleCard, { backgroundColor: surfaceColor, borderColor }]}>
          <View style={[styles.scheduleEmoji, { backgroundColor: isDark ? '#2C2C2E' : '#F2F2F7' }]}>
            <Text style={styles.emoji}>{schedule.emoji}</Text>
          </View>

          <View style={styles.scheduleInfo}>
            <Text style={[styles.scheduleName, { color: textColor }]}>{schedule.workoutName}</Text>
            <View style={styles.scheduleDetails}>
              <View style={styles.scheduleDetail}>
                <Ionicons name="calendar-outline" size={14} color={secondaryTextColor} />
                <Text style={styles.scheduleDetailText}>{schedule.day}</Text>
              </View>
              <View style={styles.scheduleDetail}>
                <Ionicons name="time-outline" size={14} color={secondaryTextColor} />
                <Text style={styles.scheduleDetailText}>{schedule.time}</Text>
              </View>
            </View>
          </View>

          <Ionicons name="chevron-forward" size={24} color={secondaryTextColor} />
        </View>
      ))}

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          setShowScheduleModal(true);
        }}
      >
        <Ionicons name="add" size={24} color="#FFFFFF" />
        <Text style={styles.addButtonText}>Schedule Workout</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  const renderProfileTab = () => (
    <ScrollView style={styles.content}>
      <View style={[styles.profileCard, { backgroundColor: surfaceColor, borderColor }]}>
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>JD</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={[styles.profileName, { color: textColor }]}>John Doe</Text>
            <Text style={styles.profileEmail}>john.doe@example.com</Text>
          </View>
        </View>
      </View>

      <Text style={[styles.sectionTitle, { color: textColor }]}>Settings</Text>

      <View style={[styles.settingCard, { backgroundColor: surfaceColor, borderColor }]}>
        <View style={styles.settingRow}>
          <View style={styles.settingLeft}>
            <Ionicons name="moon" size={24} color={isDark ? '#0A84FF' : '#007AFF'} />
            <Text style={[styles.settingText, { color: textColor }]}>Dark Mode</Text>
          </View>
          <Switch
            value={isDark}
            onValueChange={handleToggleDarkMode}
            trackColor={{ false: '#E5E5EA', true: '#34C759' }}
            thumbColor="#FFFFFF"
          />
        </View>
      </View>

      <View style={[styles.settingCard, { backgroundColor: surfaceColor, borderColor }]}>
        <TouchableOpacity style={styles.settingRow}>
          <View style={styles.settingLeft}>
            <Ionicons name="notifications" size={24} color={isDark ? '#0A84FF' : '#007AFF'} />
            <Text style={[styles.settingText, { color: textColor }]}>Notifications</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color={secondaryTextColor} />
        </TouchableOpacity>
      </View>

      <View style={[styles.settingCard, { backgroundColor: surfaceColor, borderColor }]}>
        <TouchableOpacity style={styles.settingRow}>
          <View style={styles.settingLeft}>
            <Ionicons name="help-circle" size={24} color={isDark ? '#0A84FF' : '#007AFF'} />
            <Text style={[styles.settingText, { color: textColor }]}>Help & Support</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color={secondaryTextColor} />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />

      <LinearGradient
        colors={['#34C759', '#30D158']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Fitness Tracker</Text>
        <Text style={styles.headerSubtitle}>Keep pushing! 🔥</Text>
      </LinearGradient>

      {activeTab === 'workouts' && renderWorkoutsTab()}
      {activeTab === 'schedule' && renderScheduleTab()}
      {activeTab === 'profile' && renderProfileTab()}

      <View style={[styles.tabBar, { backgroundColor: surfaceColor, borderTopColor: borderColor }]}>
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => handleTabChange('workouts')}
        >
          <Ionicons
            name={activeTab === 'workouts' ? 'barbell' : 'barbell-outline'}
            size={24}
            color={activeTab === 'workouts' ? '#34C759' : secondaryTextColor}
          />
          <Text style={[styles.tabLabel, { color: activeTab === 'workouts' ? '#34C759' : secondaryTextColor }]}>Workouts</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => handleTabChange('schedule')}
        >
          <Ionicons
            name={activeTab === 'schedule' ? 'calendar' : 'calendar-outline'}
            size={24}
            color={activeTab === 'schedule' ? '#34C759' : secondaryTextColor}
          />
          <Text style={[styles.tabLabel, { color: activeTab === 'schedule' ? '#34C759' : secondaryTextColor }]}>Schedule</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => handleTabChange('profile')}
        >
          <Ionicons
            name={activeTab === 'profile' ? 'person' : 'person-outline'}
            size={24}
            color={activeTab === 'profile' ? '#34C759' : secondaryTextColor}
          />
          <Text style={[styles.tabLabel, { color: activeTab === 'profile' ? '#34C759' : secondaryTextColor }]}>Profile</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={showAddWorkoutModal}
        onClose={() => setShowAddWorkoutModal(false)}
        title="Add New Workout"
      >
        <Input
          label="Workout Name"
          placeholder="e.g., Morning Run"
          value={newWorkoutName}
          onChangeText={setNewWorkoutName}
          icon="fitness"
        />
        <Input
          label="Duration (minutes)"
          placeholder="e.g., 30"
          value={newWorkoutDuration}
          onChangeText={setNewWorkoutDuration}
          keyboardType="numeric"
          icon="time"
        />
        <Input
          label="Calories Burned"
          placeholder="e.g., 250"
          value={newWorkoutCalories}
          onChangeText={setNewWorkoutCalories}
          keyboardType="numeric"
          icon="flame"
        />
        <Button
          title="Add Workout"
          onPress={handleAddWorkout}
          variant="primary"
          size="large"
        />
      </Modal>

      <Modal
        visible={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
        title="Schedule Workout"
      >
        <Input
          label="Workout Name"
          placeholder="e.g., Morning Run"
          value={scheduleWorkoutName}
          onChangeText={setScheduleWorkoutName}
          icon="fitness"
        />
        <Input
          label="Day"
          placeholder="e.g., Monday"
          value={scheduleDay}
          onChangeText={setScheduleDay}
          icon="calendar"
        />
        <Input
          label="Time"
          placeholder="e.g., 07:00 AM"
          value={scheduleTime}
          onChangeText={setScheduleTime}
          icon="time"
        />
        <Button
          title="Schedule Workout"
          onPress={handleScheduleWorkout}
          variant="primary"
          size="large"
        />
      </Modal>

      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onHide={() => setToast(prev => ({ ...prev, visible: false }))}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 24,
    paddingTop: 32,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 13,
    color: '#8E8E93',
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  workoutCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
  },
  workoutEmoji: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  emoji: {
    fontSize: 28,
  },
  workoutInfo: {
    flex: 1,
  },
  workoutName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
  },
  workoutStats: {
    flexDirection: 'row',
    gap: 16,
  },
  workoutStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  workoutStatText: {
    fontSize: 13,
    color: '#8E8E93',
  },
  scheduleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
  },
  scheduleEmoji: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  scheduleInfo: {
    flex: 1,
  },
  scheduleName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
  },
  scheduleDetails: {
    flexDirection: 'row',
    gap: 16,
  },
  scheduleDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  scheduleDetailText: {
    fontSize: 13,
    color: '#8E8E93',
  },
  profileCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#34C759',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: '#8E8E93',
  },
  settingCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingText: {
    fontSize: 16,
    fontWeight: '500',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#34C759',
    borderRadius: 14,
    padding: 16,
    marginTop: 8,
    gap: 8,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  tabBar: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderTopWidth: 1,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
  },
});