<template>
  <div class="device-submission-form">
    <div v-if="!showForm" class="submission-trigger">
      <button @click="showForm = true" class="trigger-btn">
        Can't find your device?
      </button>
    </div>
    
    <div v-if="showForm" class="submission-modal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Submit Missing Device</h3>
          <button @click="closeModal" class="close-btn">&times;</button>
        </div>
        
        <div class="modal-body">
          <p>Help us improve by submitting device details we're missing in our database.</p>
          
          <div class="form-group">
            <label for="device-type">Device Type<span class="required">*</span></label>
            <select id="device-type" v-model="deviceInfo.type" class="form-control" required>
              <option value="" disabled>Select device type</option>
              <option v-for="type in deviceTypes" :key="type" :value="type">{{ type }}</option>
            </select>
            <div v-if="errors.type" class="error-message">{{ errors.type }}</div>
          </div>
          
          <div class="form-group">
            <label for="device-brand">Brand<span class="required">*</span></label>
            <input 
              type="text" 
              id="device-brand" 
              v-model="deviceInfo.brand" 
              class="form-control" 
              placeholder="e.g. Samsung, Apple, etc."
              required
            />
            <div v-if="errors.brand" class="error-message">{{ errors.brand }}</div>
          </div>
          
          <div class="form-group">
            <label for="device-model">Model<span class="required">*</span></label>
            <input 
              type="text" 
              id="device-model" 
              v-model="deviceInfo.model" 
              class="form-control" 
              placeholder="e.g. iPhone 15, Galaxy S23, etc."
              required
            />
            <div v-if="errors.model" class="error-message">{{ errors.model }}</div>
          </div>
          
          <div class="form-group">
            <label for="device-year">Release Year (if known)</label>
            <input 
              type="number" 
              id="device-year" 
              v-model="deviceInfo.year" 
              class="form-control" 
              placeholder="e.g. 2022"
              min="1990"
              max="2100"
            />
          </div>
          
          <div class="form-group">
            <label for="additional-info">Additional Information</label>
            <textarea 
              id="additional-info" 
              v-model="deviceInfo.additionalInfo" 
              class="form-control" 
              placeholder="Any other details that might help us add this device (optional)"
              rows="3"
            ></textarea>
          </div>
          
          <div class="form-group">
            <label for="user-email">Your Email (optional)</label>
            <input 
              type="email" 
              id="user-email" 
              v-model="deviceInfo.email" 
              class="form-control" 
              placeholder="To notify you when the device is added"
            />
            <div v-if="errors.email" class="error-message">{{ errors.email }}</div>
          </div>
        </div>
        
        <div class="modal-footer">
          <button @click="closeModal" class="cancel-btn">Cancel</button>
          <button @click="submitForm" class="submit-btn" :disabled="isSubmitting">
            {{ isSubmitting ? 'Submitting...' : 'Submit' }}
          </button>
        </div>
        
        <div v-if="submitSuccess" class="success-message">
          <p>Thank you for your submission! We'll review it and update our database.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DeviceSubmissionForm',
  props: {
    // 页面类型，用于区分是在哪个页面使用此组件
    pageType: {
      type: String,
      required: true,
      validator: value => ['datawipe', 'evaluate'].includes(value)
    },
    // 可用的设备类型列表
    deviceTypes: {
      type: Array,
      default: () => [
        'Smartphone',
        'Laptop',
        'Desktop Computer',
        'Tablet',
        'Monitor',
        'TV',
        'Printer',
        'Camera',
        'Gaming Console',
        'Wearable Device',
        'Audio Equipment',
        'External Hard Drive',
        'Router/Networking',
        'Other Electronic Device'
      ]
    }
  },
  data() {
    return {
      showForm: false,
      isSubmitting: false,
      submitSuccess: false,
      deviceInfo: {
        type: '',
        brand: '',
        model: '',
        year: null,
        additionalInfo: '',
        email: '',
        source: this.pageType // 记录来源页面
      },
      errors: {
        type: '',
        brand: '',
        model: '',
        email: ''
      }
    };
  },
  methods: {
    closeModal() {
      if (this.isSubmitting) return;
      
      this.showForm = false;
      this.resetForm();
    },
    resetForm() {
      this.deviceInfo = {
        type: '',
        brand: '',
        model: '',
        year: null,
        additionalInfo: '',
        email: '',
        source: this.pageType
      };
      this.errors = {
        type: '',
        brand: '',
        model: '',
        email: ''
      };
      this.submitSuccess = false;
    },
    validateForm() {
      let isValid = true;
      this.errors = {
        type: '',
        brand: '',
        model: '',
        email: ''
      };
      
      if (!this.deviceInfo.type) {
        this.errors.type = 'Please select a device type';
        isValid = false;
      }
      
      if (!this.deviceInfo.brand) {
        this.errors.brand = 'Please enter the device brand';
        isValid = false;
      }
      
      if (!this.deviceInfo.model) {
        this.errors.model = 'Please enter the device model';
        isValid = false;
      }
      
      if (this.deviceInfo.email && !this.validateEmail(this.deviceInfo.email)) {
        this.errors.email = 'Please enter a valid email address';
        isValid = false;
      }
      
      return isValid;
    },
    validateEmail(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    },
    submitForm() {
      if (!this.validateForm()) return;
      
      this.isSubmitting = true;
      
      // 由于是原型，我们只需要模拟提交过程
      setTimeout(() => {
        this.isSubmitting = false;
        this.submitSuccess = true;
        
        // 延迟关闭弹窗
        setTimeout(() => {
          this.showForm = false;
          this.resetForm();
        }, 3000);
        
        // 触发事件，通知父组件提交成功
        this.$emit('device-submitted', {...this.deviceInfo});
      }, 1500);
      
      // 在实际项目中，这里会发送 API 请求：
      /*
      axios.post('/api/submit-device', this.deviceInfo)
        .then(response => {
          this.isSubmitting = false;
          this.submitSuccess = true;
          
          setTimeout(() => {
            this.showForm = false;
            this.resetForm();
          }, 3000);
          
          this.$emit('device-submitted', {...this.deviceInfo});
        })
        .catch(error => {
          this.isSubmitting = false;
          console.error('Error submitting device:', error);
          alert('Failed to submit device. Please try again.');
        });
      */
    }
  }
};
</script>

<style scoped>
.device-submission-form {
  margin: 20px 0;
}

.submission-trigger {
  text-align: center;
  margin-bottom: 10px;
}

.trigger-btn {
  background: none;
  border: none;
  color: #4caf50;
  font-weight: bold;
  text-decoration: underline;
  cursor: pointer;
  padding: 8px 16px;
  font-size: 14px;
}

.trigger-btn:hover {
  color: #3d8b40;
}

.submission-modal {
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
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  position: relative;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #eee;
}

.modal-header h3 {
  margin: 0;
  color: #2c3e50;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  line-height: 24px;
  color: #888;
  cursor: pointer;
}

.close-btn:hover {
  color: #333;
}

.modal-body {
  padding: 20px;
}

.modal-footer {
  padding: 15px 20px;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.form-group {
  margin-bottom: 15px;
}

.form-control {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.form-control:focus {
  border-color: #4caf50;
  outline: none;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #333;
}

.required {
  color: #e91e63;
  margin-left: 3px;
}

.cancel-btn, .submit-btn {
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
}

.cancel-btn {
  background-color: #f5f5f5;
  color: #333;
}

.submit-btn {
  background-color: #4caf50;
  color: white;
}

.cancel-btn:hover {
  background-color: #e0e0e0;
}

.submit-btn:hover {
  background-color: #3d8b40;
}

.submit-btn:disabled {
  background-color: #a5d6a7;
  cursor: not-allowed;
}

.error-message {
  color: #e91e63;
  font-size: 12px;
  margin-top: 5px;
}

.success-message {
  padding: 15px 20px;
  background-color: #e8f5e9;
  color: #2e7d32;
  text-align: center;
  border-top: 1px solid #c8e6c9;
}
</style> 