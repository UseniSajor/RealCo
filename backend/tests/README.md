# RealCo Backend Tests

Comprehensive unit test suite for the RealCo backend services.

## 📁 Test Structure

```
tests/
├── setup.ts                              # Test utilities and mocks
├── services/                             # Service unit tests
│   ├── project.service.test.ts          # ProjectService tests
│   ├── task.service.test.ts             # TaskService tests (dependency validation, critical path)
│   ├── daily-log.service.test.ts        # DailyLogService tests
│   ├── bank-account.service.test.ts     # BankAccountService tests
│   └── transaction.service.test.ts      # TransactionService tests (state machine)
├── health.test.ts                        # Health check tests
└── transaction.test.ts                   # Transaction integration tests
```

## 🚀 Running Tests

### Run all tests
```bash
npm test
```

### Run tests in watch mode
```bash
npm test -- --watch
```

### Run with coverage
```bash
npm test -- --coverage
```

### Run specific test file
```bash
npm test -- tests/services/project.service.test.ts
```

### Run tests matching pattern
```bash
npm test -- --grep "ProjectService"
```

## 📊 Coverage Requirements

The test suite maintains >80% code coverage:

- **Lines:** 80%
- **Functions:** 80%
- **Branches:** 75%
- **Statements:** 80%

Coverage reports are generated in `coverage/` directory.

## 🧪 Test Types

### Unit Tests (Service Layer)

Located in `tests/services/`, these tests focus on individual service methods with mocked dependencies:

- **ProjectService** - Project lifecycle management
  - Project creation with validation
  - Progress tracking
  - Schedule variance calculation
  - Project metrics
  - Soft delete (archiving)

- **TaskService** - Task management with dependencies
  - Task CRUD operations
  - Circular dependency detection
  - Critical path calculation (CPM algorithm)
  - Progress rollup to parent tasks and project
  - Task hierarchy building

- **DailyLogService** - Progress tracking
  - Daily log creation
  - Photo upload with S3 integration
  - Weather and labor tracking
  - Work completed updates

- **BankAccountService** - Bank account management
  - Plaid integration
  - Manual account addition
  - Micro-deposit verification
  - Account encryption and security
  - Default account management

- **TransactionService** - Transaction processing
  - Transaction state machine
  - ACH payment processing
  - Compliance checks
  - Retry logic with exponential backoff
  - Refund handling (full and partial)
  - Idempotency

### Integration Tests

Located in root `tests/` directory, these test database interactions:

- **transaction.test.ts** - End-to-end transaction flows with real database

## 🎯 What's Tested

### ProjectService
- ✅ Project creation with unique code generation (RC-YYYY-NNN)
- ✅ Date validation (end > start)
- ✅ Schedule variance calculation
- ✅ Project metrics (budget, schedule, progress, tasks)
- ✅ Soft delete (archive)
- ✅ Error handling (not found, validation errors)

### TaskService
- ✅ Task creation with validation
- ✅ Circular dependency detection (DFS algorithm)
- ✅ Critical path calculation (CPM forward/backward pass)
- ✅ Progress updates with rollup to parents
- ✅ Task hierarchy building
- ✅ Dependency validation
- ✅ Parent task existence validation
- ✅ Date range validation

### DailyLogService
- ✅ Daily log creation with optional fields
- ✅ Photo upload to S3
- ✅ Image validation
- ✅ Date range filtering
- ✅ Weather tracking
- ✅ Labor count validation
- ✅ Work completed updates

### BankAccountService
- ✅ Plaid account addition
- ✅ Manual account addition
- ✅ Account number encryption
- ✅ Routing number hashing
- ✅ Micro-deposit verification
- ✅ Verification attempt tracking
- ✅ Default account management
- ✅ Account soft delete
- ✅ Security (no full account number exposure)

### TransactionService
- ✅ Transaction initiation with validation
- ✅ Fee calculation
- ✅ Compliance checks (OFAC, limits)
- ✅ Bank account verification check
- ✅ State machine transitions (INITIATED → PROCESSING → COMPLETED)
- ✅ Invalid state transition prevention
- ✅ Retry logic with exponential backoff
- ✅ Max retry attempts
- ✅ Transaction cancellation
- ✅ Refunds (full and partial)
- ✅ Idempotency key generation
- ✅ Filtering and pagination

## 🛠️ Test Utilities

### Mock Factories

`createMockPrisma()` - Creates a mock PrismaClient with vi.fn() for all methods

### Test Data

`testData` object contains realistic sample data:
- `testData.project` - Sample project
- `testData.task` - Sample task
- `testData.dailyLog` - Sample daily log
- `testData.transaction` - Sample transaction
- `testData.bankAccount` - Sample bank account

### Helper Functions

- `expectError(fn, ErrorType)` - Assert specific error is thrown
- `createDateRange(daysAgo, daysFromNow)` - Generate date ranges

## 📝 Writing New Tests

### Template for Service Tests

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { YourService } from '../../src/services/your.service.js';
import { createMockPrisma, testData } from '../setup.js';

describe('YourService', () => {
  let yourService: YourService;
  let mockPrisma: PrismaClient;

  beforeEach(() => {
    mockPrisma = createMockPrisma();
    yourService = new YourService(mockPrisma);
    vi.clearAllMocks();
  });

  describe('yourMethod', () => {
    it('should do something', async () => {
      // Arrange
      vi.mocked(mockPrisma.model.findUnique).mockResolvedValue(testData.model);

      // Act
      const result = await yourService.yourMethod(testData.model.id);

      // Assert
      expect(result).toBeDefined();
      expect(mockPrisma.model.findUnique).toHaveBeenCalled();
    });
  });
});
```

### Best Practices

1. **Mock External Dependencies**
   - Use `vi.mock()` for services (S3, Plaid, Stripe, etc.)
   - Mock PrismaClient for database calls
   - Mock event emitters

2. **Test Edge Cases**
   - Invalid inputs
   - Missing data (null/undefined)
   - Empty arrays/objects
   - Boundary conditions (0, -1, max values)

3. **Descriptive Test Names**
   - Use "should..." format
   - Be specific about what's being tested
   - Include context ("when...", "if...")

4. **Arrange-Act-Assert Pattern**
   - Arrange: Set up mocks and test data
   - Act: Call the method being tested
   - Assert: Verify expected behavior

5. **Test One Thing**
   - Each test should verify one behavior
   - Keep tests focused and simple
   - Use multiple tests for multiple scenarios

6. **Clean Up**
   - Use `beforeEach` to reset mocks
   - Clear all mocks with `vi.clearAllMocks()`
   - Avoid test pollution

## 🐛 Debugging Tests

### Run single test
```bash
npm test -- -t "should create a project successfully"
```

### Debug mode
```bash
node --inspect-brk ./node_modules/vitest/vitest.mjs run
```

### Verbose output
```bash
npm test -- --reporter=verbose
```

### View coverage details
```bash
npm test -- --coverage
# Open coverage/index.html in browser
```

## ✅ Coverage Report

Current coverage status:

| Category | Coverage | Target |
|----------|----------|--------|
| Lines | >80% | 80% |
| Functions | >80% | 80% |
| Branches | >75% | 75% |
| Statements | >80% | 80% |

**Total Test Count:** 100+ tests

**Services Tested:**
- ✅ ProjectService (15+ tests)
- ✅ TaskService (20+ tests)  
- ✅ DailyLogService (12+ tests)
- ✅ BankAccountService (15+ tests)
- ✅ TransactionService (25+ tests)

## 🎯 Next Steps

To continue improving test coverage:

1. Add integration tests for API routes
2. Add E2E tests for critical user flows
3. Add performance tests for critical path algorithm
4. Add load tests for transaction processing
5. Add security tests for authentication/authorization

## 📚 Resources

- [Vitest Documentation](https://vitest.dev/)
- [Testing Best Practices](https://testingjavascript.com/)
- [Prisma Testing Guide](https://www.prisma.io/docs/guides/testing)

---

*Last Updated: January 22, 2026*
*Test Framework: Vitest*
*Coverage: >80%*
