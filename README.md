# Gaming-Themed Portfolio Website

A fully functional, gaming-inspired software development portfolio website showcasing skills, certifications, and projects with a modern dark theme and interactive animations.

## 🎮 Features

### Visual Design
- **Gaming-Inspired Theme**: Dark backgrounds with vibrant neon accents (cyan, purple, pink, green)
- **Retro-Modern Aesthetic**: Combines retro gaming elements with modern UI design
- **Fully Responsive**: Optimized for desktop, tablet, and mobile devices
- **Smooth Animations**: Interactive hover effects, particle backgrounds, and smooth transitions

### Sections

1. **Hero/Landing Section**
   - Eye-catching glitch text effect
   - Animated statistics counters
   - Gaming-style call-to-action buttons
   - Smooth scroll indicator

2. **About Me Section**
   - Player profile card with level badge
   - Achievement badges highlighting key skills
   - Engaging personal narrative

3. **Skills Section**
   - Animated progress bars for technical skills
   - Frontend: HTML5, CSS3, JavaScript, Responsive Design
   - Backend: Python, Flask, Django, RESTful APIs
   - Interactive skill badges for tools and technologies

4. **Certifications Section**
   - Featured CS50 certification
   - Animated rotating badge designs
   - Skill tags for each certification
   - Verified status indicators

5. **Projects/Portfolio Section**
   - Project cards with hover effects
   - Difficulty ratings (star system)
   - Technology stack tags
   - Flask and Django projects prominently featured
   - Interactive overlay with demo and code links

6. **Contact Section**
   - Fully functional contact form with validation
   - Contact methods with hover animations
   - Social media links
   - Success/error message feedback

### Technical Features

- **Particle Background**: Animated canvas particle system with connecting lines
- **Smooth Scrolling**: Seamless navigation between sections
- **Intersection Observer**: Efficient scroll-triggered animations
- **Responsive Navigation**: Mobile-friendly hamburger menu
- **Form Validation**: Client-side email and input validation
- **Custom Cursor**: Gaming-style cursor effects (desktop only)
- **Easter Egg**: Konami code activation
- **Scroll-to-Top Button**: Quick navigation back to top
- **3D Card Effects**: Perspective transforms on project cards

## 🚀 Technologies Used

- **HTML5**: Semantic markup and structure
- **CSS3**: Advanced styling with CSS Grid, Flexbox, animations, and custom properties
- **Vanilla JavaScript**: Interactive features and DOM manipulation
- **Google Fonts**: Orbitron (headings) and Rajdhani (body text)
- **Canvas API**: Particle effect system

## 📁 Project Structure

```
project/
├── index.html          # Main HTML structure
├── styles.css          # Complete styling with gaming theme
├── script.js           # JavaScript functionality
└── README.md           # Project documentation
```

## 🎨 Color Palette

```css
--bg-primary: #0a0e27        /* Dark blue background */
--bg-secondary: #131729      /* Secondary dark background */
--bg-tertiary: #1a1f3a       /* Tertiary background */
--neon-cyan: #00f0ff         /* Bright cyan accent */
--neon-purple: #b537f2       /* Purple accent */
--neon-pink: #ff00ff         /* Pink accent */
--neon-green: #00ff88        /* Green accent */
--text-primary: #ffffff      /* White text */
--text-secondary: #b8c5d6    /* Light blue-gray text */
--text-muted: #7a8ba3        /* Muted gray text */
```

## 🔧 Setup & Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <project-directory>
   ```

2. Open the website:
   - Simply open `index.html` in a modern web browser
   - Or use a local development server:
     ```bash
     # Python 3
     python -m http.server 8000
     
     # Then visit http://localhost:8000
     ```

## 📱 Responsive Breakpoints

- **Desktop**: > 968px
- **Tablet**: 600px - 968px
- **Mobile**: < 600px

## ✨ Interactive Features

### Particle System
- 100 animated particles floating across the screen
- Particles connect when within proximity
- Responsive to window resizing

### Skill Animations
- Progress bars animate on scroll
- Smooth counter animations for statistics
- Fade-in effects for cards and sections

### Form Functionality
- Real-time input validation
- Visual feedback with border animations
- Success/error message display
- Disabled state during submission

### Navigation
- Sticky header with background change on scroll
- Active section highlighting
- Smooth scroll to sections
- Mobile hamburger menu

## 🎮 Easter Eggs

Try entering the Konami Code: ↑ ↑ ↓ ↓ ← → ← → B A

## 🌐 Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Opera

## 📝 Customization

### Updating Content

1. **Personal Information**: Edit the text content in `index.html`
2. **Skills**: Modify skill items and percentages in the skills section
3. **Projects**: Add or modify project cards with your own projects
4. **Contact Info**: Update email and social links in the contact section
5. **Colors**: Adjust CSS variables in `:root` selector in `styles.css`

### Adding Projects

```html
<div class="project-card" data-category="flask">
    <div class="project-image">
        <!-- Project image content -->
    </div>
    <div class="project-info">
        <h3 class="project-title">Your Project Name</h3>
        <p class="project-description">Your description</p>
        <div class="project-tech">
            <span class="tech-tag">Technology</span>
        </div>
    </div>
</div>
```

## 🚀 Performance Optimizations

- Efficient scroll event handling with requestAnimationFrame
- Intersection Observer for lazy animations
- CSS transforms for smooth animations (GPU-accelerated)
- Minimal external dependencies
- Optimized particle count for performance

## 📄 License

This project is open source and available for personal and commercial use.

## 🤝 Contributing

Feel free to fork this project and customize it for your own portfolio!

## 📧 Contact

For questions or feedback, please use the contact form on the website.

---

**Coded with ❤️ and ☕**
