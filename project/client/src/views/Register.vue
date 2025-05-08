<template>
    <div class="register">
      <h2>Log in</h2>
      <form @submit.prevent="handleSubmit" class="register-form">
        <div class="form-group">
          <label for="username">username:</label>
          <input 
            type="text" 
            id="username" 
            v-model="form.username" 
            required
          >
        </div>
        
        <div class="form-group">
          <label for="email">e-mail:</label>
          <input 
            type="email" 
            id="email" 
            v-model="form.email" 
            required
          >
        </div>
        
        <div class="form-group">
          <label for="password">password:</label>
          <input 
            type="password" 
            id="password" 
            v-model="form.password" 
            required
            minlength="6"
          >
        </div>
        
        <button type="submit" class="submit-btn">submit</button>
      </form>
      
      <div v-if="message" class="message" :class="{ success: isSuccess, error: !isSuccess }">
        {{ message }}
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';

  import { HOST_URL, SERVER_PORT } from '../../config';
  
  export default {
    name: 'UserRegister',
    data() {
      return {
        form: {
          username: '',
          email: '',
          password: ''
        },
        message: '',
        isSuccess: false
      };
    },
    methods: {
      async handleSubmit() {
        try {
          // const response = await axios.post(HOST_URL + `:${SERVER_PORT}/api/register`, this.form);
          
          this.message = 'Registration Successful! ';
          this.isSuccess = true;
          
          // 触发登录状态更新
          this.$emit('login', this.form.email);
          
          // 添加欢迎奖章
          await axios.post(HOST_URL + `:${SERVER_PORT}/api/user/${this.form.email}/badges`, {
            badge: 'welcome'
          });
          
          // 清空表单
          this.form = {
            username: '',
            email: '',
            password: ''
          };
          
          // 3秒后跳转到个人资料页
          setTimeout(() => {
            this.$router.push('/profile');
          }, SERVER_PORT);
        } catch (error) {
          this.message = error.response?.data?.error || 'Failed. Please try again';
          this.isSuccess = false;
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .register {
    max-width: 500px;
    margin: 0 auto;
    padding: 1rem;
  }
  
  .register-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-top: 1.5rem;
  }
  
  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    text-align: left;
  }
  
  input {
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
  }
  
  .submit-btn {
    background-color: #42b983;
    color: white;
    padding: 0.75rem;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    cursor: pointer;
    margin-top: 1rem;
  }
  
  .submit-btn:hover {
    background-color: #3aa876;
  }
  
  .message {
    margin-top: 1.5rem;
    padding: 1rem;
    border-radius: 4px;
  }
  
  .success {
    background-color: #d4edda;
    color: #155724;
  }
  
  .error {
    background-color: #f8d7da;
    color: #721c24;
  }
  </style>
  