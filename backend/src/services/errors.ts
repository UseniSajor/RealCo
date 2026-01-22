/**
 * Custom error classes for RealCo platform
 * 
 * These errors are caught by the centralized error handler
 * and converted to appropriate HTTP responses.
 */

// =============================================================================
// BASE ERRORS
// =============================================================================

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

// =============================================================================
// VALIDATION ERRORS (400)
// =============================================================================

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400);
  }
}

export class InvalidInputError extends AppError {
  constructor(message: string) {
    super(message, 400);
  }
}

// =============================================================================
// AUTHENTICATION ERRORS (401)
// =============================================================================

export class UnauthorizedError extends AppError {
  constructor(message = 'Authentication required') {
    super(message, 401);
  }
}

export class InvalidTokenError extends AppError {
  constructor(message = 'Invalid or expired token') {
    super(message, 401);
  }
}

// =============================================================================
// AUTHORIZATION ERRORS (403)
// =============================================================================

export class ForbiddenError extends AppError {
  constructor(message = 'Insufficient permissions') {
    super(message, 403);
  }
}

// =============================================================================
// NOT FOUND ERRORS (404)
// =============================================================================

export class NotFoundError extends AppError {
  constructor(entity: string, id?: string) {
    const message = id ? `${entity} not found: ${id}` : `${entity} not found`;
    super(message, 404);
  }
}

export class ProjectNotFoundError extends NotFoundError {
  constructor(id: string) {
    super('Project', id);
  }
}

export class TransactionNotFoundError extends NotFoundError {
  constructor(id: string) {
    super('Transaction', id);
  }
}

export class EscrowAccountNotFoundError extends NotFoundError {
  constructor(id: string) {
    super('Escrow Account', id);
  }
}

export class DistributionNotFoundError extends NotFoundError {
  constructor(id: string) {
    super('Distribution', id);
  }
}

// =============================================================================
// CONFLICT ERRORS (409)
// =============================================================================

export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 409);
  }
}

export class DuplicateResourceError extends ConflictError {
  constructor(resource: string, field: string, value: string) {
    super(`${resource} with ${field} "${value}" already exists`);
  }
}

export class OptimisticLockError extends ConflictError {
  constructor(message = 'Resource was modified by another request. Please retry.') {
    super(message);
  }
}

// =============================================================================
// BUSINESS LOGIC ERRORS (422)
// =============================================================================

export class BusinessRuleError extends AppError {
  constructor(message: string) {
    super(message, 422);
  }
}

export class InsufficientFundsError extends BusinessRuleError {
  constructor(message = 'Insufficient funds for this operation') {
    super(message);
  }
}

export class InvalidStateTransitionError extends BusinessRuleError {
  constructor(from: string, to: string) {
    super(`Cannot transition from ${from} to ${to}`);
  }
}

export class TransactionLimitExceededError extends BusinessRuleError {
  constructor(limitType: string, limit: number, attempted: number) {
    super(`${limitType} limit of $${limit.toLocaleString()} exceeded. Attempted: $${attempted.toLocaleString()}`);
  }
}

// =============================================================================
// COMPLIANCE ERRORS (403)
// =============================================================================

export class ComplianceError extends AppError {
  public readonly checkType: string;
  public readonly details?: any;

  constructor(message: string, checkType: string, details?: any) {
    super(message, 403);
    this.checkType = checkType;
    this.details = details;
  }
}

export class OFACScreeningError extends ComplianceError {
  constructor(details?: any) {
    super('Transaction blocked by OFAC screening', 'OFAC', details);
  }
}

export class KYCRequiredError extends ComplianceError {
  constructor(message = 'KYC verification required') {
    super(message, 'KYC');
  }
}

export class AMLCheckError extends ComplianceError {
  constructor(message: string, details?: any) {
    super(message, 'AML', details);
  }
}

// =============================================================================
// PAYMENT PROCESSING ERRORS (402, 500)
// =============================================================================

export class PaymentError extends AppError {
  public readonly code?: string;
  public readonly declineCode?: string;

  constructor(message: string, code?: string, declineCode?: string, statusCode: number = 402) {
    super(message, statusCode);
    this.code = code;
    this.declineCode = declineCode;
  }
}

export class PaymentProcessingError extends PaymentError {
  constructor(message: string, code?: string) {
    super(message, code, undefined, 402);
  }
}

export class CardDeclinedError extends PaymentError {
  constructor(declineCode: string, message?: string) {
    super(
      message || `Card declined: ${declineCode}`,
      'card_declined',
      declineCode,
      402
    );
  }
}

export class InsufficientFundsPaymentError extends PaymentError {
  constructor() {
    super('Insufficient funds in account', 'insufficient_funds', undefined, 402);
  }
}

// =============================================================================
// EXTERNAL SERVICE ERRORS (502, 503)
// =============================================================================

export class ExternalServiceError extends AppError {
  public readonly service: string;
  public readonly originalError?: Error;

  constructor(service: string, message: string, originalError?: Error) {
    super(`${service} error: ${message}`, 502);
    this.service = service;
    this.originalError = originalError;
  }
}

export class StripeError extends ExternalServiceError {
  constructor(message: string, originalError?: Error) {
    super('Stripe', message, originalError);
  }
}

export class PlaidError extends ExternalServiceError {
  constructor(message: string, originalError?: Error) {
    super('Plaid', message, originalError);
  }
}

// =============================================================================
// RATE LIMITING (429)
// =============================================================================

export class RateLimitError extends AppError {
  public readonly retryAfter?: number;

  constructor(retryAfter?: number) {
    super('Rate limit exceeded. Please try again later.', 429);
    this.retryAfter = retryAfter;
  }
}

// =============================================================================
// INTERNAL ERRORS (500)
// =============================================================================

export class InternalServerError extends AppError {
  constructor(message = 'An unexpected error occurred') {
    super(message, 500, false);
  }
}

export class DatabaseError extends InternalServerError {
  constructor(message: string, public readonly originalError?: Error) {
    super(`Database error: ${message}`);
    this.originalError = originalError;
  }
}

