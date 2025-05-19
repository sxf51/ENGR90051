<template>
  <div class="evaluate-waste-container">
    <h1 class="page-title">E-Waste Evaluation Tool</h1>
    
    <!-- 评估表单 -->
    <div v-if="!showResult" class="evaluation-form">
      <h2>Enter Your Device Details</h2>
      <p>Fill in the information below to get a recommendation on what to do with your electronic device.</p>
      
      <div class="form-group">
        <label for="device-type">Device Type<span class="required">*</span></label>
        <select id="device-type" v-model="device.type" class="form-control" required @change="onTypeChange">
          <option value="" disabled>Select device type</option>
          <option v-for="type in deviceTypes" :key="type" :value="type">{{ type }}</option>
        </select>
        <div v-if="formErrors.type" class="error-message">{{ formErrors.type }}</div>
      </div>
      
      <div class="form-group">
        <label for="device-brand">Brand<span class="required">*</span></label>
        <select 
          id="device-brand" 
          v-model="device.brand" 
          class="form-control" 
          required
          @change="onBrandChange"
        >
          <option value="" disabled>Select brand</option>
          <option v-for="brand in availableBrands" :key="brand" :value="brand">{{ brand }}</option>
        </select>
        <div v-if="formErrors.brand" class="error-message">{{ formErrors.brand }}</div>
      </div>
      
      <div class="form-group">
        <label for="device-model">Model<span class="required">*</span></label>
        <select 
          id="device-model" 
          v-model="device.model" 
          class="form-control" 
          required 
        >
          <option value="" disabled>Select model</option>
          <option v-for="model in availableModels" :key="model" :value="model">{{ model }}</option>
        </select>
        <div v-if="formErrors.model" class="error-message">{{ formErrors.model }}</div>
      </div>
      
      <div class="form-group">
        <label for="device-condition">Condition<span class="required">*</span></label>
        <select id="device-condition" v-model="device.condition" class="form-control" required>
          <option value="" disabled>Select condition</option>
          <option value="Working">Working (Functions normally)</option>
          <option value="Minor issues">Minor issues (Works but has problems)</option>
          <option value="Not working">Not working (Doesn't turn on or major problems)</option>
        </select>
        <div v-if="formErrors.condition" class="error-message">{{ formErrors.condition }}</div>
      </div>
      
      <div class="form-group">
        <label for="device-age">Age<span class="required">*</span></label>
        <select id="device-age" v-model="device.age" class="form-control" required>
          <option value="" disabled>Select age</option>
          <option value="<1 year">Less than 1 year</option>
          <option value="1-3 years">1-3 years</option>
          <option value="3+ years">3+ years</option>
        </select>
        <div v-if="formErrors.age" class="error-message">{{ formErrors.age }}</div>
      </div>
      
      <div class="form-actions">
        <button @click="resetForm" class="reset-btn">Reset</button>
        <button @click="evaluateDevice" class="evaluate-btn">Evaluate</button>
      </div>
      
      <!-- 添加设备提交表单 -->
      <device-submission-form 
        page-type="evaluate"
        :device-types="deviceTypes"
        @device-submitted="handleDeviceSubmission"
      />
    </div>
    
    <!-- 评估结果 -->
    <div v-if="showResult" class="evaluation-result">
      <h2>Evaluation Result</h2>
      
      <div class="device-summary">
        <h3>Your Device:</h3>
        <ul class="device-details">
          <li><strong>Type:</strong> {{ device.type }}</li>
          <li><strong>Brand:</strong> {{ device.brand }}</li>
          <li><strong>Model:</strong> {{ device.model }}</li>
          <li><strong>Condition:</strong> {{ device.condition }}</li>
          <li><strong>Age:</strong> {{ device.age }}</li>
        </ul>
      </div>
      
      <div class="estimated-value">
        <h3>Estimated Value:</h3>
        <div class="value-amount">${{ deviceValue }}</div>
        <p class="value-note">This is an approximate value based on device type, age, and condition. Actual value may vary.</p>
      </div>
      
      <div :class="['recommendation-box', recommendationClass]">
        <h3>Our Recommendation:</h3>
        <p>{{ evaluationResult.recommendation }}</p>
        <div class="recommendation-details">
          <h4>Why?</h4>
          <p>{{ evaluationResult.reason }}</p>
        </div>
        <div class="next-steps">
          <h4>Next Steps:</h4>
          <p>{{ evaluationResult.nextSteps }}</p>
        </div>
      </div>
      
      <div class="form-actions">
        <button @click="resetForm" class="reset-btn">Evaluate Another Device</button>
      </div>
    </div>
  </div>
</template>

<script>
import DeviceSubmissionForm from '../components/DeviceSubmissionForm.vue';

export default {
  name: 'EvaluateWaste',
  components: {
    DeviceSubmissionForm
  },
  data() {
    return {
      showResult: false,
      deviceTypes: [
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
      ],
      brandsByType: {
        'Smartphone': ['Apple', 'Samsung', 'Google', 'Xiaomi', 'Huawei', 'OnePlus', 'Oppo', 'Vivo', 'Motorola', 'Nokia'],
        'Laptop': ['Apple', 'Dell', 'HP', 'Lenovo', 'Asus', 'Acer', 'Microsoft', 'MSI', 'Samsung', 'Toshiba'],
        'Desktop Computer': ['Dell', 'HP', 'Lenovo', 'Apple', 'Asus', 'Acer', 'MSI', 'Custom Built'],
        'Tablet': ['Apple', 'Samsung', 'Microsoft', 'Lenovo', 'Amazon', 'Huawei', 'Google'],
        'Monitor': ['Dell', 'Samsung', 'LG', 'Asus', 'Acer', 'HP', 'BenQ', 'ViewSonic', 'AOC', 'Philips'],
        'TV': ['Samsung', 'LG', 'Sony', 'TCL', 'Hisense', 'Panasonic', 'Vizio', 'Philips', 'Sharp'],
        'Printer': ['HP', 'Epson', 'Canon', 'Brother', 'Xerox', 'Lexmark', 'Samsung', 'Ricoh'],
        'Camera': ['Canon', 'Nikon', 'Sony', 'Fujifilm', 'Olympus', 'Panasonic', 'Leica', 'GoPro'],
        'Gaming Console': ['Sony PlayStation', 'Microsoft Xbox', 'Nintendo', 'Sega', 'Atari'],
        'Wearable Device': ['Apple', 'Samsung', 'Fitbit', 'Garmin', 'Xiaomi', 'Huawei', 'Fossil', 'Polar'],
        'Audio Equipment': ['Sony', 'Bose', 'JBL', 'Sennheiser', 'Audio-Technica', 'Beats', 'Sonos', 'Yamaha', 'Harman Kardon'],
        'External Hard Drive': ['Western Digital', 'Seagate', 'Samsung', 'Toshiba', 'SanDisk', 'LaCie', 'G-Technology'],
        'Router/Networking': ['TP-Link', 'Netgear', 'Asus', 'Linksys', 'D-Link', 'Cisco', 'Huawei', 'Ubiquiti'],
        'Other Electronic Device': ['Various']
      },
      modelsByBrand: {
        // Smartphones
        'Apple': ['iPhone 15 Pro', 'iPhone 15', 'iPhone 14 Pro', 'iPhone 14', 'iPhone 13', 'iPhone 12', 'iPhone 11', 'iPhone SE', 'iPhone X', 'iPhone 8'],
        'Samsung': ['Galaxy S23', 'Galaxy S22', 'Galaxy S21', 'Galaxy S20', 'Galaxy Note 20', 'Galaxy A53', 'Galaxy A33', 'Galaxy Z Fold', 'Galaxy Z Flip'],
        'Google': ['Pixel 7 Pro', 'Pixel 7', 'Pixel 6', 'Pixel 5', 'Pixel 4a'],
        'Xiaomi': ['Redmi Note 12', 'Redmi 10', 'Poco F5', 'Mi 13', 'Mi 12'],
        'Huawei': ['P40 Pro', 'P30', 'Mate 40', 'Mate 30', 'Nova 9'],
        
        // Laptops
        'Dell': ['XPS 13', 'XPS 15', 'XPS 17', 'Latitude', 'Inspiron', 'Alienware m15', 'Precision'],
        'HP': ['Spectre x360', 'Envy', 'Pavilion', 'EliteBook', 'ProBook', 'Omen'],
        'Lenovo': ['ThinkPad X1', 'ThinkPad T Series', 'Yoga', 'IdeaPad', 'Legion'],
        
        // Tablets
        'Microsoft': ['Surface Pro', 'Surface Go', 'Surface Book', 'Surface Laptop', 'Surface Studio'],
        
        // Default models for other brands
        'Other': ['Various Models']
      },
      device: {
        type: '',
        brand: '',
        model: '',
        condition: '',
        age: ''
      },
      formErrors: {
        type: '',
        brand: '',
        condition: '',
        age: '',
        model: ''
      },
      evaluationResult: {
        recommendation: '',
        reason: '',
        nextSteps: '',
        category: ''
      },
      deviceValue: 0,
      availableBrands: [],
      availableModels: []
    };
  },
  computed: {
    recommendationClass() {
      const category = this.evaluationResult.category;
      if (category === 'reuse') return 'recommendation-reuse';
      if (category === 'repair') return 'recommendation-repair';
      if (category === 'recycle') return 'recommendation-recycle';
      if (category === 'donate') return 'recommendation-donate';
      return '';
    }
  },
  mounted() {
    // 从 URL 获取设备参数
    this.loadDeviceFromUrl();
  },
  methods: {
    loadDeviceFromUrl() {
      const { type, brand, model } = this.$route.query;
      
      if (type && this.deviceTypes.includes(type)) {
        this.device.type = type;
        this.onTypeChange();
        
        if (brand && this.availableBrands.includes(brand)) {
          this.device.brand = brand;
          this.onBrandChange();
          
          if (model && this.availableModels.includes(model)) {
            this.device.model = model;
          }
        }
      }
    },
    onTypeChange() {
      // 重置品牌和型号
      this.device.brand = '';
      this.device.model = '';
      
      // 根据选择的设备类型更新可用品牌
      if (this.device.type && this.brandsByType[this.device.type]) {
        this.availableBrands = this.brandsByType[this.device.type];
      } else {
        this.availableBrands = [];
      }
      
      this.availableModels = [];
    },
    onBrandChange() {
      // 重置型号
      this.device.model = '';
      
      // 根据选择的品牌更新可用型号
      if (this.device.brand && this.modelsByBrand[this.device.brand]) {
        this.availableModels = this.modelsByBrand[this.device.brand];
      } else if (this.device.brand) {
        // 如果没有为此品牌定义特定型号，使用"其他"通用型号
        this.availableModels = this.modelsByBrand['Other'] || ['Various Models'];
      } else {
        this.availableModels = [];
      }
    },
    validateForm() {
      // 重置错误信息
      this.formErrors = {
        type: '',
        brand: '',
        condition: '',
        age: '',
        model: ''
      };
      
      let isValid = true;
      
      // 检查必填字段
      if (!this.device.type) {
        this.formErrors.type = 'Please select a device type';
        isValid = false;
      }
      
      if (!this.device.brand) {
        this.formErrors.brand = 'Please select the device brand';
        isValid = false;
      }
      
      if (!this.device.model) {
        this.formErrors.model = 'Please select the device model';
        isValid = false;
      }
      
      if (!this.device.condition) {
        this.formErrors.condition = 'Please select the device condition';
        isValid = false;
      }
      
      if (!this.device.age) {
        this.formErrors.age = 'Please select the device age';
        isValid = false;
      }
      
      return isValid;
    },
    evaluateDevice() {
      if (!this.validateForm()) {
        return;
      }
      
      // 基于设备信息生成评估
      this.generateEvaluation();
      this.showResult = true;
    },
    generateEvaluation() {
      const { condition, age } = this.device;
      
      // 计算估计价值
      this.calculateDeviceValue();
      
      // 基础逻辑：根据设备状况和年龄确定建议
      if (condition === 'Working') {
        if (age === '<1 year' || age === '1-3 years') {
          this.evaluationResult = {
            recommendation: 'This device is suitable for reuse, trade-in or resale.',
            reason: 'Your device is in good working condition and relatively new, making it valuable for continued use.',
            nextSteps: 'Consider selling it on a second-hand marketplace, trading it in for an upgrade, or donating it to someone who needs it.',
            category: 'reuse'
          };
        } else { // 3+ years
          this.evaluationResult = {
            recommendation: 'This device could be donated or repurposed.',
            reason: 'While your device is working, its age may reduce its resale value, but it still has utility.',
            nextSteps: 'Consider donating to schools, charities, or community programs that accept used electronics. Alternatively, it could be repurposed for basic tasks.',
            category: 'donate'
          };
        }
      } else if (condition === 'Minor issues') {
        if (age === '<1 year') {
          this.evaluationResult = {
            recommendation: 'Consider repairing this device.',
            reason: 'Your device is quite new and likely worth repairing given its potential remaining lifespan.',
            nextSteps: 'Contact the manufacturer or a reputable repair service to get an estimate for repairs. It might still be under warranty.',
            category: 'repair'
          };
        } else if (age === '1-3 years') {
          this.evaluationResult = {
            recommendation: 'Repair may be worthwhile, but evaluate repair costs.',
            reason: 'The device has moderate age but may still have value after repairs, depending on the cost.',
            nextSteps: 'Get a repair quote and compare it with the current market value of your device to determine if repair is economical.',
            category: 'repair'
          };
        } else { // 3+ years
          this.evaluationResult = {
            recommendation: 'Consider recycling this device.',
            reason: 'Given the age and condition, repair costs may exceed the device\'s value.',
            nextSteps: 'Take your device to an authorized e-waste recycling center where it can be properly disassembled and its materials recovered.',
            category: 'recycle'
          };
        }
      } else { // Not working
        if (age === '<1 year') {
          this.evaluationResult = {
            recommendation: 'Check warranty status and manufacturer support.',
            reason: 'A non-working device this new may still be covered under warranty or eligible for manufacturer service programs.',
            nextSteps: 'Contact the manufacturer about warranty service or replacement options before considering recycling.',
            category: 'repair'
          };
        } else {
          this.evaluationResult = {
            recommendation: 'This device should be recycled.',
            reason: 'Given its non-functional status and age, recycling is the most environmentally responsible option.',
            nextSteps: 'Take your device to a certified e-waste recycling center. Be sure to remove any personal data first if possible.',
            category: 'recycle'
          };
        }
      }
    },
    calculateDeviceValue() {
      const { condition, age, type, brand, model } = this.device;
      
      // 基础价值 - 根据设备类型设置基础价值
      let baseValue = 0;
      
      switch(type) {
        case 'Smartphone':
          baseValue = 300;
          break;
        case 'Laptop':
          baseValue = 500;
          break;
        case 'Desktop Computer':
          baseValue = 400;
          break;
        case 'Tablet':
          baseValue = 200;
          break;
        case 'Monitor':
          baseValue = 150;
          break;
        case 'TV':
          baseValue = 250;
          break;
        case 'Gaming Console':
          baseValue = 200;
          break;
        default:
          baseValue = 100;
      }
      
      // 品牌调整 - 为高端品牌增加价值
      const premiumBrands = ['Apple', 'Samsung', 'Sony', 'Dell', 'HP', 'Microsoft', 'Google'];
      if (premiumBrands.includes(brand)) {
        baseValue *= 1.2; // 高端品牌价值提升20%
      }
      
      // 年龄调整
      let ageMultiplier = 1.0;
      if (age === '<1 year') {
        ageMultiplier = 0.9; // 不到1年 - 保留90%价值
      } else if (age === '1-3 years') {
        ageMultiplier = 0.6; // 1-3年 - 保留60%价值
      } else {
        ageMultiplier = 0.3; // 3+年 - 保留30%价值
      }
      
      // 条件调整
      let conditionMultiplier = 1.0;
      if (condition === 'Working') {
        conditionMultiplier = 1.0; // 正常工作 - 100%价值
      } else if (condition === 'Minor issues') {
        conditionMultiplier = 0.5; // 小问题 - 50%价值
      } else {
        conditionMultiplier = 0.1; // 不工作 - 保留10%价值(材料回收价值)
      }
      
      // 根据特定型号进行调整（例如，高端型号可能有更高的价值）
      // 这里只是一个简化的示例，实际上可能需要更复杂的逻辑
      let modelMultiplier = 1.0;
      if (model.toLowerCase().includes('pro') || 
          model.toLowerCase().includes('max') || 
          model.toLowerCase().includes('ultra')) {
        modelMultiplier = 1.3; // 高端型号价值提升30%
      }
      
      // 计算最终价值并四舍五入到整数
      let finalValue = baseValue * ageMultiplier * conditionMultiplier * modelMultiplier;
      this.deviceValue = Math.round(finalValue);
    },
    resetForm() {
      this.device = {
        type: '',
        brand: '',
        model: '',
        condition: '',
        age: ''
      };
      this.formErrors = {
        type: '',
        brand: '',
        model: '',
        condition: '',
        age: ''
      };
      this.availableBrands = [];
      this.availableModels = [];
      this.deviceValue = 0;
      this.showResult = false;
    },
    handleDeviceSubmission(device) {
      // 处理设备提交后的逻辑
      console.log('Device submitted:', device);
    }
  }
};
</script>

<style scoped>
.evaluate-waste-container {
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

.evaluation-form, .evaluation-result {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 25px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  margin-bottom: 30px;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
  color: #2c3e50;
}

.required {
  color: #dc3545;
  margin-left: 4px;
}

.form-control {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  transition: border-color 0.3s;
}

.form-control:focus {
  border-color: #4caf50;
  outline: none;
}

.error-message {
  color: #dc3545;
  font-size: 14px;
  margin-top: 5px;
}

.form-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
}

button {
  padding: 12px 25px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
  opacity: 0.6;
}

.reset-btn {
  background-color: #6c757d;
  color: white;
}

.reset-btn:hover {
  background-color: #5a6268;
}

.evaluate-btn {
  background-color: #4caf50;
  color: white;
}

.evaluate-btn:hover {
  background-color: #3d8b40;
}

/* 评估结果样式 */
.device-summary {
  background-color: #e9ecef;
  padding: 20px;
  border-radius: 6px;
  margin-bottom: 25px;
}

.device-details {
  list-style: none;
  padding: 0;
}

.device-details li {
  margin-bottom: 10px;
}

.estimated-value {
  background-color: #e9ecef;
  padding: 20px;
  border-radius: 6px;
  margin-bottom: 25px;
}

.value-amount {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
}

.value-note {
  font-size: 14px;
  color: #6c757d;
}

.recommendation-box {
  padding: 20px;
  border-radius: 6px;
  margin-bottom: 25px;
  border-left: 5px solid #4caf50;
}

.recommendation-reuse {
  background-color: #e8f5e9;
  border-color: #4caf50;
}

.recommendation-repair {
  background-color: #fff8e1;
  border-color: #ffc107;
}

.recommendation-recycle {
  background-color: #e3f2fd;
  border-color: #2196f3;
}

.recommendation-donate {
  background-color: #f3e5f5;
  border-color: #9c27b0;
}

.recommendation-details, .next-steps {
  margin-top: 15px;
}

.recommendation-details h4, .next-steps h4 {
  margin-bottom: 8px;
  color: #2c3e50;
}

@media (max-width: 768px) {
  .evaluate-waste-container {
    padding: 15px;
  }
  
  .form-actions {
    flex-direction: column;
    gap: 10px;
  }
  
  button {
    width: 100%;
  }
}
</style> 