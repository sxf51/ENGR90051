<template>
    <div class="profile">
      <h2>Personal Information</h2>
      
      <div v-if="user" class="profile-content">
        <div class="user-info">
          <h3>{{ user.username }}</h3>
          <p>registration date: {{ formatDate(user.joinedAt) }}</p>
          <p>Environmental protection points: {{ user.points }}</p>
        </div>
        
        <div class="badges-section">
          <h3>My medal</h3>
          <div v-if="user.badges.length > 0" class="badges-grid">
            <div v-for="(badge, index) in user.badges" :key="index" class="badge">
              <div class="badge-icon">
                {{ getBadgeEmoji(badge) }}
              </div>
              <div class="badge-name">{{ getBadgeName(badge) }}</div>
            </div>
          </div>
          <p v-else>You haven't earned any medals yet. Participating in recycling activities can get you medals!</p>
        </div>
        
        <button @click="addParticipationBadge" class="action-btn">
          Participate in recycling activities
        </button>
      </div>
      
      <div v-else class="loading">
        Loading...
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';

  import {HOST_URL, SERVER_PORT} from '../../config'
  
  export default {
    name: 'UserProfile',
    data() {
      return {
        user: null
      };
    },
    created() {
      this.fetchUserData();
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
          this.user = response.data;
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      },
      formatDate(dateString) {
        return new Date(dateString).toLocaleDateString();
      },
      getBadgeEmoji(badge) {
        const emojis = {
          welcome: '🎉',
          participant: '♻️',
          eco_hero: '🌍',
          veteran: '🏆'
        };
        return emojis[badge] || '🏅';
      },
      getBadgeName(badge) {
        const names = {
          welcome: '欢迎奖章',
          participant: '参与奖章',
          eco_hero: '环保英雄',
          veteran: '资深回收者'
        };
        return names[badge] || badge;
      },
      async addParticipationBadge() {
        try {
          await axios.post(HOST_URL + `:${SERVER_PORT}/api/user/${this.user.email}/badges`, {
            badge: 'participant'
          });
          
          // 更新用户数据
          await this.fetchUserData();
          
          alert('恭喜您获得了参与奖章！感谢您为环保做出的贡献！');
        } catch (error) {
          console.error('Error adding badge:', error);
          alert('添加奖章失败，请重试');
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .profile {
    max-width: 800px;
    margin: 0 auto;
    padding: 1rem;
  }
  
  .profile-content {
    text-align: left;
    margin-top: 1.5rem;
  }
  
  .user-info {
    background-color: #f5f5f5;
    padding: 1rem;
    border-radius: 4px;
    margin-bottom: 1.5rem;
  }
  
  .badges-section {
    margin: 2rem 0;
  }
  
  .badges-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 1rem;
    margin-top: 1rem;
  }
  
  .badge {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1rem;
    background-color: #f0f8ff;
    border-radius: 4px;
  }
  
  .badge-icon {
    font-size: 2rem;
    margin-bottom: 0.5rem;
  }
  
  .badge-name {
    font-size: 0.9rem;
    text-align: center;
  }
  
  .action-btn {
    background-color: #42b983;
    color: white;
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    cursor: pointer;
    margin-top: 1rem;
  }
  
  .action-btn:hover {
    background-color: #3aa876;
  }
  
  .loading {
    margin: 2rem 0;
    font-style: italic;
    color: #666;
  }
  </style>
  