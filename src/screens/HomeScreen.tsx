import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
  FlatList,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../utils/AuthContext';
import { typography } from '../styles/typography';
import { getFrequentLocations, addFrequentLocation, getHomeAddress } from '../utils/storage';

const API_KEY = process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY || '';
const API_URL = 'https://api.openweathermap.org/geo/1.0/direct';

const mockOutfit = {
  top: require('../assets/mock/top.png'),
  outerwear: require('../assets/mock/outerwear.png'),
  bottoms: require('../assets/mock/bottoms.png'),
  shoes: require('../assets/mock/shoes.png'),
  accessory: require('../assets/mock/accessory.png'),
};

const HomeScreen: React.FC = () => {
  const { user } = useAuth();
  const [editingLocation, setEditingLocation] = useState(false);
  const [locationInput, setLocationInput] = useState(user?.location || '');
  const [frequentLocations, setFrequentLocations] = useState<string[]>([]);
  const [homeAddress, setHomeAddressState] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    getFrequentLocations().then(setFrequentLocations);
    getHomeAddress().then(addr => addr && setHomeAddressState(addr));
  }, []);

  useEffect(() => {
    if (!editingLocation || !locationInput || locationInput.length < 2) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }
    setLoading(true);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetch(`${API_URL}?q=${encodeURIComponent(locationInput)}&limit=5&appid=${API_KEY}`)
        .then(res => res.json())
        .then((data: any[]) => {
          setSuggestions(
            data.map(item => ({
              name: item.name,
              state: item.state,
              country: item.country,
              lat: item.lat,
              lon: item.lon,
            }))
          );
          setShowDropdown(true);
        })
        .catch(() => setSuggestions([]))
        .finally(() => setLoading(false));
    }, 400);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [locationInput, editingLocation]);

  const handleLocationSelect = async (loc: { name: string; state?: string; country?: string }) => {
    const locString = `${loc.name}${loc.state ? ', ' + loc.state : ''}${loc.country ? ', ' + loc.country : ''}`;
    setLocationInput(locString);
    setEditingLocation(false);
    setShowDropdown(false);
    await addFrequentLocation(locString);
    setFrequentLocations(await getFrequentLocations());
  };

  const handleHomePress = () => {
    if (homeAddress) {
      setLocationInput(homeAddress);
      setEditingLocation(false);
      setShowDropdown(false);
      inputRef.current?.blur();
    }
  };

  // Merge frequent locations and suggestions, but don't duplicate
  const mergedSuggestions = [
    ...frequentLocations
      .filter(fl =>
        !suggestions.some(s => `${s.name}${s.state ? ', ' + s.state : ''}${s.country ? ', ' + s.country : ''}` === fl)
      )
      .map(l => ({ name: l, country: '', lat: 0, lon: 0 })),
    ...suggestions,
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={styles.greetingRow}>
          <View>
            <Text style={typography.label}>GOOD MORNING,</Text>
            <Text style={StyleSheet.flatten([typography.heading, styles.name])}>{user?.name || ''}</Text>
          </View>
          <TouchableOpacity style={styles.bellButton}>
            <Ionicons name="notifications-outline" size={28} color="#000" />
          </TouchableOpacity>
        </View>
        <View style={styles.locationRow}>
          <View
            style={[
              styles.locationInput,
              editingLocation && styles.locationInputActive,
            ]}
          >
            <TouchableOpacity onPress={handleHomePress} disabled={!homeAddress} style={{ marginRight: 4 }}>
              {homeAddress && <Ionicons name="home" size={18} color="#757575" />}
            </TouchableOpacity>
            <TextInput
              ref={inputRef}
              style={[typography.body, styles.locationTextInput]}
              value={locationInput}
              onChangeText={text => {
                setLocationInput(text);
                setEditingLocation(true);
              }}
              placeholder="Search for a location"
              placeholderTextColor="#757575"
              editable={true}
              onFocus={() => setEditingLocation(true)}
              onBlur={() => setEditingLocation(false)}
              onTouchStart={() => setEditingLocation(true)}
              onSubmitEditing={() => setShowDropdown(false)}
              autoCorrect={false}
              autoCapitalize="words"
            />
            <TouchableOpacity onPress={() => inputRef.current?.focus()} style={{ marginLeft: 4 }}>
              <Ionicons name="location-outline" size={16} color="#757575" />
            </TouchableOpacity>
            {loading && <ActivityIndicator size="small" color="#000" style={styles.loading} />}
            {showDropdown && mergedSuggestions.length > 0 && (
              <View style={styles.dropdown}>
                <FlatList
                  data={mergedSuggestions}
                  keyExtractor={(_, i) => i.toString()}
                  renderItem={({ item }) => (
                    <TouchableOpacity style={styles.suggestion} onPress={() => handleLocationSelect(item)}>
                      <Text style={typography.body}>
                        {item.name}
                        {item.state ? `, ${item.state}` : ''}
                        {item.country ? `, ${item.country}` : ''}
                      </Text>
                    </TouchableOpacity>
                  )}
                  keyboardShouldPersistTaps="handled"
                />
              </View>
            )}
          </View>
          <TouchableOpacity style={styles.todayButton}>
            <Ionicons name="calendar-outline" size={16} color="#000" />
            <Text style={typography.body}>Today</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.datesRow}>
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
            <View
              key={day}
              style={[styles.dateCell, i === 3 && styles.dateCellActive]}
            >
              <Text style={StyleSheet.flatten([typography.caption, i === 3 && styles.dateDayActive])}>{day}</Text>
              <Text style={StyleSheet.flatten([typography.body, i === 3 && styles.dateNumActive])}>{7 + i}</Text>
            </View>
          ))}
        </View>
        <View style={styles.outfitHeaderRow}>
          <Text style={StyleSheet.flatten([typography.subheading, styles.outfitHeader])}>
            TODAY'S <Text style={StyleSheet.flatten([typography.heading, styles.outfitHeaderItalic])}>Outfit</Text>
          </Text>
          <TouchableOpacity>
            <Text style={StyleSheet.flatten([typography.caption, styles.switchWeather])}>SWITCH TO <Text style={StyleSheet.flatten([typography.label, styles.weatherMode])}>weather mode</Text></Text>
          </TouchableOpacity>
        </View>
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.actionButton}><Text style={typography.button}>EDIT</Text></TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}><Text style={typography.button}>SAVE</Text></TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}><Text style={typography.button}>SHARE</Text></TouchableOpacity>
        </View>
        <View style={styles.bentoBox}>
          <View style={styles.bentoRow}>
            <View style={styles.bentoCell}>
              <Image source={mockOutfit.top} style={styles.clothingImg} resizeMode="contain" />
              <Text style={StyleSheet.flatten([typography.label, styles.bentoLabel])}>Top</Text>
            </View>
            <View style={styles.bentoCell}>
              <Image source={mockOutfit.outerwear} style={styles.clothingImg} resizeMode="contain" />
              <Text style={StyleSheet.flatten([typography.label, styles.bentoLabel])}>Outerwear</Text>
              <Text style={StyleSheet.flatten([typography.caption, styles.sponsored])}>sponsored</Text>
            </View>
          </View>
          <View style={styles.bentoRow}>
            <View style={styles.bentoCell}>
              <Image source={mockOutfit.bottoms} style={styles.clothingImg} resizeMode="contain" />
              <Text style={StyleSheet.flatten([typography.label, styles.bentoLabel])}>Bottoms</Text>
            </View>
            <View style={styles.bentoCell}>
              <Image source={mockOutfit.accessory} style={styles.clothingImg} resizeMode="contain" />
              <Text style={StyleSheet.flatten([typography.label, styles.bentoLabel])}>Accessory</Text>
            </View>
            <View style={styles.bentoCell}>
              <Image source={mockOutfit.shoes} style={styles.clothingImg} resizeMode="contain" />
              <Text style={StyleSheet.flatten([typography.label, styles.bentoLabel])}>Shoes</Text>
            </View>
          </View>
        </View>
        <View style={styles.rateCard}>
          <Text style={StyleSheet.flatten([typography.label, styles.rateTitle])}>RATE THIS OUTFIT:</Text>
          <Text style={StyleSheet.flatten([typography.body, styles.rateSubtitle])}>How did you feel in this?</Text>
        </View>
      </ScrollView>
      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.tabIcon}><Ionicons name="partly-sunny-outline" size={28} color="#757575" /></TouchableOpacity>
        <TouchableOpacity style={styles.tabIcon}><Ionicons name="shirt-outline" size={28} color="#757575" /></TouchableOpacity>
        <TouchableOpacity style={styles.tabIcon}><Ionicons name="globe-outline" size={28} color="#757575" /></TouchableOpacity>
        <TouchableOpacity style={styles.tabIcon}><Ionicons name="person-outline" size={28} color="#757575" /></TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  flex1: { flex: 1 },
  container: { padding: 0, backgroundColor: '#fff' },
  greetingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, marginBottom: 8, paddingHorizontal: 20 },
  name: { marginTop: -4 },
  bellButton: { backgroundColor: '#fff', borderRadius: 20, padding: 8, elevation: 2 },
  locationRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginHorizontal: 20, marginBottom: 8 },
  locationInput: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderColor: '#757575', borderWidth: 1, borderRadius: 12, paddingHorizontal: 12, height: 36, flex: 1 },
  locationInputActive: { borderWidth: 2, borderColor: '#000' },
  todayButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, paddingHorizontal: 16, height: 36, marginLeft: 8, borderWidth: 1, borderColor: '#F5F5F5' },
  datesRow: { flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 10, marginBottom: 12 },
  dateCell: { alignItems: 'center', justifyContent: 'center', width: 44, height: 51, backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: '#F5F5F5', marginHorizontal: 2 },
  dateCellActive: { backgroundColor: '#000', borderColor: '#000' },
  dateDayActive: { color: '#fff' },
  dateNumActive: { color: '#fff' },
  outfitHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: 20, marginTop: 8 },
  outfitHeader: {},
  outfitHeaderItalic: {},
  switchWeather: { textAlign: 'right' },
  weatherMode: { textDecorationLine: 'underline' },
  actionRow: { flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 20, marginTop: 12, marginBottom: 8 },
  actionButton: { flex: 1, backgroundColor: '#000', borderRadius: 12, marginHorizontal: 4, height: 32, alignItems: 'center', justifyContent: 'center' },
  bentoBox: { marginHorizontal: 20, marginTop: 8, marginBottom: 8 },
  bentoRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  bentoCell: { flex: 1, backgroundColor: '#F5F5F5', borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginHorizontal: 4, minHeight: 120, position: 'relative' },
  clothingImg: { width: 60, height: 60, marginTop: 8 },
  bentoLabel: { position: 'absolute', left: 4, top: 4, transform: [{ rotate: '-90deg' }] },
  sponsored: { position: 'absolute', right: 8, bottom: 8 },
  rateCard: { marginHorizontal: 20, marginTop: 12, marginBottom: 24, backgroundColor: '#F5F5F5', borderRadius: 12, borderWidth: 1, borderColor: '#000', alignItems: 'center', paddingVertical: 12 },
  rateTitle: {},
  rateSubtitle: { marginTop: 2 },
  tabBar: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', height: 78, backgroundColor: '#fff', borderTopWidth: 0.5, borderTopColor: 'rgba(0,0,0,0.1)' },
  tabIcon: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  locationTextInput: {
    flex: 1,
    backgroundColor: 'transparent',
    borderWidth: 0,
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  loading: { position: 'absolute', right: 16, top: 12 },
  dropdown: {
    position: 'absolute',
    top: 48,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    zIndex: 10,
    maxHeight: 180,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  suggestion: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
});

export default HomeScreen;
