<template>
  <div id="app">
    <header>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>E-Waste Awareness | The Growing Electronic Waste Problem</title>
      <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700&family=Roboto:wght@300;400;700&display=swap" rel="stylesheet">
      <h1>E-Waste Awareness</h1>
      <p>Understanding the global electronic waste crisis</p>
      <nav>
        <router-link to="/">Home</router-link>
        <router-link to="/map">Map</router-link>
        <router-link to="/data-wipe">Data Wipe Guide</router-link>
        <router-link to="/evaluate">Evaluate Your Device</router-link>
        <router-link to="/register">Register</router-link>
        <router-link to="/profile" v-if="isLoggedIn">Profile</router-link>
      </nav>
      <div class="views-counter">Total visits: {{ views }}</div>
    </header>
      <main>
        <router-view @login="handleLogin" />
      </main>
      <body class="container" v-if="!$route.meta.hideBody">
        <div class="chat-box">
        <config-provider :global-config="enConfig">
          <t-chat
            clear-history
            :data="chatData"
            :text-loading="loading"
            :is-stream-load="isStreamLoad"
            @clear="clearConfirm"
          >
            <template #name="{ item }">
              {{ item?.name || 'admin' }}
            </template>
            <template #avatar="{ item }">
              <t-avatar :image="item?.avatar" />
            </template>
            <template #datetime="{ item }">
              {{ item?.datetime }}
            </template>
            <template #content="{ item }">
              <t-chat-content :content="item?.content" />
            </template>
            <template #footer>
              <t-chat-input :stop-disabled="isStreamLoad" @send="inputEnter" @stop="handleStop"/>
            </template>
          </t-chat>
        </config-provider>
        </div>

        <section id="problem" class="content-section">
              <h2>The Growing E-Waste Problem</h2>
              <img src="./images/e-waste-pile.jpg" alt="Pile of electronic waste" class="section-img">
              <p>Electronic waste, or e-waste, refers to discarded electrical or electronic devices. Used electronics which are destined for refurbishment, reuse, resale, salvage recycling through material recovery, or disposal are also considered e-waste.</p>
              <p>With the rapid advancement of technology and planned obsolescence of electronic devices, e-waste has become the fastest-growing waste stream in the world. Many of these products contain toxic materials that can leach into soil and water when improperly disposed of.</p>
        </section>

        <section id="stats" class="content-section">
              <h2>E-Waste by the Numbers</h2>
              <div class="stats-grid">
                  <div class="stat-item">
                      <div class="stat-number">53.6</div>
                      <div class="stat-desc">Million metric tons of e-waste generated globally in 2019</div>
                  </div>
                  <div class="stat-item">
                      <div class="stat-number">17.4%</div>
                      <div class="stat-desc">Of e-waste was properly recycled in 2019</div>
                  </div>
                  <div class="stat-item">
                      <div class="stat-number">$57B</div>
                      <div class="stat-desc">Value of raw materials in e-waste discarded in 2019</div>
                  </div>
                  <div class="stat-item">
                      <div class="stat-number">74.7M</div>
                      <div class="stat-desc">Metric tons projected by 2030</div>
                  </div>
              </div>
              <p class="source">Source: Global E-waste Statistics Partnership, 2020</p>
        </section>

          <section id="solutions" class="content-section">
              <h2>What Can We Do?</h2>
              <div class="solutions-grid">
                  <div class="solution-item">
                      <h3>Reduce</h3>
                      <p>Think before you buy. Do you really need that upgrade? Consider repairing instead of replacing.</p>
                  </div>
                  <div class="solution-item">
                      <h3>Reuse</h3>
                      <p>Donate or sell functioning electronics. Many organizations refurbish devices for those in need.</p>
                  </div>
                  <div class="solution-item">
                      <h3>Recycle</h3>
                      <p>Find certified e-waste recyclers in your area. Never throw electronics in regular trash.</p>
                  </div>
                  <div class="solution-item">
                      <h3>Advocate</h3>
                      <p>Support legislation for right-to-repair laws and responsible e-waste management policies.</p>
                  </div>
              </div>
          </section>

          <section id="recycling" class="content-section">
              <h2>Proper E-Waste Recycling</h2>
              <div class="recycling-info">
                  <div class="recycling-text">
                      <h3>Why Recycle Electronics?</h3>
                      <ul>
                          <li>Prevents toxic materials from entering landfills</li>
                          <li>Recovers valuable materials like gold, silver, and copper</li>
                          <li>Reduces energy needed to mine new materials</li>
                          <li>Protects data security through proper destruction</li>
                      </ul>
                      <h3>How to Recycle:</h3>
                      <ol>
                          <li>Check with manufacturers - many offer take-back programs</li>
                          <li>Find certified e-waste recyclers in your area</li>
                          <li>Remove all personal data before recycling</li>
                          <li>Consider donating if the device still works</li>
                      </ol>
                  </div>
                  <div class="recycling-img">
                      <img src="./images/recycling-process.jpg" alt="E-waste recycling process">
                  </div>
              </div>
          </section>

          <section id="resources" class="content-section">
              <h2>Resources & Further Reading</h2>
              <div class="resources-list">
                  <div class="resource-item">
                      <h3>Organizations</h3>
                      <ul>
                          <li><a href="https://www.ewaste1.com/" target="_blank">eWaste1</a> - Information on e-waste recycling</li>
                          <li><a href="https://www.epa.gov/international-cooperation/cleaning-electronic-waste-e-waste" target="_blank">EPA E-Waste Program</a></li>
                          <li><a href="https://www.basel.int/" target="_blank">Basel Convention</a> - Global e-waste treaty</li>
                      </ul>
                  </div>
                  <div class="resource-item">
                      <h3>Reports & Data</h3>
                      <ul>
                          <li><a href="https://globalewaste.org/" target="_blank">Global E-Waste Statistics Partnership</a></li>
                          <li><a href="https://www.itu.int/en/ITU-D/Environment/Pages/Spotlight/Global-Ewaste-Monitor-2020.aspx" target="_blank">Global E-Waste Monitor</a></li>
                      </ul>
                  </div>
                  <div class="resource-item">
                      <h3>Take Action</h3>
                      <ul>
                          <li><a href="https://www.ewastepartners.com/" target="_blank">Find Certified Recyclers</a></li>
                          <li><a href="https://ifixit.org/" target="_blank">iFixit Repair Guides</a></li>
                          <li><a href="https://www.donatecomputers.org/" target="_blank">Computer Donation Programs</a></li>
                      </ul>
                  </div>
              </div>
          </section>
      </body>

    <footer>
          <div class="container">
              <p>&copy; 2025 E-Waste Awareness Initiative. All rights reserved.</p>
              <p>This is a static informational website about electronic waste.</p>
              <div class="footer-links">
                  <a href="#">Privacy Policy</a> | 
                  <a href="#">Contact Us</a> | 
                  <a href="#">About This Project</a>
              </div>
          </div>
    </footer>
  </div>
</template>

<script setup>
import { ConfigProvider } from '@tdesign-vue-next/chat/es/config-provider';
import enConfig from 'tdesign-vue-next/es/locale/en_US';
</script>

<script>
import axios from 'axios';

import { HOST_URL, SERVER_PORT } from '../config';

export default {
  name: 'App',
  data() {
    return {
      views: 0,
      isLoggedIn: true,
      loading: false,
      isStreamLoad: false,
      chatData: [
        {
          avatar: 'https://tdesign.gtimg.com/site/chat-avatar.png',
          name: 'E-waste AI',
          datetime: 'Today at 16:38',
          content: 'You can recycle your old iPhone through **Apple\'s Trade In program** (online or in-store), \
          **carriers like Verizon/AT&T**, **Best Buy**, **Amazon Trade-In**, or **e-waste recyclers like Call2Recycle**. \
          For broken phones, try **eco-friendly recyclers** or donate to charities like **Cell Phones for Soldiers**. \
          Always wipe your data first!',
          role: 'assistant',
        },
        {
          avatar: 'https://tdesign.gtimg.com/site/avatar.jpg',
          name: 'Admin',
          datetime: 'Today at 16:38',
          content: 'Where can I recycle my old iPhone?',
          role: 'user',
        },
      ]
    };
  },
  created() {
    // 增加点击量
    axios.post(HOST_URL + `:${SERVER_PORT}/api/views/increment`)
      .catch(error => console.error('Error incrementing views:', error));
    this.fetchViews();
    // 检查用户是否已登录
    if (localStorage.getItem('userEmail')) {
      this.isLoggedIn = true;
    }
  },
  methods: {
    async fetchViews() {
      try {
        const response = await axios.get(HOST_URL + `:${SERVER_PORT}/api/views`);
        this.views = response.data.views;
      } catch (error) {
        console.error('Error fetching views:', error);
      }
    },
    clearConfirm() {
      this.chatData = [];
    },
    handleStop () {
      this.isStreamLoad = false;
    },
    inputEnter (inputValue) {
      if (this.isStreamLoad) {
        return;
      }
      if (!inputValue) return;
      this.isStreamLoad = true;
      this.loading = true;
      // 模拟接口请求响应中
      setTimeout(() => {
        this.chatData = [
        {
          avatar: 'https://tdesign.gtimg.com/site/chat-avatar.png',
          name: 'E-waste AI',
          datetime: 'Today at 16:39',
          content: `Recycling your old iPhone is a great way to reduce e-waste and potentially earn some money or help the environment. Here are some options for recycling your old iPhone:

### **1. Apple Recycling Program (Apple Trade In)**  
📍 **Where:** Online or at an Apple Store  
🔗 [Apple Trade In Website](https://www.apple.com/shop/trade-in)  
✅ **How it works:**  
   - Get an estimate for your iPhone’s trade-in value.  
   - If eligible, you’ll receive an Apple Gift Card or credit toward a new device.  
   - If the device has no value, Apple will recycle it for free.  

### **2. Carrier Trade-In Programs**  
📍 **Where:** Major carriers like Verizon, AT&T, T-Mobile, or Sprint  
✅ **How it works:**  
   - Trade in your old iPhone for credit toward a new phone or bill discount.  
   - Check your carrier’s website for details.  

### **3. Electronics Retailers**  
📍 **Where:** Best Buy, Amazon, Gazelle, Decluttr  
✅ **How it works:**  
   - **Best Buy** accepts old phones for recycling (sometimes offers gift cards).  
   - **Amazon Trade-In** offers gift cards for eligible devices.  
   - **Gazelle & Decluttr** pay cash for iPhones in good condition.  

### **4. Eco-Friendly Recycling (If Broken/Unusable)**  
📍 **Where:** Certified e-waste recyclers  
✅ **Options:**  
   - **Call2Recycle** ([www.call2recycle.org](https://www.call2recycle.org))  
   - **e-Stewards** ([www.e-stewards.org](https://www.e-stewards.org))  
   - **Earth911** ([www.earth911.com](https://www.earth911.com)) – Locate nearby drop-off centers.  

### **5. Donate for a Cause**  
📍 **Where:** Nonprofits like:  
   - **Cell Phones for Soldiers** ([www.cellphonesforsoldiers.com](https://www.cellphonesforsoldiers.com))  
   - **National Coalition Against Domestic Violence** ([www.ncadv.org](https://www.ncadv.org))  

### **Before You Recycle:**  
- **Back up your data** (iCloud or iTunes).  
- **Sign out of iCloud & erase your iPhone** (Settings > General > Reset > Erase All Content and Settings).  
- **Remove SIM card** (if applicable).  

Would you like help estimating your iPhone’s trade-in value? Let me know the model and condition! 😊`,
          role: 'assistant',
        },
        {
          avatar: 'https://tdesign.gtimg.com/site/avatar.jpg',
          name: 'Admin',
          datetime: 'Today at 16:39',
          content: 'Where can I recycle my old iPhone?',
          role: 'user',
        },
      ]
      this.loading = false;
      }, 300);
      //   模拟流式数据加载中
      setTimeout(() => {
        this.isStreamLoad = false;
      }, 5000);
    },
    handleLogin(email) {
      this.isLoggedIn = true;
      localStorage.setItem('userEmail', email);
    }
  }
};
</script>

<style>
/* 基本样式 */
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

header {
  background-color: #42b983;
  padding: 1rem;
  color: white;
}

nav {
  margin: 1rem 0;
}

nav a {
  color: white;
  margin: 0 1rem;
  text-decoration: none;
}

nav a.router-link-exact-active {
  font-weight: bold;
  text-decoration: underline;
}

.views-counter {
  margin-top: 0.5rem;
  font-size: 0.9rem;
}

main {
  flex: 1;
  padding: 1rem;
}

footer {
  background-color: #2c3e50;
  color: white;
  padding: 1rem;
  margin-top: auto;
}

/** Chatbox  */
/* 应用滚动条样式 */
::-webkit-scrollbar-thumb {
  background-color: var(--td-scrollbar-color);
}
::-webkit-scrollbar-thumb:horizontal:hover {
  background-color: var(--td-scrollbar-hover-color);
}
::-webkit-scrollbar-track {
  background-color: var(--td-scroll-track-color);
}
.chat-box {
  position: relative;
  .bottomBtn {
    position: absolute;
    left: 50%;
    margin-left: -20px;
    bottom: 210px;
    padding: 0;
    border: 0;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    box-shadow: 0px 8px 10px -5px rgba(0, 0, 0, 0.08), 0px 16px 24px 2px rgba(0, 0, 0, 0.04),
      0px 6px 30px 5px rgba(0, 0, 0, 0.05);
  }
  .to-bottom {
    width: 40px;
    height: 40px;
    border: 1px solid #dcdcdc;
    box-sizing: border-box;
    background: var(--td-bg-color-container);
    border-radius: 50%;
    font-size: 24px;
    line-height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    .t-icon {
      font-size: 24px;
    }
  }
}

.model-select {
  display: flex;
  align-items: center;
  .t-select {
    width: 112px;
    height: 32px;
    margin-right: 8px;
    .t-input {
      border-radius: 32px;
      padding: 0 15px;
    }
  }
  .check-box {
    width: 112px;
    height: 32px;
    border-radius: 32px;
    border: 0;
    background: #e7e7e7;
    color: rgba(0, 0, 0, 0.9);
    box-sizing: border-box;
    flex: 0 0 auto;
    .t-button__text {
      display: flex;
      align-items: center;
      justify-content: center;
      span {
        margin-left: 4px;
      }
    }
  }
  .check-box.is-active {
    border: 1px solid #d9e1ff;
    background: #f2f3ff;
    color: var(--td-brand-color);
  }
}

/* Global Styles */
:root {
    --primary-color: #2c7873;
    --secondary-color: #6fb98f;
    --accent-color: #f8b400;
    --dark-color: #2d3436;
    --light-color: #f5f5f5;
    --text-color: #333;
    --text-light: #777;
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
  text-align: left;
  font-family: 'Open Sans', sans-serif;
  color: var(--text-color);
  line-height: 1.6;
  background-color: #fff;
}

h1, h2, h3, h4 {
    font-family: 'Roboto', sans-serif;
    font-weight: 700;
    margin-bottom: 1rem;
    color: var(--dark-color);
}

p {
    margin-bottom: 1rem;
}

a {
    text-decoration: none;
    color: var(--primary-color);
}

a:hover {
    color: var(--secondary-color);
}

.container {
    width: 90%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

/* Header Styles */
header {
    background-color: var(--primary-color);
    color: white;
    padding: 2rem 0;
    text-align: center;
}

header h1 {
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
    color: white;
}

header p {
    font-size: 1.2rem;
    color: rgba(255, 255, 255, 0.9);
}

/* Navigation */
nav {
    background-color: var(--dark-color);
    position: sticky;
    top: 0;
    z-index: 100;
}

nav ul {
    display: flex;
    list-style: none;
    justify-content: center;
}

nav li {
    margin: 0 15px;
}

nav a {
    color: white;
    padding: 1rem 0;
    display: inline-block;
    font-weight: 600;
    transition: color 0.3s;
}

nav a:hover {
    color: var(--accent-color);
}


/* Content Sections */
.content-section {
    padding: 3rem 0;
    border-bottom: 1px solid #eee;
}

.section-img {
    width: 100%;
    max-height: 400px;
    object-fit: cover;
    margin: 1.5rem 0;
    border-radius: 5px;
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
}

/* Statistics Grid */
.stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 2rem;
    margin: 2rem 0;
}

.stat-item {
    background-color: var(--light-color);
    padding: 1.5rem;
    border-radius: 5px;
    text-align: center;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}

.stat-number {
    font-size: 2.5rem;
    font-weight: 700;
    color: var(--primary-color);
    margin-bottom: 0.5rem;
}

.stat-desc {
    font-size: 0.9rem;
    color: var(--text-light);
}

.source {
    font-size: 0.8rem;
    font-style: italic;
    color: var(--text-light);
    text-align: right;
}

/* Solutions Grid */
.solutions-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
    margin: 2rem 0;
}

.solution-item {
    text-align: center;
    padding: 1.5rem;
    border: 1px solid #eee;
    border-radius: 5px;
    transition: transform 0.3s, box-shadow 0.3s;
}

.solution-item:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.solution-item img {
    width: 60px;
    height: 60px;
    margin-bottom: 1rem;
}

.solution-item h3 {
    color: var(--primary-color);
}

/* Recycling Section */
.recycling-info {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    align-items: center;
    margin: 2rem 0;
}

.recycling-text ul, .recycling-text ol {
    margin-left: 1.5rem;
    margin-bottom: 1.5rem;
}

.recycling-text li {
    margin-bottom: 0.5rem;
}

.recycling-img img {
    width: 100%;
    border-radius: 5px;
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
}

/* Resources Section */
.resources-list {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    margin: 2rem 0;
}

.resource-item {
    background-color: var(--light-color);
    padding: 1.5rem;
    border-radius: 5px;
}

.resource-item h3 {
    color: var(--primary-color);
    margin-bottom: 1rem;
    border-bottom: 2px solid var(--secondary-color);
    padding-bottom: 0.5rem;
}

.resource-item ul {
    list-style: none;
}

.resource-item li {
    margin-bottom: 0.8rem;
    padding-left: 1.5rem;
    position: relative;
}

.resource-item li:before {
    content: "→";
    position: absolute;
    left: 0;
    color: var(--secondary-color);
}

/* Footer */
footer {
    background-color: var(--dark-color);
    color: white;
    padding: 2rem 0;
    text-align: center;
}

footer p {
    color: rgba(255, 255, 255, 0.7);
    margin-bottom: 0.5rem;
}

.footer-links {
    margin-top: 1rem;
}

.footer-links a {
    color: white;
    margin: 0 10px;
}

.footer-links a:hover {
    color: var(--accent-color);
}

/* Responsive Design */
@media (max-width: 768px) {
    nav ul {
        flex-direction: column;
        align-items: center;
    }
    
    nav li {
        margin: 5px 0;
    }
    
    .recycling-info {
        grid-template-columns: 1fr;
    }
    
    .stats-grid {
        grid-template-columns: 1fr 1fr;
    }
}

@media (max-width: 480px) {
    header h1 {
        font-size: 2rem;
    }
    
    .stats-grid {
        grid-template-columns: 1fr;
    }
}
</style>
