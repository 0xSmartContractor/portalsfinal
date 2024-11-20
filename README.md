# Portal - Restaurant Management System

Portal is a comprehensive restaurant management system designed to streamline operations, improve staff communication, and enhance customer service.

## Features

### 1. Employee Scheduling
- AI-powered schedule generation based on availability
- Shift trading system
- Time-off request management
- Weekly availability settings
- Schedule conflicts detection

### 2. Team Communication
- Real-time chat with individual and group messaging
- Image and meme sharing
- Message reactions and read receipts
- Shift-related announcements
- Important notifications system

### 3. Tip Management
- Individual tip tracking
- Daily, weekly, and monthly reports
- Tip analytics and insights
- Manager oversight and reporting
- Historical data analysis

### 4. Floor Plan Management
- Interactive table layout editor
- Real-time table status tracking
- Wait time predictions
- Section management
- Server assignments

### 5. Wait List & Reservations
- Digital wait list management
- SMS notifications for waiting customers
- Table assignments
- Reservation management
- Historical wait time data

### 6. Role-Based Access
- Manager dashboard
- Employee portal
- Admin controls
- Custom permissions
- Audit logging

## Getting Started

### Prerequisites
- Node.js 16.x or higher
- PostgreSQL 13.x or higher
- Twilio account (for SMS notifications)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/portal.git
cd portal
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```
Edit `.env` with your credentials.

4. Set up the database:
```bash
npx prisma db push
```

5. Run the development server:
```bash
npm run dev
```

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run specific test suite
npm test -- scheduling
npm test -- chat
npm test -- tips

# Run tests with coverage
npm test -- --coverage
```

### Test Accounts

Use these accounts for testing different roles:

```
Manager:
Email: manager@portal.test
Password: test123

Employee:
Email: employee@portal.test
Password: test123
```

### Testing Features

#### 1. Schedule Generation
1. Log in as manager
2. Go to Schedule > Generate
3. Select date range
4. Click "Generate Schedule"
5. Verify employee availability conflicts

#### 2. Shift Trading
1. Log in as employee
2. Navigate to My Shifts
3. Select a shift to trade
4. Submit trade request
5. Log in as another employee to accept

#### 3. Chat System
1. Open two browsers
2. Log in with different accounts
3. Start a conversation
4. Test image uploads
5. Verify real-time updates

#### 4. Floor Plan
1. Log in as manager
2. Go to Floor Plan
3. Add/edit tables
4. Test table status changes
5. Verify wait time calculations

#### 5. Wait List
1. Add new party
2. Update wait times
3. Test SMS notifications
4. Seat customers
5. Verify historical data

## API Documentation

### Authentication
```typescript
POST /api/auth/signin
POST /api/auth/signup
POST /api/auth/signout
```

### Scheduling
```typescript
GET /api/schedule
POST /api/schedule/generate
PUT /api/schedule/shift/:id
DELETE /api/schedule/shift/:id
```

### Chat
```typescript
GET /api/chat
POST /api/chat/message
POST /api/chat/image
PUT /api/chat/read/:id
```

### Tips
```typescript
GET /api/tips
POST /api/tips
GET /api/tips/stats
GET /api/tips/reports
```

### Floor Plan
```typescript
GET /api/floor-plan
POST /api/floor-plan/tables
PUT /api/floor-plan/tables/:id
POST /api/floor-plan/sections
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.