<template>
  <div class="data-wipe-container">
    <h1 class="page-title">Data Wipe Instructions</h1>
    
    <div v-if="loading" class="loading-container">
      <p>Loading instructions...</p>
    </div>
    
    <div v-else>
      <!-- 设备选择区域 - 当没有查询参数时显示 -->
      <div v-if="!selectedDevice" class="device-selection">
        <h2>Select Your Device Type</h2>
        
        <div class="search-container">
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="Search for your device..." 
            class="search-input"
            @input="filterDevices" 
          />
        </div>
        
        <div class="device-dropdown">
          <select v-model="selectedDeviceType" @change="handleDeviceSelect" class="device-select">
            <option value="" disabled selected>Select device type</option>
            <option v-for="(devices, type) in deviceCategories" :key="type" :value="type">
              {{ type }}
            </option>
          </select>
        </div>
        
        <div v-if="selectedDeviceType" class="device-models">
          <ul class="device-list">
            <li 
              v-for="device in deviceCategories[selectedDeviceType]" 
              :key="device.id"
              @click="selectDevice(device)"
              class="device-item"
            >
              {{ device.name }}
            </li>
          </ul>
        </div>
        
        <div v-if="filteredDevices.length > 0 && searchQuery" class="search-results">
          <h3>Search Results</h3>
          <ul class="device-list">
            <li 
              v-for="device in filteredDevices" 
              :key="device.id"
              @click="selectDevice(device)"
              class="device-item"
            >
              {{ device.name }} ({{ device.category }})
            </li>
          </ul>
        </div>
      </div>
      
      <!-- 数据擦除指南 - 当用户已选择设备时显示 -->
      <div v-else class="wipe-instructions">
        <div class="device-header">
          <h2>{{ selectedDevice.name }} Data Wipe Instructions</h2>
          <button @click="resetSelection" class="back-button">Choose Different Device</button>
        </div>
        
        <div class="warning-box">
          <h3>⚠️ Important Warning</h3>
          <p>Following these instructions will permanently delete all data on your device. Make sure you have backed up any important information before proceeding.</p>
        </div>
        
        <div class="steps-container">
          <h3>Step-by-Step Guide</h3>
          <ol class="steps-list">
            <li v-for="(step, index) in selectedDevice.instructions" :key="index" class="step-item">
              <h4>Step {{ index + 1 }}</h4>
              <p>{{ step.text }}</p>
              <div v-if="step.note" class="step-note">
                <strong>Note:</strong> {{ step.note }}
              </div>
            </li>
          </ol>
        </div>
        
        <div class="verification-section">
          <h3>How to Verify Data Removal</h3>
          <p>{{ selectedDevice.verification || 'After following these steps, your data should be completely wiped from the device.' }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DataWipe',
  data() {
    return {
      loading: true,
      selectedDevice: null,
      selectedDeviceType: '',
      searchQuery: '',
      filteredDevices: [],
      // 设备数据库
      deviceCategories: {
        'Android Phone': [
          {
            id: 'android-phone-general',
            name: 'Android Phone (General)',
            category: 'Android Phone',
            instructions: [
              { 
                text: 'Back up any important data you want to keep.',
                note: 'Consider using Google Drive, Google Photos or similar services.'
              },
              { 
                text: 'Open your device Settings.'
              },
              { 
                text: 'Navigate to System > Reset options (or similar, may vary by device).'
              },
              { 
                text: 'Select "Erase all data (factory reset)".'
              },
              { 
                text: 'Confirm your selection and enter your PIN/pattern if required.'
              },
              { 
                text: 'Select "Erase Everything" to begin the reset process.'
              },
              { 
                text: 'Wait for the device to complete the reset process and reboot.',
                note: 'This may take several minutes.'
              }
            ],
            verification: 'After reset, your device should boot to the initial setup screen. If you had encryption enabled (on by default for newer Android versions), your data will be inaccessible.'
          },
          {
            id: 'samsung-galaxy',
            name: 'Samsung Galaxy',
            category: 'Android Phone',
            instructions: [
              { 
                text: 'Back up any important data you want to keep.',
                note: 'Consider using Samsung Cloud, Google Drive, or similar services.'
              },
              { 
                text: 'Open your device Settings.'
              },
              { 
                text: 'Scroll down and tap on "General management".'
              },
              { 
                text: 'Tap on "Reset".'
              },
              { 
                text: 'Select "Factory data reset".'
              },
              { 
                text: 'Scroll down and tap "Reset device".'
              },
              { 
                text: 'Enter your PIN/pattern if required.'
              },
              { 
                text: 'Tap "Delete all".'
              }
            ]
          }
        ],
        'iPhone': [
          {
            id: 'iphone-general',
            name: 'iPhone (iOS 15+)',
            category: 'iPhone',
            instructions: [
              { 
                text: 'Back up your iPhone using iCloud or your computer if you want to keep your data.',
                note: 'Go to Settings > [your name] > iCloud > iCloud Backup > Back Up Now.'
              },
              { 
                text: 'Make sure Find My iPhone is turned off. Go to Settings > [your name] > Find My > Find My iPhone and toggle it off.'
              },
              { 
                text: 'Go to Settings > General > Transfer or Reset iPhone.'
              },
              { 
                text: 'Tap "Erase All Content and Settings".'
              },
              { 
                text: 'Enter your passcode if prompted.'
              },
              { 
                text: 'Tap "Continue" and follow the on-screen instructions.'
              },
              { 
                text: 'Enter your Apple ID password to confirm and disable Activation Lock.'
              }
            ],
            verification: 'After completion, your iPhone will restart and display the initial setup screen, indicating all data has been successfully wiped.'
          }
        ],
        'Windows Laptop': [
          {
            id: 'windows-10-11',
            name: 'Windows 10/11 PC',
            category: 'Windows Laptop',
            instructions: [
              { 
                text: 'Back up any important data to an external drive or cloud storage.'
              },
              { 
                text: 'Sign out of all applications, especially those with saved credentials.'
              },
              { 
                text: 'Open Settings by pressing Windows key + I.'
              },
              { 
                text: 'Go to System > Recovery.'
              },
              { 
                text: 'Under "Reset this PC", click "Reset PC".'
              },
              { 
                text: 'Choose "Remove everything".'
              },
              { 
                text: 'Select "Cloud download" for a fresh Windows installation (recommended) or "Local reinstall".'
              },
              { 
                text: 'Click "Change settings" and ensure "Data erasure" is set to "Yes" for thorough data removal.'
              },
              { 
                text: 'Click "Confirm" and then "Next".'
              },
              { 
                text: 'Review your settings and click "Reset".'
              }
            ],
            verification: 'After reset, Windows will reinstall and boot to the initial setup screen. For more secure erasure, consider using dedicated disk wiping software like DBAN for HDDs or manufacturer secure erase commands for SSDs.'
          }
        ],
        'MacBook': [
          {
            id: 'macos-recent',
            name: 'MacBook (macOS 12+)',
            category: 'MacBook',
            instructions: [
              { 
                text: 'Back up your data using Time Machine or another backup solution.'
              },
              { 
                text: 'Sign out of iCloud. Go to System Preferences > Apple ID > Overview > Sign Out.'
              },
              { 
                text: 'Sign out of iMessage. Open Messages app > Preferences > iMessage > Sign Out.'
              },
              { 
                text: 'For Apple Silicon Macs: Shut down your Mac, then power it on and continue holding the power button until "Loading startup options" appears.'
              },
              { 
                text: 'For Intel Macs: Restart your Mac and hold Command (⌘) + R during startup to enter Recovery Mode.'
              },
              { 
                text: 'Select "Disk Utility" and click "Continue".'
              },
              { 
                text: 'Select your startup disk (usually labeled "Macintosh HD").'
              },
              { 
                text: 'Click "Erase" and provide the requested information (Name: Macintosh HD, Format: APFS).'
              },
              { 
                text: 'If you have a separate data volume, select it and erase it as well.'
              },
              { 
                text: 'Quit Disk Utility.'
              },
              { 
                text: 'Choose "Reinstall macOS" and follow the on-screen instructions.'
              }
            ]
          }
        ],
        'Tablet': [
          {
            id: 'ipad',
            name: 'iPad',
            category: 'Tablet',
            instructions: [
              { 
                text: 'Back up your iPad using iCloud or your computer if you want to keep your data.'
              },
              { 
                text: 'Make sure Find My iPad is turned off. Go to Settings > [your name] > Find My > Find My iPad and toggle it off.'
              },
              { 
                text: 'Go to Settings > General > Transfer or Reset iPad.'
              },
              { 
                text: 'Tap "Erase All Content and Settings".'
              },
              { 
                text: 'Enter your passcode if prompted.'
              },
              { 
                text: 'Tap "Continue" and follow the on-screen instructions.'
              },
              { 
                text: 'Enter your Apple ID password to confirm and disable Activation Lock.'
              }
            ]
          },
          {
            id: 'android-tablet',
            name: 'Android Tablet',
            category: 'Tablet',
            instructions: [
              { 
                text: 'Back up any important data you want to keep.'
              },
              { 
                text: 'Open your device Settings.'
              },
              { 
                text: 'Navigate to System > Reset options (or similar, may vary by device).'
              },
              { 
                text: 'Select "Erase all data (factory reset)".'
              },
              { 
                text: 'Confirm your selection and enter your PIN/pattern if required.'
              },
              { 
                text: 'Select "Erase Everything" to begin the reset process.'
              }
            ]
          }
        ],
        'Hard Drive': [
          {
            id: 'external-hdd',
            name: 'External Hard Drive',
            category: 'Hard Drive',
            instructions: [
              { 
                text: 'Back up any data you want to keep to another storage device.'
              },
              { 
                text: 'For basic erasure on Windows: Right-click the drive in File Explorer, select "Format", choose "Quick Format" (unchecked) and click "Start".',
                note: 'This method is not secure enough for sensitive data.'
              },
              { 
                text: 'For secure erasure, download a dedicated wiping tool like DBAN (Darik\'s Boot and Nuke) or Eraser.'
              },
              { 
                text: 'Follow the wiping tool\'s instructions to perform a secure erase with multiple passes.'
              },
              { 
                text: 'For Mac users: Open Disk Utility, select the drive, click "Erase", click "Security Options" and choose the desired wiping level.'
              }
            ],
            verification: 'True secure erasure of an HDD requires multiple-pass overwriting. For highly sensitive data, physical destruction of the drive may be necessary.'
          },
          {
            id: 'ssd-drive',
            name: 'SSD Drive',
            category: 'Hard Drive',
            instructions: [
              { 
                text: 'Back up any data you want to keep to another storage device.'
              },
              { 
                text: 'For most SSDs, use the manufacturer\'s secure erase tool (Samsung Magician, Intel SSD Toolbox, etc.).'
              },
              { 
                text: 'Alternatively, you can use the ATA Secure Erase command via tools like Parted Magic.'
              },
              { 
                text: 'For encrypted SSDs, simply changing the encryption key can make data inaccessible (crypto-erase).'
              },
              { 
                text: 'For Windows 10/11 BitLocker encrypted drives: Turn off BitLocker and perform a quick format.'
              }
            ],
            verification: 'Unlike HDDs, SSDs should not be wiped with multiple-pass overwrite tools as this can reduce drive lifespan without improving security. Manufacturer secure erase commands or encryption-based wiping are preferred.'
          }
        ]
      }
    };
  },
  mounted() {
    // 从 URL 查询参数获取设备类型
    const deviceParam = this.$route.query.device;
    if (deviceParam) {
      this.findDeviceByParam(deviceParam);
    }
    this.loading = false;
  },
  methods: {
    findDeviceByParam(param) {
      // 遍历所有设备类别寻找匹配的设备
      for (const [category, devices] of Object.entries(this.deviceCategories)) {
        const device = devices.find(d => d.id === param);
        if (device) {
          this.selectedDevice = device;
          return;
        }
      }
    },
    handleDeviceSelect() {
      // 用户从下拉列表选择了设备类别
      this.searchQuery = '';
      this.filteredDevices = [];
    },
    selectDevice(device) {
      // 用户选择了特定设备
      this.selectedDevice = device;
      
      // 更新 URL 参数（可选）
      this.$router.replace({ 
        query: { ...this.$route.query, device: device.id } 
      });
    },
    resetSelection() {
      // 返回到设备选择界面
      this.selectedDevice = null;
      this.selectedDeviceType = '';
      
      // 移除 URL 参数（可选）
      const query = { ...this.$route.query };
      delete query.device;
      this.$router.replace({ query });
    },
    filterDevices() {
      if (!this.searchQuery.trim()) {
        this.filteredDevices = [];
        return;
      }
      
      const query = this.searchQuery.toLowerCase();
      this.filteredDevices = [];
      
      // 在所有设备类别中搜索
      for (const [category, devices] of Object.entries(this.deviceCategories)) {
        const matches = devices.filter(device => 
          device.name.toLowerCase().includes(query) || 
          category.toLowerCase().includes(query)
        );
        
        this.filteredDevices.push(...matches);
      }
    }
  }
};
</script>

<style scoped>
.data-wipe-container {
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

.loading-container {
  text-align: center;
  padding: 40px;
}

.device-selection {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 30px;
}

.search-container {
  margin-bottom: 20px;
}

.search-input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

.device-dropdown {
  margin-bottom: 20px;
}

.device-select {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  background-color: white;
}

.device-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.device-item {
  padding: 12px 15px;
  border: 1px solid #ddd;
  margin-bottom: 8px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.device-item:hover {
  background-color: #e9ecef;
}

.search-results {
  margin-top: 20px;
}

.wipe-instructions {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
}

.device-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.back-button {
  padding: 8px 16px;
  background-color: #6c757d;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.warning-box {
  background-color: #fff3cd;
  border: 1px solid #ffeeba;
  border-radius: 4px;
  padding: 15px;
  margin-bottom: 20px;
}

.steps-container {
  margin-bottom: 30px;
}

.step-item {
  margin-bottom: 20px;
}

.step-note {
  background-color: #e2f0fd;
  padding: 10px;
  border-radius: 4px;
  margin-top: 10px;
  font-size: 14px;
}

.verification-section {
  background-color: #d4edda;
  border: 1px solid #c3e6cb;
  border-radius: 4px;
  padding: 15px;
  margin-top: 30px;
}

@media (max-width: 768px) {
  .data-wipe-container {
    padding: 15px;
  }
  
  .device-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .back-button {
    margin-top: 15px;
  }
}
</style> 