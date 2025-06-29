# 🤝 Contributing to MediConnect

Thank you for your interest in contributing to MediConnect! This document provides guidelines and information for contributors.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Coding Standards](#coding-standards)
- [Git Workflow](#git-workflow)
- [Testing](#testing)
- [Pull Request Process](#pull-request-process)
- [Bug Reports](#bug-reports)
- [Feature Requests](#feature-requests)
- [Documentation](#documentation)

## 📜 Code of Conduct

### Our Standards

We are committed to providing a welcoming and inspiring community for all. By participating in this project, you agree to:

- **Be respectful**: Treat everyone with respect and dignity
- **Be inclusive**: Welcome people of all backgrounds and experience levels
- **Be collaborative**: Work together to achieve common goals
- **Be constructive**: Provide helpful and constructive feedback
- **Be professional**: Maintain professional behavior in all interactions

### Unacceptable Behavior

The following behaviors are considered unacceptable:

- Harassment, discrimination, or bullying
- Offensive or inappropriate comments
- Spam or unsolicited commercial content
- Violation of privacy or confidentiality
- Any other conduct that could reasonably be considered inappropriate

## 🚀 Getting Started

### Prerequisites

Before contributing, ensure you have:

- **Node.js** (v18 or higher)
- **Git** installed and configured
- **MongoDB Atlas** account (for database)
- **Cloudinary** account (for file uploads)
- Basic knowledge of:
  - React.js
  - Node.js/Express.js
  - MongoDB
  - Git

### Fork and Clone

1. **Fork the repository**
   - Go to the main repository page
   - Click the "Fork" button in the top right
   - This creates your own copy of the repository

2. **Clone your fork**
   ```bash
   git clone https://github.com/your-username/mediconnect-mern-main.git
   cd mediconnect-mern-main
   ```

3. **Add upstream remote**
   ```bash
   git remote add upstream https://github.com/original-owner/mediconnect-mern-main.git
   ```

## 🛠️ Development Setup

### 1. Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

Start development server:
```bash
npm run dev
```

### 2. Frontend Setup

```bash
cd frontend
npm install
```

Create `.env.local` file:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

Start development server:
```bash
npm run dev
```

### 3. Admin Dashboard Setup (Optional)

```bash
cd admin
npm install
npm run dev
```

## 📝 Coding Standards

### JavaScript/React Standards

#### 1. Code Style
- Use **ES6+** features
- Prefer **const** and **let** over **var**
- Use **arrow functions** for callbacks
- Use **template literals** for string concatenation
- Use **destructuring** where appropriate

#### 2. Naming Conventions
```javascript
// Variables and functions - camelCase
const userName = 'John';
const getUserData = () => {};

// Constants - UPPER_SNAKE_CASE
const API_BASE_URL = 'https://api.example.com';

// Components - PascalCase
const UserProfile = () => {};

// Files - kebab-case
// user-profile.jsx, api-service.js
```

#### 3. Component Structure
```javascript
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const ComponentName = ({ prop1, prop2 }) => {
  // 1. State declarations
  const [state, setState] = useState(initialValue);

  // 2. Effects
  useEffect(() => {
    // Effect logic
  }, [dependencies]);

  // 3. Event handlers
  const handleClick = () => {
    // Handler logic
  };

  // 4. Helper functions
  const helperFunction = () => {
    // Helper logic
  };

  // 5. Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
};

ComponentName.propTypes = {
  prop1: PropTypes.string.isRequired,
  prop2: PropTypes.number
};

ComponentName.defaultProps = {
  prop2: 0
};

export default ComponentName;
```

#### 4. API Calls
```javascript
// Use async/await
const fetchData = async () => {
  try {
    const response = await fetch('/api/endpoint');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};
```

### Backend Standards

#### 1. Controller Structure
```javascript
const controllerName = {
  // GET method
  getItems: async (req, res) => {
    try {
      // Logic here
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  // POST method
  createItem: async (req, res) => {
    try {
      // Validation
      const { name, email } = req.body;
      if (!name || !email) {
        return res.status(400).json({
          success: false,
          message: 'Name and email are required'
        });
      }

      // Logic here
      res.status(201).json({
        success: true,
        data: result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
};
```

#### 2. Error Handling
```javascript
// Custom error class
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Error handling middleware
const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    res.status(err.statusCode).json({
      success: false,
      error: err,
      message: err.message,
      stack: err.stack
    });
  } else {
    res.status(err.statusCode).json({
      success: false,
      message: err.message
    });
  }
};
```

### Database Standards

#### 1. Model Structure
```javascript
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  }
}, {
  timestamps: true
});

// Indexes
userSchema.index({ email: 1 });

// Methods
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
```

## 🔄 Git Workflow

### 1. Branch Naming Convention

Use descriptive branch names:

```bash
# Feature branches
feature/user-authentication
feature/appointment-booking
feature/admin-dashboard

# Bug fix branches
fix/login-error
fix/appointment-validation

# Hotfix branches
hotfix/security-vulnerability
hotfix/critical-bug
```

### 2. Commit Message Format

Use conventional commit messages:

```bash
# Format: type(scope): description

# Examples:
feat(auth): add JWT authentication
fix(appointments): resolve booking validation error
docs(readme): update installation instructions
style(components): improve button styling
refactor(api): optimize database queries
test(auth): add login test cases
chore(deps): update dependencies
```

### 3. Development Workflow

```bash
# 1. Update your fork
git fetch upstream
git checkout main
git merge upstream/main

# 2. Create feature branch
git checkout -b feature/your-feature-name

# 3. Make changes and commit
git add .
git commit -m "feat(scope): description"

# 4. Push to your fork
git push origin feature/your-feature-name

# 5. Create pull request
# Go to GitHub and create a pull request
```

## 🧪 Testing

### Frontend Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

### Backend Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- --grep "auth"
```

### Manual Testing Checklist

- [ ] Test on different browsers (Chrome, Firefox, Safari, Edge)
- [ ] Test responsive design on mobile devices
- [ ] Test all user roles (patient, doctor, admin)
- [ ] Test error scenarios
- [ ] Test form validations
- [ ] Test API endpoints
- [ ] Test file uploads
- [ ] Test authentication flows

## 🔄 Pull Request Process

### 1. Before Submitting

- [ ] Ensure your code follows the coding standards
- [ ] Write or update tests for new functionality
- [ ] Update documentation if needed
- [ ] Test your changes thoroughly
- [ ] Ensure all tests pass

### 2. Pull Request Template

Use this template when creating a pull request:

```markdown
## Description
Brief description of the changes made.

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Testing
- [ ] My code follows the style guidelines of this project
- [ ] I have performed a self-review of my own code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing unit tests pass locally with my changes

## Screenshots (if applicable)
Add screenshots to help explain your changes.

## Checklist
- [ ] I have read the contributing guidelines
- [ ] My code follows the coding standards
- [ ] I have tested my changes
- [ ] I have updated the documentation
```

### 3. Review Process

1. **Automated Checks**: Ensure all CI/CD checks pass
2. **Code Review**: At least one maintainer must approve
3. **Testing**: Verify that the changes work as expected
4. **Documentation**: Ensure documentation is updated
5. **Merge**: Once approved, the PR will be merged

## 🐛 Bug Reports

### Bug Report Template

```markdown
## Bug Description
Clear and concise description of the bug.

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

## Expected Behavior
What you expected to happen.

## Actual Behavior
What actually happened.

## Environment
- OS: [e.g. Windows 10, macOS, Ubuntu]
- Browser: [e.g. Chrome, Firefox, Safari]
- Version: [e.g. 22]
- Node.js Version: [e.g. 18.0.0]

## Additional Context
Add any other context about the problem here.

## Screenshots
If applicable, add screenshots to help explain your problem.
```

## 💡 Feature Requests

### Feature Request Template

```markdown
## Feature Description
Clear and concise description of the feature.

## Problem Statement
What problem does this feature solve?

## Proposed Solution
Describe the solution you'd like to see.

## Alternative Solutions
Describe any alternative solutions you've considered.

## Additional Context
Add any other context or screenshots about the feature request.
```

## 📚 Documentation

### Documentation Standards

1. **Keep it simple**: Write clear, concise documentation
2. **Use examples**: Include code examples where appropriate
3. **Update regularly**: Keep documentation up to date with code changes
4. **Use proper formatting**: Use markdown formatting consistently
5. **Include screenshots**: Add screenshots for UI-related documentation

### Documentation Types

- **README.md**: Project overview and quick start
- **API_DOCUMENTATION.md**: API endpoint documentation
- **SETUP.md**: Detailed setup instructions
- **DEPLOYMENT.md**: Deployment guide
- **CONTRIBUTING.md**: This file
- **Code comments**: Inline code documentation

## 🏆 Recognition

### Contributors

We recognize contributors in several ways:

1. **Contributors list**: All contributors are listed in the README
2. **Commit history**: Your commits are preserved in the git history
3. **Release notes**: Contributors are mentioned in release notes
4. **Special thanks**: Significant contributors receive special recognition

### Getting Help

If you need help with contributing:

1. **Check existing issues**: Search for similar issues
2. **Read documentation**: Review the project documentation
3. **Ask questions**: Create an issue with the "question" label
4. **Join discussions**: Participate in project discussions

## 📞 Contact

- **Project Maintainer**: [Your Name](mailto:your.email@example.com)
- **GitHub Issues**: [Create an issue](https://github.com/your-username/mediconnect-mern-main/issues)
- **Discussions**: [Join discussions](https://github.com/your-username/mediconnect-mern-main/discussions)

---

**Thank you for contributing to MediConnect! 🚀** 