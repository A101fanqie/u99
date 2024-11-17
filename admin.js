// 修改基础URL
const BASE_URL = '/-/'; // 使用相对于根目录的路径

// 检查登录状态
function checkLogin() {
    const token = localStorage.getItem('adminToken');
    const currentPath = window.location.pathname;
    
    if (!token && !currentPath.includes('login.html')) {
        window.location.href = '../admin/login.html';
    }
}

// 登录处理
if (document.getElementById('loginForm')) {
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault(); // 阻止表单默认提交
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        console.log('Login attempt:', username, password); // 调试日志
        
        // 验证特定账号密码
        if (username === '1320845373' && password === '1314521cs') {
            localStorage.setItem('adminToken', 'admin-token-' + Date.now());
            
            // 使用相对路径
            window.location.href = '../admin/index.html';
            
            console.log('Login successful, redirecting to:', '../admin/index.html'); // 调试日志
        } else {
            alert('用户名或密码错误！');
        }
    });
}

// 退出登录
if (document.getElementById('logoutBtn')) {
    document.getElementById('logoutBtn').addEventListener('click', () => {
        localStorage.removeItem('adminToken');
        window.location.href = '../admin/login.html';
    });
}

// 搜索功能
if (document.getElementById('searchBtn')) {
    document.getElementById('searchBtn').addEventListener('click', () => {
        const phone = document.getElementById('searchPhone').value;
        searchProgress(phone);
    });
}

// 搜索进度
async function searchProgress(phone) {
    // 模拟数据
    const mockData = [{
        phone: phone || '1320845373',
        registerTime: '2024-03-20',
        progress: '75%',
        lastUpdate: '2024-03-21 14:30'
    }];
    
    updateTable(mockData);
}

// 更新表格
function updateTable(data) {
    const tableBody = document.getElementById('tableBody');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    data.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.phone}</td>
            <td><i class="far fa-calendar-alt"></i> ${item.registerTime}</td>
            <td>
                <div class="progress-bar">
                    <div class="progress" style="width: ${item.progress}"></div>
                    <span>${item.progress}</span>
                </div>
            </td>
            <td><i class="far fa-clock"></i> ${item.lastUpdate}</td>
            <td>
                <button class="action-btn edit-btn" onclick="editProgress('${item.phone}')">
                    <i class="fas fa-edit"></i> 编辑
                </button>
                <button class="action-btn delete-btn" onclick="deleteProgress('${item.phone}')">
                    <i class="fas fa-trash"></i> 删除
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// 编辑进度
function editProgress(phone) {
    const newProgress = prompt('请输入新的进度值（0-100）：');
    if (newProgress !== null) {
        alert(`已更新 ${phone} 的进度为 ${newProgress}%`);
        searchProgress(phone);
    }
}

// 删除进度记录
function deleteProgress(phone) {
    if (confirm(`确定要删除 ${phone} 的进度记录吗？`)) {
        alert(`已删除 ${phone} 的进度记录`);
        searchProgress('');
    }
}

// 添加导出功能
if (document.getElementById('exportBtn')) {
    document.getElementById('exportBtn').addEventListener('click', async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch('/api/admin/export', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `progress_export_${new Date().toISOString().split('T')[0]}.csv`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            alert('导出失败，请检查网络连接！');
            console.error('Export error:', error);
        }
    });
}

// 添加自动加载所有数据的功能
async function loadAllData() {
    try {
        const token = localStorage.getItem('adminToken');
        const response = await fetch('/api/admin/progress/all', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        const data = await response.json();
        if (data.success) {
            updateTable(data.records);
        }
    } catch (error) {
        console.error('Load data error:', error);
    }
}

// 页面加载时自动加载数据
if (document.getElementById('progressTable')) {
    loadAllData();
}

// 页面加载时检查登录状态
document.addEventListener('DOMContentLoaded', () => {
    checkLogin();
    // 如果在管理页面，加载数据
    if (document.getElementById('progressTable')) {
        searchProgress('');
    }
});

// 添加密码显示切换功能
document.addEventListener('DOMContentLoaded', function() {
    const togglePassword = document.querySelector('.toggle-password');
    if (togglePassword) {
        togglePassword.addEventListener('click', function() {
            const passwordInput = document.querySelector('#password');
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            this.classList.toggle('fa-eye');
            this.classList.toggle('fa-eye-slash');
        });
    }

    // 添加输入框焦点效果
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.style.boxShadow = '0 0 0 2px var(--primary-color)';
        });
        input.addEventListener('blur', function() {
            this.parentElement.style.boxShadow = 'none';
        });
    });
});

// 添加移动端菜单切换
const menuToggle = document.querySelector('.menu-toggle');
const sidebar = document.querySelector('.sidebar');
if (menuToggle && sidebar) {
    menuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('active');
    });
}

// 添加全局错误处理
window.addEventListener('error', function(e) {
    console.error('Global error:', e.error);
});

// 添加网络错误处理
window.addEventListener('offline', function() {
    alert('网络连接已断开，请检查网络设置！');
}); 