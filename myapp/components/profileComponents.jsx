import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export const Action = ({ icon, label, onPress }) => (
  <TouchableOpacity style={styles.actionBox} onPress={onPress} activeOpacity={0.7}>
    <Ionicons name={icon} size={22} color="#007bff" />
    <Text style={styles.actionText}>{label}</Text>
  </TouchableOpacity>
);

export const Section = ({ title, children }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {children}
  </View>
);

export const Item = ({ icon, title, subtitle, onPress }) => (
  <TouchableOpacity style={styles.item} onPress={onPress} activeOpacity={0.7}>
    <Ionicons name={icon} size={22} color="#007bff" />
    <View style={styles.itemContent}>
      <Text style={styles.itemTitle}>{title}</Text>
      {subtitle ? <Text style={styles.itemSubtitle}>{subtitle}</Text> : null}
    </View>

    <Ionicons name="chevron-forward" size={18} color="#999" />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  actionBox: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
    elevation: 2,
  },

  actionText: {
    fontSize: 12,
    marginTop: 5,
    textAlign: 'center',
  },

  section: {
    marginTop: 15,
    paddingHorizontal: 12,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 10,
    marginBottom: 8,
  },

  itemContent: {
    flex: 1,
    marginLeft: 10,
  },

  itemTitle: {
    fontSize: 14,
    fontWeight: '500',
  },

  itemSubtitle: {
    fontSize: 12,
    color: '#777',
    marginTop: 2,
  },
});