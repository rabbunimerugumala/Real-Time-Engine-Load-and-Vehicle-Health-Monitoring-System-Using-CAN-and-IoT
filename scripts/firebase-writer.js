import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set } from 'firebase/database';

// Firebase configuration using the URL provided by the user
const firebaseConfig = {
  databaseURL: "https://real-time-engine-can-default-rtdb.asia-southeast1.firebasedatabase.app/"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

/**
 * Pushes sample vehicle data to Firebase Realtime Database
 * in the format requested by the user.
 */
async function updateVehicleData() {
  const vehicleData = {
    timestamp: Date.now(),
    online: true,
    sensors: {
      temperature: 30.5,
      load: 12.4,
      fuel: 65,
      gas: 40,
      humidity: 72,
      tilt: -5,
      door: 1
    },
    gps: {
      fix: true,
      satellites: 6,
      lat: 16.5432,
      lng: 80.6234
    }
  };

  try {
    await set(ref(db, 'vehicle'), vehicleData);
    console.log('✅ Vehicle data updated successfully at:', new Date().toLocaleTimeString());
  } catch (error) {
    console.error('❌ Error updating vehicle data:', error);
  }
}

// Update once immediately
updateVehicleData();

// Optional: Update periodically (simulating real-time updates)
// setInterval(updateVehicleData, 5000);

console.log('Firebase Writer started...');
