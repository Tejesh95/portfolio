# Attendance Management System

A comprehensive web-based attendance management system with time-bound login functionality for educational institutions. This system allows teachers to create classes and manage attendance sessions, while students can join classes and mark their attendance within specified time windows.

## Features

### Authentication
- **Separate Sign-in/Sign-up for Students and Teachers**
  - Student registration with name, email, roll number, and password
  - Teacher registration with name, email, department, and password
  - Secure login for both user types
  - Session management to maintain login state

### Teacher Dashboard
1. **Class Management**
   - Create unlimited classes with custom sections (A, B, C, etc.)
   - Each class contains variable number of students
   - Generate unique class codes for student enrollment
   - View all created classes with student counts

2. **Attendance Session Management**
   - Create time-bound attendance sessions for each class
   - Set specific date, start time, and end time for attendance
   - Students can only mark attendance within the specified time window
   - View session status (Active, Upcoming, or Expired)
   - Track attendance for each session

3. **Attendance Dashboard**
   - Comprehensive view of all students' attendance records
   - Filter by class to view specific class attendance
   - View statistics:
     - Total students enrolled
     - Total sessions conducted
     - Average attendance percentage
   - Detailed table showing:
     - Student roll numbers and names
     - Present/Total sessions count
     - Attendance percentage
     - Status indicators (Good/Low)
   - Individual student attendance tracking

### Student Dashboard
1. **Class Enrollment**
   - Join classes using unique class codes provided by teachers
   - View all enrolled classes
   - See class details (subject, section, student count)

2. **Time-Bound Attendance Marking**
   - Real-time display of current time
   - Automatic detection of active attendance sessions
   - Mark attendance only during specified time windows
   - "Mark Present" button appears only when session is active
   - Automatic refresh every 30 seconds to check for new sessions
   - Prevents duplicate attendance marking

3. **Attendance Tracking**
   - View personal attendance statistics
   - See enrollment status in each class

## Technical Implementation

### Technologies Used
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Data Storage**: LocalStorage for data persistence
- **Architecture**: Object-Oriented JavaScript with class-based design

### Data Structure
The system uses LocalStorage to store:
- Students (name, email, roll number, password, enrolled classes)
- Teachers (name, email, department, password, created classes)
- Classes (name, subject, section, code, teacher, students, sessions)
- Attendance records (student, class, session, timestamp, status)

### Key Features Implementation

#### Time-Bound Attendance System
Students can only mark attendance when:
1. The current date matches the session date
2. The current time is between the session's start and end time
3. They haven't already marked attendance for that session

The system checks these conditions in real-time and automatically shows/hides the "Mark Present" button accordingly.

#### Session Status Tracking
Sessions are automatically categorized as:
- **Active**: Current date and time falls within the session window (Green)
- **Upcoming**: Session is scheduled for future (Yellow)
- **Expired**: Session time has passed (Red)

#### Attendance Calculations
- Individual student attendance percentage per class
- Overall class attendance statistics
- Present/Total session tracking
- Color-coded status indicators (≥75% = Good, <75% = Low)

## Usage

### For Teachers:
1. Sign up with your details (name, email, department, password)
2. Log in to access the teacher dashboard
3. Create a class by providing:
   - Class name
   - Subject
   - Section
4. Note the generated class code and share it with students
5. Open a class to create attendance sessions:
   - Set the date
   - Specify start and end times
6. View attendance dashboard to monitor student attendance

### For Students:
1. Sign up with your details (name, email, roll number, password)
2. Log in to access the student dashboard
3. Join a class using the code provided by your teacher
4. When an attendance session is active:
   - The "Mark Present" button will appear
   - Click it to mark your attendance
5. Monitor your attendance status for each class

## Setup & Installation

1. Clone or download the repository
2. Open `index.html` in a modern web browser
3. No server setup required - runs entirely in the browser

For development server:
```bash
# Python 3
python -m http.server 8000

# Node.js (with http-server)
npx http-server

# Then visit http://localhost:8000
```

## Browser Compatibility
- Chrome (recommended)
- Firefox
- Safari
- Edge
- Any modern browser with ES6+ support and LocalStorage

## Features Summary

✅ Student and Teacher authentication (sign-in/sign-up)  
✅ Multiple sections per class  
✅ Variable number of students per class  
✅ Time-bound attendance marking  
✅ Teacher dashboard with complete attendance overview  
✅ Real-time session status updates  
✅ Automatic attendance validation  
✅ Comprehensive attendance statistics  
✅ Responsive design for mobile and desktop  

## Future Enhancements (Optional)
- Export attendance to CSV/PDF
- Email notifications for attendance sessions
- QR code-based attendance
- Backend API integration
- Database persistence (MySQL/MongoDB)
- Analytics and reporting
- Attendance trends and visualizations

## License
This project is open source and available for educational purposes.

---

**Developed as a comprehensive attendance management solution for educational institutions**
