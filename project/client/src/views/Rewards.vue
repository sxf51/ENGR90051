<template>
  <div class="rewards-container">
    <h1 class="page-title">Environmental Points Exchange</h1>
    
    <div class="user-points-section">
      <div class="points-display">
        <div class="points-icon">🏆</div>
        <div class="points-info">
          <h2>My Points</h2>
          <div class="points-value">{{ userPoints }} <span class="points-label">pts</span></div>
        </div>
      </div>
      <p class="points-hint">Earn points by recycling e-waste and participating in environmental activities</p>
    </div>
    
    <div class="coupons-section">
      <h2>Available Rewards</h2>
      <div class="coupons-grid">
        <div v-for="(coupon, index) in availableCoupons" :key="index" class="coupon-card">
          <div class="coupon-sponsor">{{ coupon.sponsor }}</div>
          <div class="coupon-content">
            <div class="coupon-title">{{ coupon.title }}</div>
            <div class="coupon-value">{{ formatCouponValue(coupon) }}</div>
            <div class="coupon-description">{{ coupon.description }}</div>
            <div class="coupon-expiry">Valid until: {{ formatDate(coupon.expiryDate) }}</div>
            <div class="coupon-points">
              <span class="points-cost">{{ coupon.pointsCost }}</span> points
            </div>
          </div>
          <button 
            @click="redeemCoupon(coupon)" 
            class="redeem-btn"
            :disabled="userPoints < coupon.pointsCost || coupon.stock <= 0"
          >
            {{ userPoints < coupon.pointsCost ? 'Not Enough Points' : (coupon.stock <= 0 ? 'Out of Stock' : 'Redeem Now') }}
          </button>
        </div>
      </div>
    </div>
    
    <div v-if="userCoupons.length > 0" class="my-coupons-section">
      <h2>My Rewards</h2>
      <div class="my-coupons-list">
        <div v-for="(coupon, index) in userCoupons" :key="index" class="my-coupon-card">
          <div class="coupon-sponsor">{{ coupon.sponsor }}</div>
          <div class="coupon-content">
            <div class="coupon-title">{{ coupon.title }}</div>
            <div class="coupon-value">{{ formatCouponValue(coupon) }}</div>
            <div class="coupon-expiry">Valid until: {{ formatDate(coupon.expiryDate) }}</div>
          </div>
          <div class="coupon-code">
            <span>Code: </span>
            <span class="code">{{ coupon.code }}</span>
            <button @click="copyCouponCode(coupon.code)" class="copy-btn">Copy</button>
          </div>
          <div class="coupon-status" :class="{ 'used': coupon.used }">
            {{ coupon.used ? 'Used' : 'Unused' }}
          </div>
        </div>
      </div>
    </div>
    
    <!-- Confirm Redemption Modal -->
    <div v-if="showConfirmModal" class="confirm-modal">
      <div class="modal-content">
        <h3>Confirm Redemption</h3>
        <p>Are you sure you want to redeem this reward?</p>
        <div class="confirm-coupon-details">
          <p><strong>{{ selectedCoupon.sponsor }}</strong></p>
          <p>{{ selectedCoupon.title }}</p>
          <p>{{ formatCouponValue(selectedCoupon) }}</p>
          <p class="confirm-points-cost">Costs {{ selectedCoupon.pointsCost }} points</p>
        </div>
        <div class="modal-actions">
          <button @click="cancelRedeem" class="cancel-btn">Cancel</button>
          <button @click="confirmRedeem" class="confirm-btn">Confirm</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { HOST_URL, SERVER_PORT } from '../../config';

export default {
  name: 'RewardsPage',
  data() {
    return {
      userPoints: 100,
      availableCoupons: [],
      userCoupons: [],
      showConfirmModal: false,
      selectedCoupon: null
    };
  },
  created() {
    this.fetchUserData();
    this.fetchAvailableCoupons();
    this.fetchUserCoupons();
  },
  methods: {
    async fetchUserData() {
      const userEmail = localStorage.getItem('userEmail');
      if (!userEmail) {
        this.$router.push('/register');
        return;
      }
      
      try {
        const response = await axios.get(HOST_URL + `:${SERVER_PORT}/api/user/${userEmail}`);
        this.userPoints = response.data.points || 0;
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    },
    async fetchAvailableCoupons() {
      try {
        const response = await axios.get(HOST_URL + `:${SERVER_PORT}/api/coupons/available`);
        this.availableCoupons = response.data;
      } catch (error) {
        console.error('Error fetching available coupons:', error);
        // Mock data
        this.availableCoupons = [
          {
            id: 'c1',
            sponsor: 'Green Tech Co.',
            title: 'New Electronics Discount',
            type: 'percent',
            value: 15,
            description: 'Get 15% off any new eco-friendly electronic product',
            expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days later
            pointsCost: 100,
            stock: 50
          },
          {
            id: 'c2',
            sponsor: 'Eco Appliances',
            title: 'Energy-Efficient Appliance Offer',
            type: 'amount',
            value: 50,
            description: '$50 off when you spend $300+ on energy-efficient appliances',
            expiryDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days later
            pointsCost: 80,
            stock: 0
          },
          {
            id: 'c3',
            sponsor: 'Sustainable Energy Ltd.',
            title: 'Solar Power Bank Discount',
            type: 'percent',
            value: 20,
            description: '20% off any solar charging product',
            expiryDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days later
            pointsCost: 120,
            stock: 30
          },
          {
            id: 'c4',
            sponsor: 'Eco Café',
            title: 'Free Drink Voucher',
            type: 'free',
            value: 1,
            description: 'Redeem for a free medium-sized drink at any location',
            expiryDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days later
            pointsCost: 50,
            stock: 20
          }
        ];
      }
    },
    async fetchUserCoupons() {
      const userEmail = localStorage.getItem('userEmail');
      if (!userEmail) return;
      
      try {
        const response = await axios.get(HOST_URL + `:${SERVER_PORT}/api/user/${userEmail}/coupons`);
        this.userCoupons = response.data;
      } catch (error) {
        console.error('Error fetching user coupons:', error);
        // Mock data
        this.userCoupons = [
          {
            id: 'uc1',
            sponsor: 'Green Tech Co.',
            title: 'New Electronics Discount',
            type: 'percent',
            value: 15,
            expiryDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
            code: 'ECO15OFF',
            used: false
          },
          {
            id: 'uc2',
            sponsor: 'Eco Café',
            title: 'Free Drink Voucher',
            type: 'free',
            value: 1,
            expiryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
            code: 'GREENCOFFEE123',
            used: true
          }
        ];
      }
    },
    formatCouponValue(coupon) {
      switch (coupon.type) {
        case 'percent':
          return `${coupon.value}% discount`;
        case 'amount':
          return `$${coupon.value} off`;
        case 'free':
          return 'Free item';
        default:
          return `Voucher`;
      }
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    },
    redeemCoupon(coupon) {
      if (this.userPoints < coupon.pointsCost || coupon.stock <= 0) return;
      
      this.selectedCoupon = coupon;
      this.showConfirmModal = true;
    },
    cancelRedeem() {
      this.showConfirmModal = false;
      this.selectedCoupon = null;
    },
    async confirmRedeem() {
      const userEmail = localStorage.getItem('userEmail');
      if (!userEmail || !this.selectedCoupon) return;
      
      try {
        // Send redemption request to backend
        await axios.post(HOST_URL + `:${SERVER_PORT}/api/user/${userEmail}/redeem`, {
          couponId: this.selectedCoupon.id,
          pointsCost: this.selectedCoupon.pointsCost
        });
        
        // Update user points
        this.userPoints -= this.selectedCoupon.pointsCost;
        
        // Update coupon stock
        const couponIndex = this.availableCoupons.findIndex(c => c.id === this.selectedCoupon.id);
        if (couponIndex >= 0) {
          this.availableCoupons[couponIndex].stock--;
        }
        
        // Generate redemption code
        const couponCode = this.generateCouponCode(this.selectedCoupon.sponsor);
        
        // Add the redeemed coupon to user's list
        this.userCoupons.unshift({
          ...this.selectedCoupon,
          code: couponCode,
          used: false
        });
        
        // Close modal
        this.showConfirmModal = false;
        this.selectedCoupon = null;
        
        // Show success message
        alert('Reward successfully redeemed!');
      } catch (error) {
        console.error('Error redeeming coupon:', error);
        alert('Redemption failed. Please try again.');
      }
    },
    generateCouponCode(sponsor) {
      // Simple code generation logic, might need more complex logic in production
      const prefix = sponsor.slice(0, 3).toUpperCase();
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let code = prefix;
      
      for (let i = 0; i < 8; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      
      return code;
    },
    copyCouponCode(code) {
      navigator.clipboard.writeText(code)
        .then(() => {
          alert('Code copied to clipboard');
        })
        .catch(err => {
          console.error('Could not copy code: ', err);
          // Fallback copy method
          const textArea = document.createElement('textarea');
          textArea.value = code;
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);
          alert('Code copied to clipboard');
        });
    }
  }
};
</script>

<style scoped>
.rewards-container {
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

.user-points-section {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 25px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  margin-bottom: 30px;
  text-align: center;
}

.points-display {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 15px;
}

.points-icon {
  font-size: 48px;
  margin-right: 20px;
}

.points-info h2 {
  margin-bottom: 5px;
  color: #2c3e50;
}

.points-value {
  font-size: 36px;
  font-weight: bold;
  color: #4caf50;
}

.points-label {
  font-size: 18px;
  color: #666;
}

.points-hint {
  color: #666;
  font-style: italic;
}

.coupons-section, .my-coupons-section {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 25px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  margin-bottom: 30px;
}

.coupons-section h2, .my-coupons-section h2 {
  margin-bottom: 20px;
  color: #2c3e50;
  border-bottom: 2px solid #e0e0e0;
  padding-bottom: 10px;
}

.coupons-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.coupon-card {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
  background-color: white;
  position: relative;
}

.coupon-sponsor {
  background-color: #4caf50;
  color: white;
  padding: 8px 12px;
  font-weight: bold;
}

.coupon-content {
  padding: 15px;
}

.coupon-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
}

.coupon-value {
  font-size: 24px;
  color: #e91e63;
  font-weight: bold;
  margin-bottom: 10px;
}

.coupon-description {
  color: #666;
  margin-bottom: 10px;
  font-size: 14px;
}

.coupon-expiry {
  font-size: 12px;
  color: #999;
  margin-bottom: 10px;
}

.coupon-points {
  font-size: 14px;
  color: #666;
}

.points-cost {
  font-weight: bold;
  color: #4caf50;
}

.redeem-btn {
  display: block;
  width: 100%;
  border: none;
  background-color: #4caf50;
  color: white;
  padding: 12px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.redeem-btn:hover:not(:disabled) {
  background-color: #3d8b40;
}

.redeem-btn:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.my-coupons-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.my-coupon-card {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
  background-color: white;
  position: relative;
}

.coupon-code {
  padding: 15px;
  background-color: #f5f5f5;
  display: flex;
  align-items: center;
}

.code {
  font-family: monospace;
  font-weight: bold;
  margin: 0 10px;
}

.copy-btn {
  background-color: #2196f3;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

.copy-btn:hover {
  background-color: #1976d2;
}

.coupon-status {
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 5px 10px;
  background-color: #4caf50;
  color: white;
  border-radius: 4px;
  font-size: 12px;
}

.coupon-status.used {
  background-color: #f44336;
}

/* Modal styles */
.confirm-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  border-radius: 8px;
  width: 90%;
  max-width: 400px;
  padding: 25px;
}

.modal-content h3 {
  margin-bottom: 15px;
  color: #2c3e50;
}

.confirm-coupon-details {
  background-color: #f5f5f5;
  padding: 15px;
  border-radius: 4px;
  margin: 15px 0;
}

.confirm-points-cost {
  margin-top: 10px;
  color: #4caf50;
  font-weight: bold;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.cancel-btn {
  background-color: #f5f5f5;
  color: #333;
  border: none;
  padding: 10px 15px;
  border-radius: 4px;
  cursor: pointer;
}

.confirm-btn {
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 4px;
  cursor: pointer;
}

.cancel-btn:hover {
  background-color: #e0e0e0;
}

.confirm-btn:hover {
  background-color: #3d8b40;
}

@media (max-width: 600px) {
  .points-display {
    flex-direction: column;
  }
  
  .points-icon {
    margin-right: 0;
    margin-bottom: 10px;
  }
  
  .coupons-grid {
    grid-template-columns: 1fr;
  }
}
</style> 