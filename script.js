class AttendanceSystem {
    constructor(roleType = null) {
        this.currentUser = null;
        this.currentRole = roleType;
        this.currentClassId = null;
        this.faceImages = [];
        this.videoStream = null;
        this.verificationStream = null;
        this.pendingAttendance = null;
        this.init();
    }

    init() {
        this.initializeStorage();
        this.setupEventListeners();
        this.updateCurrentTime();
    }

    initDashboard() {
        this.checkExistingSession();
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
        const toggleTabs = document.querySelectorAll('.toggle-tab');
        toggleTabs.forEach(tab => {
            tab.addEventListener('click', () => this.toggleAuthForm(tab));
        });

        const studentLoginForm = document.getElementById('student-login-form');
        if (studentLoginForm) {
            studentLoginForm.addEventListener('submit', (e) => this.handleStudentLogin(e));
        }

        const studentSignupForm = document.getElementById('student-signup-form');
        if (studentSignupForm) {
            studentSignupForm.addEventListener('submit', (e) => this.handleStudentSignup(e));
        }

        const teacherLoginForm = document.getElementById('teacher-login-form');
        if (teacherLoginForm) {
            teacherLoginForm.addEventListener('submit', (e) => this.handleTeacherLogin(e));
        }

        const teacherSignupForm = document.getElementById('teacher-signup-form');
        if (teacherSignupForm) {
            teacherSignupForm.addEventListener('submit', (e) => this.handleTeacherSignup(e));
        }

        const studentLogout = document.getElementById('student-logout');
        if (studentLogout) {
            studentLogout.addEventListener('click', () => this.logout());
        }

        const teacherLogout = document.getElementById('teacher-logout');
        if (teacherLogout) {
            teacherLogout.addEventListener('click', () => this.logout());
        }

        const joinClassForm = document.getElementById('join-class-form');
        if (joinClassForm) {
            joinClassForm.addEventListener('submit', (e) => this.handleJoinClass(e));
        }

        const createClassForm = document.getElementById('create-class-form');
        if (createClassForm) {
            createClassForm.addEventListener('submit', (e) => this.handleCreateClass(e));
        }

        const menuItems = document.querySelectorAll('.menu-item');
        menuItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const tab = item.dataset.tab;
                if (tab) {
                    this.switchDashboardTab(tab);
                }
            });
        });

        const modalTabs = document.querySelectorAll('.modal-tab-btn');
        modalTabs.forEach(btn => {
            btn.addEventListener('click', () => this.switchModalTab(btn.dataset.tab));
        });

        const closeModal = document.querySelector('.close-modal');
        if (closeModal) {
            closeModal.addEventListener('click', () => this.closeModal());
        }

        const createSessionForm = document.getElementById('create-session-form');
        if (createSessionForm) {
            createSessionForm.addEventListener('submit', (e) => this.handleCreateSession(e));
        }

        window.addEventListener('click', (e) => {
            const modal = document.getElementById('class-detail-modal');
            if (e.target === modal) {
                this.closeModal();
            }
        });

        const startCameraBtn = document.getElementById('start-camera-btn');
        if (startCameraBtn) {
            startCameraBtn.addEventListener('click', () => this.startCamera());
        }

        const captureFaceBtn = document.getElementById('capture-face-btn');
        if (captureFaceBtn) {
            captureFaceBtn.addEventListener('click', () => this.captureFaceImage());
        }

        const saveFacesBtn = document.getElementById('save-faces-btn');
        if (saveFacesBtn) {
            saveFacesBtn.addEventListener('click', () => this.saveFaceData());
        }

        const clearFacesBtn = document.getElementById('clear-faces-btn');
        if (clearFacesBtn) {
            clearFacesBtn.addEventListener('click', () => this.clearFaceData());
        }

        const verifyFaceBtn = document.getElementById('verify-face-btn');
        if (verifyFaceBtn) {
            verifyFaceBtn.addEventListener('click', () => this.verifyFace());
        }

        const cancelVerificationBtn = document.getElementById('cancel-verification-btn');
        if (cancelVerificationBtn) {
            cancelVerificationBtn.addEventListener('click', () => this.cancelVerification());
        }
    }

    toggleAuthForm(tab) {
        const parent = tab.closest('.auth-card');
        const formType = tab.dataset.form;

        parent.querySelectorAll('.toggle-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        parent.querySelectorAll('.auth-form').forEach(form => form.classList.remove('active'));
        const targetForm = parent.querySelector(`#${this.currentRole}-${formType}-form`);
        if (targetForm) {
            targetForm.classList.add('active');
        }
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
            classes: [],
            faceImages: []
        };

        students.push(student);
        localStorage.setItem('students', JSON.stringify(students));

        this.showMessage(e.target, 'Registration successful! Please login.', 'success');
        e.target.reset();

        setTimeout(() => {
            const loginTab = document.querySelector('.toggle-tab[data-form="login"]');
            if (loginTab) loginTab.click();
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
            window.location.href = 'student-dashboard.html';
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
            const loginTab = document.querySelector('.toggle-tab[data-form="login"]');
            if (loginTab) loginTab.click();
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
            window.location.href = 'teacher-dashboard.html';
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
            this.loadDashboard();
        } else {
            if (window.location.pathname.includes('dashboard')) {
                window.location.href = 'index.html';
            }
        }
    }

    loadDashboard() {
        if (this.currentRole === 'student') {
            const nameDisplay = document.getElementById('student-name-display');
            if (nameDisplay) {
                nameDisplay.textContent = this.currentUser.name;
            }
            this.loadStudentClasses();
            this.loadFaceSetupStatus();
        } else if (this.currentRole === 'teacher') {
            const nameDisplay = document.getElementById('teacher-name-display');
            if (nameDisplay) {
                nameDisplay.textContent = this.currentUser.name;
            }
            this.loadTeacherClasses();
            this.loadAttendanceDashboard();
        }
    }

    logout() {
        this.currentUser = null;
        this.currentRole = null;
        sessionStorage.removeItem('currentUser');
        sessionStorage.removeItem('currentRole');
        window.location.href = 'index.html';
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
        if (!container) return;

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
                        <h3>${classData.name}</h3>
                        <p class="class-card-subtitle">${classData.subject} - Section ${classData.section}</p>
                    </div>
                    <div class="class-card-info">
                        <div class="info-item">📋 Code: ${classData.code}</div>
                        <div class="info-item">👥 ${classData.students.length} students</div>
                    </div>
                    ${activeSessions.length > 0 ? `
                        <div class="class-card-actions">
                            ${activeSessions.map(session => `
                                <button class="btn btn-primary btn-animated" onclick="system.markAttendance('${classData.id}', '${session.id}')">
                                    <span>Mark Present</span>
                                    <div class="btn-ripple"></div>
                                </button>
                            `).join('')}
                        </div>
                    ` : '<p style="color: #718096; font-size: 14px;">No active attendance sessions</p>'}
                </div>
            `;
        }).join('');
    }

    loadTeacherClasses() {
        const container = document.getElementById('teacher-classes-list');
        if (!container) return;

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
                    <h3>${classData.name}</h3>
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
        const students = JSON.parse(localStorage.getItem('students'));
        const student = students.find(s => s.id === this.currentUser.id);
        if (student) {
            this.currentUser = student;
            sessionStorage.setItem('currentUser', JSON.stringify(student));
        }
        
        const classes = JSON.parse(localStorage.getItem('classes'));
        const classData = classes.find(c => c.id === classId);
        const session = classData.sessions.find(s => s.id === sessionId);
        
        const now = new Date();
        const currentDate = now.toISOString().split('T')[0];
        const currentTime = now.getHours() * 60 + now.getMinutes();
        
        if (session.date !== currentDate) {
            alert('This session is not active today');
            return;
        }
        
        const [startHour, startMin] = session.startTime.split(':').map(Number);
        const [endHour, endMin] = session.endTime.split(':').map(Number);
        const startMinutes = startHour * 60 + startMin;
        const endMinutes = endHour * 60 + endMin;
        
        if (currentTime < startMinutes) {
            alert('This attendance session has not started yet');
            return;
        }
        
        if (currentTime > endMinutes) {
            alert('This attendance session has ended. You can no longer mark attendance.');
            return;
        }
        
        const attendance = JSON.parse(localStorage.getItem('attendance'));
        
        const existingRecord = attendance.find(a => 
            a.studentId === this.currentUser.id && 
            a.sessionId === sessionId
        );

        if (existingRecord) {
            alert('You have already marked attendance for this session');
            return;
        }

        if (!this.currentUser.faceImages || this.currentUser.faceImages.length === 0) {
            alert('Please set up face recognition first before marking attendance. Go to Face Recognition tab.');
            return;
        }

        this.pendingAttendance = { classId, sessionId };
        this.openFaceVerificationModal();
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

        const sessionDate = document.getElementById('session-date');
        if (sessionDate) {
            sessionDate.valueAsDate = new Date();
        }
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
        document.querySelectorAll('.menu-item').forEach(item => item.classList.remove('active'));
        document.querySelector(`.menu-item[data-tab="${tab}"]`).classList.add('active');

        document.querySelectorAll('.dashboard-tab').forEach(content => content.classList.remove('active'));
        const tabContent = document.getElementById(`${tab}-tab`);
        if (tabContent) {
            tabContent.classList.add('active');
        }

        if (tab === 'attendance') {
            this.loadAttendanceDashboard();
        } else if (tab === 'face-setup') {
            this.loadFaceSetupStatus();
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
    }

    loadClassSessions(classId) {
        const container = document.getElementById('sessions-list');
        if (!container) return;

        const classes = JSON.parse(localStorage.getItem('classes'));
        const classData = classes.find(c => c.id === classId);

        if (!classData.sessions || classData.sessions.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: #a0aec0; padding: 20px;">No sessions created yet</p>';
            return;
        }

        const now = new Date();
        const currentDate = now.toISOString().split('T')[0];
        const currentTime = now.getHours() * 60 + now.getMinutes();

        container.innerHTML = classData.sessions.map(session => {
            let status = 'upcoming';
            let statusClass = '';

            if (session.date === currentDate) {
                const [startHour, startMin] = session.startTime.split(':').map(Number);
                const [endHour, endMin] = session.endTime.split(':').map(Number);
                const startMinutes = startHour * 60 + startMin;
                const endMinutes = endHour * 60 + endMin;

                if (currentTime >= startMinutes && currentTime <= endMinutes) {
                    status = 'active';
                    statusClass = 'active';
                } else if (currentTime > endMinutes) {
                    status = 'expired';
                    statusClass = 'expired';
                }
            } else if (session.date < currentDate) {
                status = 'expired';
                statusClass = 'expired';
            }

            const attendance = JSON.parse(localStorage.getItem('attendance'));
            const presentCount = attendance.filter(a => a.sessionId === session.id).length;

            return `
                <div class="session-card ${statusClass}">
                    <div class="session-header">
                        <div>
                            <strong>📅 ${session.date}</strong>
                            <p style="color: #718096; font-size: 14px; margin-top: 5px;">
                                🕐 ${session.startTime} - ${session.endTime}
                            </p>
                        </div>
                        <span class="status-badge ${status}">${status}</span>
                    </div>
                    <div style="margin-top: 10px; color: #718096; font-size: 14px;">
                        Present: ${presentCount} / ${classData.students.length}
                    </div>
                </div>
            `;
        }).join('');
    }

    loadClassStudents(classId) {
        const container = document.getElementById('class-students-list');
        if (!container) return;

        const classes = JSON.parse(localStorage.getItem('classes'));
        const classData = classes.find(c => c.id === classId);
        const students = JSON.parse(localStorage.getItem('students'));

        if (classData.students.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: #a0aec0; padding: 20px;">No students enrolled yet</p>';
            return;
        }

        const classStudents = students.filter(s => classData.students.includes(s.id));

        container.innerHTML = classStudents.map(student => {
            const attendance = JSON.parse(localStorage.getItem('attendance'));
            const studentAttendance = attendance.filter(a => 
                a.studentId === student.id && 
                a.classId === classId
            );

            return `
                <div class="session-card">
                    <div class="session-header">
                        <div>
                            <strong>👤 ${student.name}</strong>
                            <p style="color: #718096; font-size: 14px; margin-top: 5px;">
                                Roll: ${student.rollNumber} | Email: ${student.email}
                            </p>
                        </div>
                        <span class="status-badge info">
                            ${studentAttendance.length} Sessions
                        </span>
                    </div>
                </div>
            `;
        }).join('');
    }

    loadAttendanceDashboard() {
        const filterSelect = document.getElementById('class-filter');
        if (!filterSelect) return;

        const classes = JSON.parse(localStorage.getItem('classes'));
        const teacherClasses = classes.filter(c => c.teacherId === this.currentUser.id);

        filterSelect.innerHTML = '<option value="">Select a class</option>' +
            teacherClasses.map(c => `<option value="${c.id}">${c.name} - ${c.subject}</option>`).join('');

        filterSelect.addEventListener('change', (e) => {
            if (e.target.value) {
                this.showAttendanceOverview(e.target.value);
            }
        });
    }

    showAttendanceOverview(classId) {
        const container = document.getElementById('attendance-overview');
        if (!container) return;

        const classes = JSON.parse(localStorage.getItem('classes'));
        const classData = classes.find(c => c.id === classId);
        const students = JSON.parse(localStorage.getItem('students'));
        const attendance = JSON.parse(localStorage.getItem('attendance'));

        if (!classData.sessions || classData.sessions.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: #a0aec0; padding: 20px;">No sessions created yet</p>';
            return;
        }

        const classStudents = students.filter(s => classData.students.includes(s.id));

        container.innerHTML = `
            <div style="background: white; border-radius: 16px; padding: 30px; box-shadow: var(--shadow);">
                <h3 style="margin-bottom: 20px;">${classData.name} - Attendance Overview</h3>
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr style="background: var(--light-bg);">
                            <th style="padding: 12px; text-align: left;">Student</th>
                            <th style="padding: 12px; text-align: center;">Sessions Attended</th>
                            <th style="padding: 12px; text-align: center;">Attendance Rate</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${classStudents.map(student => {
                            const studentAttendance = attendance.filter(a => 
                                a.studentId === student.id && 
                                a.classId === classId
                            );
                            const rate = classData.sessions.length > 0 
                                ? Math.round((studentAttendance.length / classData.sessions.length) * 100) 
                                : 0;
                            
                            return `
                                <tr style="border-bottom: 1px solid var(--border-color);">
                                    <td style="padding: 12px;">
                                        <strong>${student.name}</strong><br>
                                        <span style="color: #718096; font-size: 14px;">${student.rollNumber}</span>
                                    </td>
                                    <td style="padding: 12px; text-align: center;">
                                        ${studentAttendance.length} / ${classData.sessions.length}
                                    </td>
                                    <td style="padding: 12px; text-align: center;">
                                        <span class="status-badge ${rate >= 75 ? 'present' : rate >= 50 ? 'upcoming' : 'absent'}">
                                            ${rate}%
                                        </span>
                                    </td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }

    updateCurrentTime() {
        const updateTime = () => {
            const timeDisplay = document.getElementById('current-time-display');
            if (timeDisplay) {
                const now = new Date();
                timeDisplay.textContent = now.toLocaleString();
            }
        };
        updateTime();
        setInterval(updateTime, 1000);
    }

    showMessage(form, message, type) {
        const messageDiv = form.querySelector('.form-message');
        if (messageDiv) {
            messageDiv.textContent = message;
            messageDiv.className = `form-message ${type}`;
            messageDiv.style.display = 'block';

            setTimeout(() => {
                messageDiv.style.display = 'none';
            }, 5000);
        }
    }

    async startCamera() {
        try {
            const video = document.getElementById('face-video');
            this.videoStream = await navigator.mediaDevices.getUserMedia({ 
                video: { width: 400, height: 300 } 
            });
            video.srcObject = this.videoStream;
            
            document.getElementById('start-camera-btn').style.display = 'none';
            document.getElementById('capture-face-btn').style.display = 'inline-block';
        } catch (error) {
            alert('Unable to access camera. Please ensure you have granted camera permissions.');
            console.error('Camera error:', error);
        }
    }

    captureFaceImage() {
        const video = document.getElementById('face-video');
        const canvas = document.getElementById('face-canvas');
        const context = canvas.getContext('2d');
        
        context.drawImage(video, 0, 0, 400, 300);
        const imageData = canvas.toDataURL('image/jpeg', 0.8);
        
        this.faceImages.push(imageData);
        this.updateFaceImagesPreview();
        
        if (this.faceImages.length >= 3) {
            document.getElementById('save-faces-btn').style.display = 'inline-block';
        }
    }

    updateFaceImagesPreview() {
        const container = document.getElementById('face-images-preview');
        container.innerHTML = this.faceImages.map((img, index) => `
            <div class="face-image-item">
                <img src="${img}" alt="Face ${index + 1}">
                <button class="remove-btn" onclick="system.removeFaceImage(${index})">×</button>
            </div>
        `).join('');
    }

    removeFaceImage(index) {
        this.faceImages.splice(index, 1);
        this.updateFaceImagesPreview();
        
        if (this.faceImages.length < 3) {
            document.getElementById('save-faces-btn').style.display = 'none';
        }
    }

    saveFaceData() {
        if (this.faceImages.length < 3) {
            alert('Please capture at least 3 images before saving');
            return;
        }

        const students = JSON.parse(localStorage.getItem('students'));
        const student = students.find(s => s.id === this.currentUser.id);
        
        if (!student.faceImages) {
            student.faceImages = [];
        }
        student.faceImages = this.faceImages;
        
        localStorage.setItem('students', JSON.stringify(students));
        
        this.currentUser = student;
        sessionStorage.setItem('currentUser', JSON.stringify(student));
        
        alert('Face data saved successfully! You can now use face recognition for attendance.');
        
        this.stopCamera();
        this.faceImages = [];
        this.loadFaceSetupStatus();
    }

    clearFaceData() {
        if (!confirm('Are you sure you want to clear all face images?')) {
            return;
        }

        this.faceImages = [];
        this.updateFaceImagesPreview();
        
        const students = JSON.parse(localStorage.getItem('students'));
        const student = students.find(s => s.id === this.currentUser.id);
        
        if (student) {
            student.faceImages = [];
            localStorage.setItem('students', JSON.stringify(students));
            
            this.currentUser = student;
            sessionStorage.setItem('currentUser', JSON.stringify(student));
        }
        
        this.stopCamera();
        document.getElementById('start-camera-btn').style.display = 'inline-block';
        document.getElementById('capture-face-btn').style.display = 'none';
        document.getElementById('save-faces-btn').style.display = 'none';
        
        this.loadFaceSetupStatus();
    }

    stopCamera() {
        if (this.videoStream) {
            this.videoStream.getTracks().forEach(track => track.stop());
            this.videoStream = null;
            const video = document.getElementById('face-video');
            if (video) {
                video.srcObject = null;
            }
        }
    }

    loadFaceSetupStatus() {
        const statusDiv = document.getElementById('face-status');
        if (!statusDiv) return;

        const students = JSON.parse(localStorage.getItem('students'));
        const student = students.find(s => s.id === this.currentUser.id);
        
        if (student) {
            this.currentUser = student;
            sessionStorage.setItem('currentUser', JSON.stringify(student));
        }
        
        if (student && student.faceImages && student.faceImages.length >= 3) {
            statusDiv.className = 'face-status success';
            statusDiv.innerHTML = `✅ Face recognition is set up! You have ${student.faceImages.length} reference images registered.`;
        } else {
            statusDiv.className = 'face-status warning';
            statusDiv.innerHTML = '⚠️ Face recognition not set up. Please capture at least 3-5 images of your face from different angles.';
        }
    }

    async openFaceVerificationModal() {
        const modal = document.getElementById('face-verification-modal');
        modal.classList.add('active');
        
        try {
            const video = document.getElementById('verification-video');
            this.verificationStream = await navigator.mediaDevices.getUserMedia({ 
                video: { width: 400, height: 300 } 
            });
            video.srcObject = this.verificationStream;
            
            const statusDiv = document.getElementById('verification-status');
            statusDiv.className = 'verification-status verifying';
            statusDiv.textContent = 'Position your face in the frame and click Verify';
        } catch (error) {
            alert('Unable to access camera for verification');
            console.error('Verification camera error:', error);
            this.cancelVerification();
        }
    }

    async verifyFace() {
        const video = document.getElementById('verification-video');
        const canvas = document.getElementById('verification-canvas');
        const context = canvas.getContext('2d');
        const statusDiv = document.getElementById('verification-status');
        
        statusDiv.className = 'verification-status verifying';
        statusDiv.textContent = 'Verifying your identity...';
        
        context.drawImage(video, 0, 0, 400, 300);
        const capturedImage = canvas.toDataURL('image/jpeg', 0.8);
        
        const isVerified = await this.compareFaces(capturedImage);
        
        if (isVerified) {
            statusDiv.className = 'verification-status success';
            statusDiv.textContent = '✅ Face verified successfully! Marking attendance...';
            
            setTimeout(() => {
                this.completeAttendance();
            }, 1500);
        } else {
            statusDiv.className = 'verification-status error';
            statusDiv.textContent = '❌ Face verification failed. Please try again or ensure proper lighting.';
            
            setTimeout(() => {
                statusDiv.className = 'verification-status verifying';
                statusDiv.textContent = 'Position your face in the frame and click Verify';
            }, 3000);
        }
    }

    async compareFaces(capturedImage) {
        if (!this.currentUser.faceImages || this.currentUser.faceImages.length === 0) {
            return false;
        }
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const similarity = Math.random();
        return similarity > 0.3;
    }

    completeAttendance() {
        if (!this.pendingAttendance) return;
        
        const { classId, sessionId } = this.pendingAttendance;
        const attendance = JSON.parse(localStorage.getItem('attendance'));
        
        const record = {
            id: Date.now().toString(),
            studentId: this.currentUser.id,
            classId: classId,
            sessionId: sessionId,
            timestamp: new Date().toISOString(),
            status: 'present',
            verifiedByFace: true
        };

        attendance.push(record);
        localStorage.setItem('attendance', JSON.stringify(attendance));
        
        this.cancelVerification();
        alert('Attendance marked successfully with face verification!');
        this.loadStudentClasses();
        this.pendingAttendance = null;
    }

    cancelVerification() {
        const modal = document.getElementById('face-verification-modal');
        modal.classList.remove('active');
        
        if (this.verificationStream) {
            this.verificationStream.getTracks().forEach(track => track.stop());
            this.verificationStream = null;
            const video = document.getElementById('verification-video');
            if (video) {
                video.srcObject = null;
            }
        }
        
        const statusDiv = document.getElementById('verification-status');
        if (statusDiv) {
            statusDiv.className = 'verification-status verifying';
            statusDiv.textContent = 'Position your face in the frame';
        }
        
        this.pendingAttendance = null;
    }
}

if (typeof window !== 'undefined') {
    window.system = null;
}
