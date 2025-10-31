class AttendanceSystem {
    constructor() {
        this.currentUser = null;
        this.currentRole = null;
        this.currentClassId = null;
        this.init();
    }

    init() {
        this.initializeStorage();
        this.setupEventListeners();
        this.checkExistingSession();
        this.updateCurrentTime();
    }

    initializeStorage() {
        if (!localStorage.getItem('students')) {
            localStorage.setItem('students', JSON.stringify([]));
        }
        if (!localStorage.getItem('teachers')) {
            localStorage.setItem('teachers', JSON.stringify([]));
        }
        if (!localStorage.getItem('classes')) {
            localStorage.setItem('classes', JSON.stringify([]));
        }
        if (!localStorage.getItem('attendance')) {
            localStorage.setItem('attendance', JSON.stringify([]));
        }
    }

    setupEventListeners() {
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchRole(e.target.dataset.role));
        });

        document.querySelectorAll('.toggle-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.toggleAuthForm(e.target));
        });

        document.getElementById('student-login-form').addEventListener('submit', (e) => this.handleStudentLogin(e));
        document.getElementById('student-signup-form').addEventListener('submit', (e) => this.handleStudentSignup(e));
        document.getElementById('teacher-login-form').addEventListener('submit', (e) => this.handleTeacherLogin(e));
        document.getElementById('teacher-signup-form').addEventListener('submit', (e) => this.handleTeacherSignup(e));

        document.getElementById('student-logout').addEventListener('click', () => this.logout());
        document.getElementById('teacher-logout').addEventListener('click', () => this.logout());

        document.getElementById('join-class-form').addEventListener('submit', (e) => this.handleJoinClass(e));
        document.getElementById('create-class-form').addEventListener('submit', (e) => this.handleCreateClass(e));

        document.querySelectorAll('.dash-tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchDashboardTab(e.target.dataset.tab));
        });

        document.querySelectorAll('.modal-tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchModalTab(e.target.dataset.tab));
        });

        document.querySelector('.close-modal').addEventListener('click', () => this.closeModal());

        document.getElementById('create-session-form').addEventListener('submit', (e) => this.handleCreateSession(e));

        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeModal();
            }
        });
    }

    switchRole(role) {
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-role="${role}"]`).classList.add('active');

        document.querySelectorAll('.auth-form').forEach(form => form.classList.remove('active'));
        document.getElementById(`${role}-auth`).classList.add('active');
    }

    toggleAuthForm(btn) {
        const parent = btn.closest('.auth-form');
        const formType = btn.dataset.form;

        parent.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        parent.querySelectorAll('.form').forEach(form => form.classList.remove('active'));
        parent.querySelector(`#${parent.id.replace('-auth', '')}-${formType}-form`).classList.add('active');
    }

    handleStudentSignup(e) {
        e.preventDefault();
        const name = document.getElementById('student-signup-name').value;
        const email = document.getElementById('student-signup-email').value;
        const rollNumber = document.getElementById('student-signup-roll').value;
        const password = document.getElementById('student-signup-password').value;

        const students = JSON.parse(localStorage.getItem('students'));

        if (students.some(s => s.email === email)) {
            this.showMessage(e.target, 'Email already registered', 'error');
            return;
        }

        const student = {
            id: Date.now().toString(),
            name,
            email,
            rollNumber,
            password,
            classes: []
        };

        students.push(student);
        localStorage.setItem('students', JSON.stringify(students));

        this.showMessage(e.target, 'Registration successful! Please login.', 'success');
        e.target.reset();

        setTimeout(() => {
            const parent = e.target.closest('.auth-form');
            parent.querySelector('[data-form="login"]').click();
        }, 1500);
    }

    handleStudentLogin(e) {
        e.preventDefault();
        const email = document.getElementById('student-login-email').value;
        const password = document.getElementById('student-login-password').value;

        const students = JSON.parse(localStorage.getItem('students'));
        const student = students.find(s => s.email === email && s.password === password);

        if (student) {
            this.currentUser = student;
            this.currentRole = 'student';
            sessionStorage.setItem('currentUser', JSON.stringify(student));
            sessionStorage.setItem('currentRole', 'student');
            this.showDashboard('student');
        } else {
            this.showMessage(e.target, 'Invalid email or password', 'error');
        }
    }

    handleTeacherSignup(e) {
        e.preventDefault();
        const name = document.getElementById('teacher-signup-name').value;
        const email = document.getElementById('teacher-signup-email').value;
        const department = document.getElementById('teacher-signup-dept').value;
        const password = document.getElementById('teacher-signup-password').value;

        const teachers = JSON.parse(localStorage.getItem('teachers'));

        if (teachers.some(t => t.email === email)) {
            this.showMessage(e.target, 'Email already registered', 'error');
            return;
        }

        const teacher = {
            id: Date.now().toString(),
            name,
            email,
            department,
            password,
            classes: []
        };

        teachers.push(teacher);
        localStorage.setItem('teachers', JSON.stringify(teachers));

        this.showMessage(e.target, 'Registration successful! Please login.', 'success');
        e.target.reset();

        setTimeout(() => {
            const parent = e.target.closest('.auth-form');
            parent.querySelector('[data-form="login"]').click();
        }, 1500);
    }

    handleTeacherLogin(e) {
        e.preventDefault();
        const email = document.getElementById('teacher-login-email').value;
        const password = document.getElementById('teacher-login-password').value;

        const teachers = JSON.parse(localStorage.getItem('teachers'));
        const teacher = teachers.find(t => t.email === email && t.password === password);

        if (teacher) {
            this.currentUser = teacher;
            this.currentRole = 'teacher';
            sessionStorage.setItem('currentUser', JSON.stringify(teacher));
            sessionStorage.setItem('currentRole', 'teacher');
            this.showDashboard('teacher');
        } else {
            this.showMessage(e.target, 'Invalid email or password', 'error');
        }
    }

    checkExistingSession() {
        const user = sessionStorage.getItem('currentUser');
        const role = sessionStorage.getItem('currentRole');

        if (user && role) {
            this.currentUser = JSON.parse(user);
            this.currentRole = role;
            this.showDashboard(role);
        }
    }

    showDashboard(role) {
        document.getElementById('auth-section').classList.remove('active');
        if (role === 'student') {
            document.getElementById('student-dashboard').classList.add('active');
            document.getElementById('student-name-display').textContent = this.currentUser.name;
            this.loadStudentClasses();
        } else {
            document.getElementById('teacher-dashboard').classList.add('active');
            document.getElementById('teacher-name-display').textContent = this.currentUser.name;
            this.loadTeacherClasses();
            this.loadAttendanceDashboard();
        }
    }

    logout() {
        this.currentUser = null;
        this.currentRole = null;
        sessionStorage.removeItem('currentUser');
        sessionStorage.removeItem('currentRole');

        document.querySelectorAll('.section').forEach(section => section.classList.remove('active'));
        document.getElementById('auth-section').classList.add('active');
    }

    handleJoinClass(e) {
        e.preventDefault();
        const classCode = document.getElementById('class-code').value.trim();

        const classes = JSON.parse(localStorage.getItem('classes'));
        const classData = classes.find(c => c.code === classCode);

        if (!classData) {
            this.showMessage(e.target, 'Invalid class code', 'error');
            return;
        }

        if (classData.students.includes(this.currentUser.id)) {
            this.showMessage(e.target, 'You are already enrolled in this class', 'error');
            return;
        }

        classData.students.push(this.currentUser.id);
        localStorage.setItem('classes', JSON.stringify(classes));

        const students = JSON.parse(localStorage.getItem('students'));
        const student = students.find(s => s.id === this.currentUser.id);
        if (!student.classes) student.classes = [];
        student.classes.push(classData.id);
        localStorage.setItem('students', JSON.stringify(students));

        this.currentUser = student;
        sessionStorage.setItem('currentUser', JSON.stringify(student));

        this.showMessage(e.target, 'Successfully joined the class!', 'success');
        e.target.reset();
        this.loadStudentClasses();
    }

    handleCreateClass(e) {
        e.preventDefault();
        const name = document.getElementById('class-name').value;
        const subject = document.getElementById('class-subject').value;
        const section = document.getElementById('class-section').value;

        const classes = JSON.parse(localStorage.getItem('classes'));

        const classData = {
            id: Date.now().toString(),
            name,
            subject,
            section,
            code: this.generateClassCode(),
            teacherId: this.currentUser.id,
            students: [],
            sessions: []
        };

        classes.push(classData);
        localStorage.setItem('classes', JSON.stringify(classes));

        const teachers = JSON.parse(localStorage.getItem('teachers'));
        const teacher = teachers.find(t => t.id === this.currentUser.id);
        if (!teacher.classes) teacher.classes = [];
        teacher.classes.push(classData.id);
        localStorage.setItem('teachers', JSON.stringify(teachers));

        this.currentUser = teacher;
        sessionStorage.setItem('currentUser', JSON.stringify(teacher));

        this.showMessage(e.target, `Class created successfully! Code: ${classData.code}`, 'success');
        e.target.reset();
        this.loadTeacherClasses();
    }

    generateClassCode() {
        return Math.random().toString(36).substring(2, 8).toUpperCase();
    }

    loadStudentClasses() {
        const container = document.getElementById('student-classes-list');
        const classes = JSON.parse(localStorage.getItem('classes'));
        const studentClasses = classes.filter(c => c.students.includes(this.currentUser.id));

        if (studentClasses.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📚</div>
                    <h3>No Classes Yet</h3>
                    <p>Join a class using the class code provided by your teacher</p>
                </div>
            `;
            return;
        }

        container.innerHTML = studentClasses.map(classData => {
            const activeSessions = this.getActiveSessionsForClass(classData.id);
            return `
                <div class="class-card">
                    <div class="class-card-header">
                        <h3 class="class-card-title">${classData.name}</h3>
                        <p class="class-card-subtitle">${classData.subject} - Section ${classData.section}</p>
                    </div>
                    <div class="class-card-info">
                        <div class="info-item">📋 Code: ${classData.code}</div>
                        <div class="info-item">👥 ${classData.students.length} students</div>
                    </div>
                    ${activeSessions.length > 0 ? `
                        <div class="class-card-actions">
                            ${activeSessions.map(session => `
                                <button class="btn btn-success" onclick="system.markAttendance('${classData.id}', '${session.id}')">
                                    Mark Present
                                </button>
                            `).join('')}
                        </div>
                    ` : '<p style="color: #666; font-size: 14px;">No active attendance sessions</p>'}
                </div>
            `;
        }).join('');
    }

    loadTeacherClasses() {
        const container = document.getElementById('teacher-classes-list');
        const classes = JSON.parse(localStorage.getItem('classes'));
        const teacherClasses = classes.filter(c => c.teacherId === this.currentUser.id);

        if (teacherClasses.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📚</div>
                    <h3>No Classes Yet</h3>
                    <p>Create your first class to get started</p>
                </div>
            `;
            return;
        }

        container.innerHTML = teacherClasses.map(classData => `
            <div class="class-card" onclick="system.openClassModal('${classData.id}')">
                <div class="class-card-header">
                    <h3 class="class-card-title">${classData.name}</h3>
                    <p class="class-card-subtitle">${classData.subject} - Section ${classData.section}</p>
                </div>
                <div class="class-card-info">
                    <div class="info-item">📋 Code: ${classData.code}</div>
                    <div class="info-item">👥 ${classData.students.length} students</div>
                    <div class="info-item">📅 ${classData.sessions ? classData.sessions.length : 0} sessions</div>
                </div>
            </div>
        `).join('');
    }

    getActiveSessionsForClass(classId) {
        const classes = JSON.parse(localStorage.getItem('classes'));
        const classData = classes.find(c => c.id === classId);
        if (!classData || !classData.sessions) return [];

        const now = new Date();
        const currentDate = now.toISOString().split('T')[0];
        const currentTime = now.getHours() * 60 + now.getMinutes();

        return classData.sessions.filter(session => {
            if (session.date !== currentDate) return false;

            const [startHour, startMin] = session.startTime.split(':').map(Number);
            const [endHour, endMin] = session.endTime.split(':').map(Number);
            const startMinutes = startHour * 60 + startMin;
            const endMinutes = endHour * 60 + endMin;

            return currentTime >= startMinutes && currentTime <= endMinutes;
        });
    }

    markAttendance(classId, sessionId) {
        const attendance = JSON.parse(localStorage.getItem('attendance'));
        
        const existingRecord = attendance.find(a => 
            a.studentId === this.currentUser.id && 
            a.sessionId === sessionId
        );

        if (existingRecord) {
            alert('You have already marked attendance for this session');
            return;
        }

        const record = {
            id: Date.now().toString(),
            studentId: this.currentUser.id,
            classId: classId,
            sessionId: sessionId,
            timestamp: new Date().toISOString(),
            status: 'present'
        };

        attendance.push(record);
        localStorage.setItem('attendance', JSON.stringify(attendance));

        alert('Attendance marked successfully!');
        this.loadStudentClasses();
    }

    openClassModal(classId) {
        this.currentClassId = classId;
        const classes = JSON.parse(localStorage.getItem('classes'));
        const classData = classes.find(c => c.id === classId);

        document.getElementById('modal-class-title').textContent = classData.name;
        document.getElementById('modal-subject').textContent = classData.subject;
        document.getElementById('modal-section').textContent = classData.section;
        document.getElementById('modal-code').textContent = classData.code;
        document.getElementById('modal-student-count').textContent = classData.students.length;

        this.loadClassSessions(classId);
        this.loadClassStudents(classId);

        document.getElementById('class-detail-modal').classList.add('active');

        document.getElementById('session-date').valueAsDate = new Date();
    }

    closeModal() {
        document.getElementById('class-detail-modal').classList.remove('active');
        this.currentClassId = null;
    }

    switchModalTab(tab) {
        document.querySelectorAll('.modal-tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector(`.modal-tab-btn[data-tab="${tab}"]`).classList.add('active');

        document.querySelectorAll('.modal-tab-content').forEach(content => content.classList.remove('active'));
        document.getElementById(`${tab}-modal-tab`).classList.add('active');
    }

    switchDashboardTab(tab) {
        document.querySelectorAll('.dash-tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector(`.dash-tab-btn[data-tab="${tab}"]`).classList.add('active');

        document.querySelectorAll('.dash-tab-content').forEach(content => content.classList.remove('active'));
        document.getElementById(`${tab}-tab`).classList.add('active');

        if (tab === 'attendance') {
            this.loadAttendanceDashboard();
        }
    }

    handleCreateSession(e) {
        e.preventDefault();
        const date = document.getElementById('session-date').value;
        const startTime = document.getElementById('session-start-time').value;
        const endTime = document.getElementById('session-end-time').value;

        if (new Date(`${date} ${startTime}`) >= new Date(`${date} ${endTime}`)) {
            alert('End time must be after start time');
            return;
        }

        const classes = JSON.parse(localStorage.getItem('classes'));
        const classData = classes.find(c => c.id === this.currentClassId);

        if (!classData.sessions) classData.sessions = [];

        const session = {
            id: Date.now().toString(),
            date,
            startTime,
            endTime,
            createdAt: new Date().toISOString()
        };

        classData.sessions.push(session);
        localStorage.setItem('classes', JSON.stringify(classes));

        alert('Attendance session created successfully!');
        e.target.reset();
        this.loadClassSessions(this.currentClassId);

        document.getElementById('session-date').valueAsDate = new Date();
    }

    loadClassSessions(classId) {
        const container = document.getElementById('sessions-list');
        const classes = JSON.parse(localStorage.getItem('classes'));
        const classData = classes.find(c => c.id === classId);

        if (!classData.sessions || classData.sessions.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <p>No attendance sessions created yet</p>
                </div>
            `;
            return;
        }

        const sessions = classData.sessions.sort((a, b) => 
            new Date(`${b.date} ${b.startTime}`) - new Date(`${a.date} ${a.startTime}`)
        );

        container.innerHTML = sessions.map(session => {
            const status = this.getSessionStatus(session);
            const attendance = this.getSessionAttendance(classId, session.id);
            
            return `
                <div class="session-card ${status}">
                    <div class="session-header">
                        <div>
                            <strong>📅 ${this.formatDate(session.date)}</strong>
                            <div class="session-info">⏰ ${session.startTime} - ${session.endTime}</div>
                        </div>
                        <span class="status-badge ${status}">${status}</span>
                    </div>
                    <div class="session-info">
                        Present: ${attendance.present} / ${classData.students.length} students
                    </div>
                </div>
            `;
        }).join('');
    }

    getSessionStatus(session) {
        const now = new Date();
        const currentDate = now.toISOString().split('T')[0];
        const currentTime = now.getHours() * 60 + now.getMinutes();

        if (session.date > currentDate) return 'upcoming';
        if (session.date < currentDate) return 'expired';

        const [startHour, startMin] = session.startTime.split(':').map(Number);
        const [endHour, endMin] = session.endTime.split(':').map(Number);
        const startMinutes = startHour * 60 + startMin;
        const endMinutes = endHour * 60 + endMin;

        if (currentTime < startMinutes) return 'upcoming';
        if (currentTime > endMinutes) return 'expired';
        return 'active';
    }

    getSessionAttendance(classId, sessionId) {
        const attendance = JSON.parse(localStorage.getItem('attendance'));
        const sessionAttendance = attendance.filter(a => 
            a.classId === classId && a.sessionId === sessionId
        );

        return {
            present: sessionAttendance.length,
            records: sessionAttendance
        };
    }

    loadClassStudents(classId) {
        const container = document.getElementById('class-students-list');
        const classes = JSON.parse(localStorage.getItem('classes'));
        const students = JSON.parse(localStorage.getItem('students'));
        const classData = classes.find(c => c.id === classId);

        if (classData.students.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <p>No students enrolled yet</p>
                </div>
            `;
            return;
        }

        const classStudents = students.filter(s => classData.students.includes(s.id));

        container.innerHTML = classStudents.map(student => {
            const studentAttendance = this.calculateStudentAttendance(classId, student.id);
            return `
                <div class="student-item">
                    <div class="student-info">
                        <h4>${student.name}</h4>
                        <p>Roll: ${student.rollNumber} | Email: ${student.email}</p>
                    </div>
                    <div>
                        <span class="status-badge ${studentAttendance.percentage >= 75 ? 'present' : 'absent'}">
                            ${studentAttendance.percentage.toFixed(1)}% Attendance
                        </span>
                    </div>
                </div>
            `;
        }).join('');
    }

    calculateStudentAttendance(classId, studentId) {
        const classes = JSON.parse(localStorage.getItem('classes'));
        const attendance = JSON.parse(localStorage.getItem('attendance'));
        const classData = classes.find(c => c.id === classId);

        if (!classData.sessions || classData.sessions.length === 0) {
            return { present: 0, total: 0, percentage: 0 };
        }

        const totalSessions = classData.sessions.length;
        const presentSessions = attendance.filter(a => 
            a.classId === classId && a.studentId === studentId
        ).length;

        return {
            present: presentSessions,
            total: totalSessions,
            percentage: (presentSessions / totalSessions) * 100
        };
    }

    loadAttendanceDashboard() {
        const classes = JSON.parse(localStorage.getItem('classes'));
        const teacherClasses = classes.filter(c => c.teacherId === this.currentUser.id);

        const filterSelect = document.getElementById('class-filter');
        filterSelect.innerHTML = '<option value="">Select a class</option>' +
            teacherClasses.map(c => `<option value="${c.id}">${c.name} - ${c.section}</option>`).join('');

        filterSelect.onchange = (e) => {
            if (e.target.value) {
                this.displayClassAttendance(e.target.value);
            } else {
                document.getElementById('attendance-overview').innerHTML = '';
            }
        };
    }

    displayClassAttendance(classId) {
        const container = document.getElementById('attendance-overview');
        const classes = JSON.parse(localStorage.getItem('classes'));
        const students = JSON.parse(localStorage.getItem('students'));
        const classData = classes.find(c => c.id === classId);

        if (classData.students.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <p>No students enrolled in this class</p>
                </div>
            `;
            return;
        }

        const classStudents = students.filter(s => classData.students.includes(s.id));
        const totalSessions = classData.sessions ? classData.sessions.length : 0;

        let totalPresent = 0;
        let totalPossible = totalSessions * classStudents.length;

        const attendanceData = classStudents.map(student => {
            const attendance = this.calculateStudentAttendance(classId, student.id);
            totalPresent += attendance.present;
            return {
                student,
                attendance
            };
        });

        const averageAttendance = totalPossible > 0 ? (totalPresent / totalPossible * 100).toFixed(1) : 0;

        container.innerHTML = `
            <div class="attendance-stats">
                <div class="stat-card">
                    <div class="stat-value">${classStudents.length}</div>
                    <div class="stat-label">Total Students</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${totalSessions}</div>
                    <div class="stat-label">Total Sessions</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${averageAttendance}%</div>
                    <div class="stat-label">Average Attendance</div>
                </div>
            </div>
            <div class="attendance-table">
                <table>
                    <thead>
                        <tr>
                            <th>Roll Number</th>
                            <th>Student Name</th>
                            <th>Email</th>
                            <th>Present</th>
                            <th>Total</th>
                            <th>Percentage</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${attendanceData.map(data => `
                            <tr>
                                <td>${data.student.rollNumber}</td>
                                <td>${data.student.name}</td>
                                <td>${data.student.email}</td>
                                <td>${data.attendance.present}</td>
                                <td>${data.attendance.total}</td>
                                <td>${data.attendance.percentage.toFixed(1)}%</td>
                                <td>
                                    <span class="status-badge ${data.attendance.percentage >= 75 ? 'present' : 'absent'}">
                                        ${data.attendance.percentage >= 75 ? 'Good' : 'Low'}
                                    </span>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            weekday: 'short', 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    }

    updateCurrentTime() {
        const updateTime = () => {
            const now = new Date();
            const timeString = now.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit',
                second: '2-digit'
            });
            const element = document.getElementById('current-time-display');
            if (element) {
                element.textContent = timeString;
            }
        };

        updateTime();
        setInterval(updateTime, 1000);

        setInterval(() => {
            if (this.currentRole === 'student') {
                this.loadStudentClasses();
            }
        }, 30000);
    }

    showMessage(form, message, type) {
        const messageDiv = form.querySelector('.form-message');
        messageDiv.textContent = message;
        messageDiv.className = `form-message ${type}`;

        setTimeout(() => {
            messageDiv.className = 'form-message';
        }, 5000);
    }
}

const system = new AttendanceSystem();
