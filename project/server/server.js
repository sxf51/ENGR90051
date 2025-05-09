const express = require('express');
const redis = require('redis');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const fs = require('fs');
const https = require('https');
const http = require('http');

const SERVER_PORT = 3000;

// 创建Express应用
const app = express();
const port = process.env.PORT || SERVER_PORT;

// 中间件
app.use(cors());
app.use(bodyParser.json());
app.use(morgan('dev'));

// 读取证书文件
const options = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
};

// 创建Redis客户端
const redisClient = redis.createClient({
  host: '127.0.0.1',
  port: 6379
});

redisClient.on('error', (err) => {
  console.error('Redis error:', err);
});

// 初始化点击量
redisClient.set('pageViews', 0);

// 路由
app.get('/api/views', (req, res) => {
  redisClient.get('pageViews', (err, views) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to get page views' });
    }
    res.json({ views: parseInt(views) || 0 });
  });
});

app.post('/api/views/increment', (req, res) => {
  redisClient.incr('pageViews', (err, newViews) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to increment views' });
    }
    res.json({ views: newViews });
  });
});

// 用户注册
app.post('/api/register', (req, res) => {
  const { username, email, password } = req.body;
  
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  // 检查用户是否已存在
  redisClient.hget('users', email, (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    
    if (user) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    // 创建新用户
    const newUser = {
      username,
      email,
      password, // 注意: 实际应用中应该加密密码
      joinedAt: new Date().toISOString(),
      points: 0,
      badges: []
    };
    
    redisClient.hset('users', email, JSON.stringify(newUser), (err) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to create user' });
      }
      res.status(201).json({ message: 'User created successfully' });
    });
  });
});

// 获取用户信息
app.get('/api/user/:email', (req, res) => {
  const { email } = req.params;
  
  redisClient.hget('users', email, (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(JSON.parse(user));
  });
});

// 添加奖章
app.post('/api/user/:email/badges', (req, res) => {
  const { email } = req.params;
  const { badge } = req.body;
  
  if (!badge) {
    return res.status(400).json({ error: 'Badge is required' });
  }
  
  redisClient.hget('users', email, (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const userData = JSON.parse(user);
    
    if (!userData.badges.includes(badge)) {
      userData.badges.push(badge);
      redisClient.hset('users', email, JSON.stringify(userData), (err) => {
        if (err) {
          return res.status(500).json({ error: 'Failed to update user' });
        }
        res.json({ message: 'Badge added successfully' });
      });
    } else {
      res.json({ message: 'User already has this badge' });
    }
  });
});


// 启动服务器
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// 创建 HTTPS 服务器
//https.createServer(options, app).listen(port, () => {
//  console.log(`HTTPS server running on port ${port}`);
//});
