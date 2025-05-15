<template>
  <div class="scan-qr-container">
    <h1 class="page-title">Scan Recycling Point QR Code</h1>
    
    <!-- Location verification section -->
    <div class="location-section" v-if="!locationVerified && !scanned">
      <h2>Verify Your Location</h2>
      <p>Please verify you are at a recycling point before scanning.</p>
      
      <div class="location-status">
        <div class="location-icon" :class="{'location-found': userLocation.status === 'found'}">
          <span v-if="userLocation.status === 'searching'">🔍</span>
          <span v-else-if="userLocation.status === 'found'">📍</span>
          <span v-else>❓</span>
        </div>
        <div class="location-info">
          <p v-if="userLocation.status === 'searching'">Searching for your location...</p>
          <p v-else-if="userLocation.status === 'found'">
            Location found: <strong>{{ userLocation.address }}</strong>
          </p>
          <p v-else>Unable to detect your location. Please try again.</p>
        </div>
      </div>
      
      <div class="nearby-recycling-points" v-if="userLocation.status === 'found'">
        <h3>Nearby Recycling Points</h3>
        <div class="recycling-points-list">
          <div 
            v-for="(point, index) in nearbyRecyclingPoints" 
            :key="index" 
            class="recycling-point-item"
            :class="{'selected': selectedRecyclingPoint === point.id}"
            @click="selectRecyclingPoint(point.id)"
          >
            <div class="point-distance">{{ point.distance }}</div>
            <div class="point-details">
              <h4>{{ point.name }}</h4>
              <p>{{ point.address }}</p>
            </div>
            <div class="point-select">
              <div class="select-indicator" v-if="selectedRecyclingPoint === point.id">✓</div>
            </div>
          </div>
        </div>
        
        <div class="location-actions">
          <button @click="simulateLocationSearch" class="location-btn" v-if="userLocation.status !== 'found'">
            Find My Location
          </button>
          <button 
            @click="verifyLocation" 
            class="verify-btn" 
            :disabled="!selectedRecyclingPoint"
            v-if="userLocation.status === 'found'"
          >
            Confirm & Proceed to Scan
          </button>
        </div>
      </div>
      
      <div class="location-actions" v-if="userLocation.status !== 'found'">
        <button @click="simulateLocationSearch" class="location-btn">
          Find My Location
        </button>
      </div>
    </div>
    
    <div class="scan-section" v-if="locationVerified && !scanned">
      <div class="scanner-container">
        <div class="verified-location">
          <span class="verified-icon">✅</span>
          <p>Location verified: <strong>{{ verifiedRecyclingPoint.name }}</strong></p>
        </div>
        <div class="scanner-placeholder">
          <p>Please point your camera at the recycling point QR code</p>
          <div class="camera-icon">📷</div>
          <!-- In an actual project, integrate a real QR code scanning library, e.g., vue-qrcode-reader -->
        </div>
        <button @click="simulateScan" class="scan-btn">Simulate Scan</button>
      </div>
    </div>
    
    <div v-if="scanned" class="scan-result">
      <div class="success-icon">✅</div>
      <h2>Scan Successful!</h2>
      <div class="recycling-location">
        <p><strong>Recycling Point:</strong> {{ recyclingSpot.name }}</p>
        <p><strong>Address:</strong> {{ recyclingSpot.address }}</p>
      </div>
      <div class="points-awarded">
        <p>Congratulations! You've earned <span class="points">{{ pointsAwarded }}</span> points!</p>
        <p class="reward-explanation">Points can be redeemed for sponsor discounts and other rewards.</p>
      </div>
      <div class="actions">
        <button @click="goToRewards" class="reward-btn">View Rewards</button>
        <button @click="resetScan" class="reset-btn">Scan Again</button>
      </div>
    </div>
    
    <div class="instructions">
      <h3>How to Use</h3>
      <ol>
        <li>Visit a nearby e-waste recycling point</li>
        <li>Verify your location at the recycling center</li>
        <li>Scan the recycling point QR code</li>
        <li>Earn environmental points</li>
        <li>Redeem points for rewards</li>
      </ol>
    </div>
    
    <div class="recent-activity">
      <h3>Recent Activity</h3>
      <div v-if="activities.length > 0" class="activity-list">
        <div v-for="(activity, index) in activities" :key="index" class="activity-item">
          <div class="activity-icon">♻️</div>
          <div class="activity-details">
            <p class="activity-title">{{ activity.type }} at {{ activity.location }}</p>
            <p class="activity-points">+{{ activity.points }} points</p>
            <p class="activity-date">{{ formatDate(activity.date) }}</p>
          </div>
        </div>
      </div>
      <p v-else class="no-activity">You don't have any recycling activities yet</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ScanQRPage',
  data() {
    return {
      scanned: false,
      locationVerified: false,
      selectedRecyclingPoint: null,
      verifiedRecyclingPoint: null,
      recyclingSpot: {
        id: '',
        name: '',
        address: ''
      },
      userLocation: {
        status: 'initial', // 'initial', 'searching', 'found', 'error'
        address: '',
        coordinates: { lat: 0, lng: 0 }
      },
      nearbyRecyclingPoints: [
        { 
          id: 'spot1', 
          name: 'Melbourne E-Waste Recycling Center', 
          address: '58 Lonsdale St, Melbourne VIC 3000',
          distance: '350m away' 
        },
        { 
          id: 'spot2', 
          name: 'CBD Recycling Station', 
          address: '200 Spencer St, Melbourne VIC 3000',
          distance: '1.2km away' 
        },
        { 
          id: 'spot3', 
          name: 'South Melbourne Collection Point', 
          address: '320 Clarendon St, South Melbourne VIC 3205',
          distance: '2.5km away' 
        }
      ],
      pointsAwarded: 0,
      activities: []
    };
  },
  created() {
    this.initMockData();
  },
  methods: {
    initMockData() {
      this.activities = [
        {
          id: 'act1',
          type: 'E-Waste Recycling',
          location: 'Melbourne E-Waste Recycling Center',
          points: 35,
          date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 days ago
        },
        {
          id: 'act2',
          type: 'Battery Recycling',
          location: 'CBD Recycling Station',
          points: 15,
          date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000) // 15 days ago
        },
        {
          id: 'act3',
          type: 'Mobile Phone Recycling',
          location: 'Melbourne E-Waste Recycling Center',
          points: 50,
          date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 30 days ago
        }
      ];
    },
    simulateLocationSearch() {
      this.userLocation.status = 'searching';
      
      this.userLocation = {
        status: 'found',
        address: '120 Collins St, Melbourne VIC 3000',
        coordinates: { lat: -37.8136, lng: 144.9631 }
      };
    },
    selectRecyclingPoint(pointId) {
      this.selectedRecyclingPoint = pointId;
    },
    verifyLocation() {
      if (!this.selectedRecyclingPoint) return;
      
      const point = this.nearbyRecyclingPoints.find(p => p.id === this.selectedRecyclingPoint);
      if (point) {
        this.verifiedRecyclingPoint = point;
        this.locationVerified = true;
      }
    },
    simulateScan() {
      if (this.verifiedRecyclingPoint) {
        this.scanned = true;
        this.recyclingSpot = {
          id: this.verifiedRecyclingPoint.id,
          name: this.verifiedRecyclingPoint.name,
          address: this.verifiedRecyclingPoint.address
        };
        
        this.pointsAwarded = Math.floor(Math.random() * 41) + 10;
        
        this.recordLocalActivity();
      }
    },
    recordLocalActivity() {
      const newActivity = {
        id: 'act' + (this.activities.length + 1),
        type: 'E-Waste Recycling',
        location: this.recyclingSpot.name,
        points: this.pointsAwarded,
        date: new Date()
      };

      this.activities.unshift(newActivity);

      if (this.activities.length > 5) {
        this.activities = this.activities.slice(0, 5);
      }
    },
    resetScan() {
      this.scanned = false;
      this.locationVerified = false;
      this.selectedRecyclingPoint = null;
      this.verifiedRecyclingPoint = null;
      this.recyclingSpot = { id: '', name: '', address: '' };
      this.pointsAwarded = 0;
      this.userLocation = {
        status: 'initial',
        address: '',
        coordinates: { lat: 0, lng: 0 }
      };
    },
    goToRewards() {
      this.$router.push('/rewards');
    },
    formatDate(dateString) {
      return new Date(dateString).toLocaleString();
    }
  }
};
</script>

<style scoped>
.scan-qr-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.page-title {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 30px;
}

/* Location Section Styles */
.location-section {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 25px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  margin-bottom: 30px;
}

.location-section h2 {
  text-align: center;
  margin-bottom: 15px;
  color: #2c3e50;
}

.location-status {
  display: flex;
  align-items: center;
  margin: 20px 0;
  padding: 15px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.location-icon {
  font-size: 24px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #f1f1f1;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 15px;
}

.location-icon.location-found {
  background-color: #e8f5e9;
  color: #4caf50;
}

.location-info {
  flex: 1;
}

.nearby-recycling-points {
  margin-top: 25px;
}

.nearby-recycling-points h3 {
  margin-bottom: 15px;
  color: #2c3e50;
}

.recycling-points-list {
  max-height: 300px;
  overflow-y: auto;
  margin-bottom: 20px;
}

.recycling-point-item {
  display: flex;
  padding: 15px;
  background-color: white;
  border-radius: 8px;
  margin-bottom: 10px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.2s ease;
}

.recycling-point-item:hover {
  background-color: #f5f5f5;
}

.recycling-point-item.selected {
  background-color: #e8f5e9;
  border: 1px solid #4caf50;
}

.point-distance {
  background-color: #f1f1f1;
  color: #666;
  font-size: 14px;
  padding: 5px 10px;
  border-radius: 15px;
  margin-right: 15px;
  height: fit-content;
}

.point-details {
  flex: 1;
}

.point-details h4 {
  margin: 0 0 5px 0;
  color: #2c3e50;
}

.point-details p {
  margin: 0;
  color: #666;
  font-size: 14px;
}

.point-select {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
}

.select-indicator {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: #4caf50;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
}

.location-actions {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.location-btn, .verify-btn {
  padding: 12px 25px;
  font-size: 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

.location-btn {
  background-color: #2196f3;
  color: white;
}

.location-btn:hover {
  background-color: #1976d2;
}

.verify-btn {
  background-color: #4caf50;
  color: white;
}

.verify-btn:hover {
  background-color: #3d8b40;
}

.verify-btn:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

/* Verified location banner */
.verified-location {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #e8f5e9;
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.verified-icon {
  margin-right: 10px;
  font-size: 20px;
}

.verified-location p {
  margin: 0;
  color: #2c3e50;
}

/* Existing scan section styles */
.scan-section {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 25px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  margin-bottom: 30px;
  text-align: center;
}

.scanner-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.scanner-placeholder {
  width: 250px;
  height: 250px;
  margin: 0 auto;
  border: 2px dashed #ccc;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
}

.camera-icon {
  font-size: 48px;
  margin-top: 15px;
}

.scan-btn {
  background-color: #4caf50;
  color: white;
  padding: 12px 25px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
}

.scan-btn:hover {
  background-color: #3d8b40;
}

.scan-result {
  padding: 20px;
  background-color: #e8f5e9;
  border-radius: 8px;
  margin-top: 20px;
  text-align: center;
}

.success-icon {
  font-size: 48px;
  margin-bottom: 10px;
}

.recycling-location {
  margin: 15px 0;
  padding: 10px;
  background-color: white;
  border-radius: 4px;
  text-align: left;
}

.points-awarded {
  margin: 20px 0;
  font-size: 18px;
}

.points {
  font-size: 24px;
  font-weight: bold;
  color: #4caf50;
}

.reward-explanation {
  font-size: 14px;
  color: #666;
  margin-top: 5px;
}

.actions {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 20px;
}

.reward-btn {
  background-color: #2196f3;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
}

.reset-btn {
  background-color: #757575;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
}

.reward-btn:hover {
  background-color: #1976d2;
}

.reset-btn:hover {
  background-color: #616161;
}

.instructions {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 25px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  margin-bottom: 30px;
}

.instructions h3 {
  margin-bottom: 15px;
  color: #2c3e50;
}

.instructions ol {
  margin-left: 20px;
  line-height: 1.6;
}

.instructions li {
  margin-bottom: 10px;
}

.recent-activity {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 25px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.recent-activity h3 {
  margin-bottom: 15px;
  color: #2c3e50;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.activity-item {
  display: flex;
  align-items: center;
  padding: 12px;
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.activity-icon {
  font-size: 24px;
  margin-right: 15px;
}

.activity-details {
  flex: 1;
}

.activity-title {
  font-weight: 600;
  margin-bottom: 5px;
}

.activity-points {
  color: #4caf50;
  font-weight: 600;
}

.activity-date {
  font-size: 12px;
  color: #666;
  margin-top: 5px;
}

.no-activity {
  text-align: center;
  color: #666;
  font-style: italic;
  padding: 15px;
}

@media (max-width: 600px) {
  .actions {
    flex-direction: column;
  }
  
  .reward-btn, .reset-btn {
    width: 100%;
  }
}
</style> 