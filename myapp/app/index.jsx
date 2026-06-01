import React from 'react';
import { Redirect } from 'expo-router';
import "leaflet/dist/leaflet.css";

const Index = () => {
  return <Redirect href="/welcome" />;
};

export default Index;