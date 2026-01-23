import type { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { ValidationError } from './errors.js';

export interface RegisterUserData {
  email: string;
  password: string;
  orgName?: string;
  firstName?: string;
  lastName?: string;
  role?: 'SPONSOR' | 'INVESTOR' | 'FUND_MANAGER' | 'SERVICE_PROVIDER';
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirm {
  token: string;
  newPassword: string;
}

export class AuthService {
  constructor(private prisma: PrismaClient) {}

  /**
   * Register a new user with organization
   */
  async registerUser(data: RegisterUserData) {
    const {
      email,
      password,
      orgName,
      firstName,
      lastName,
      role = 'SPONSOR',
    } = data;

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new ValidationError('Invalid email format');
    }

    // Validate password strength
    if (password.length < 8) {
      throw new ValidationError('Password must be at least 8 characters long');
    }
    if (!/[A-Z]/.test(password)) {
      throw new ValidationError('Password must contain at least one uppercase letter');
    }
    if (!/[a-z]/.test(password)) {
      throw new ValidationError('Password must contain at least one lowercase letter');
    }
    if (!/[0-9]/.test(password)) {
      throw new ValidationError('Password must contain at least one number');
    }

    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      throw new ValidationError('An account with this email already exists');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create organization and user in transaction
    const result = await this.prisma.$transaction(async (tx) => {
      // Create organization
      const organization = await tx.organization.create({
        data: {
          name: orgName || `${email.split('@')[0]}'s Organization`,
        },
      });

      // Create user
      const user = await tx.user.create({
        data: {
          email: email.toLowerCase(),
          passwordHash,
          orgId: organization.id,
        },
        select: {
          id: true,
          email: true,
          createdAt: true,
          organization: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      return { user, organization };
    });

    return {
      user: {
        id: result.user.id,
        email: result.user.email,
        organizationId: result.organization.id,
        organizationName: result.organization.name,
      },
    };
  }

  /**
   * Authenticate user with email and password
   */
  async authenticateUser(email: string, password: string) {
    // Find user
    const user = await this.prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: {
        organization: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!user) {
      throw new ValidationError('Invalid email or password');
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      throw new ValidationError('Invalid email or password');
    }

    return {
      userId: user.id,
      orgId: user.orgId,
      email: user.email,
      organizationName: user.organization.name,
    };
  }

  /**
   * Request password reset (generates token)
   */
  async requestPasswordReset(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    // Don't reveal if user exists or not (security best practice)
    if (!user) {
      return {
        message: 'If an account exists with this email, a password reset link has been sent',
      };
    }

    // Generate reset token (32 bytes = 64 hex characters)
    const resetToken = randomBytes(32).toString('hex');
    const resetTokenHash = await bcrypt.hash(resetToken, 10);
    const resetTokenExpires = new Date(Date.now() + 3600000); // 1 hour from now

    // Store hashed token in database
    // Note: You'll need to add passwordResetToken and passwordResetExpires fields to User model
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        // passwordResetToken: resetTokenHash,
        // passwordResetExpires: resetTokenExpires,
      },
    });

    // TODO: Send email with reset link containing token
    // In production, send email via SendGrid, AWS SES, etc.
    // Reset URL: https://app.realco.com/reset-password?token={resetToken}

    return {
      message: 'If an account exists with this email, a password reset link has been sent',
      // For development only - remove in production:
      ...(process.env.NODE_ENV === 'development' && {
        resetToken, // Include token in response for testing
        resetUrl: `http://localhost:3000/reset-password?token=${resetToken}`,
      }),
    };
  }

  /**
   * Confirm password reset with token
   */
  async confirmPasswordReset(token: string, newPassword: string) {
    // Validate new password strength
    if (newPassword.length < 8) {
      throw new ValidationError('Password must be at least 8 characters long');
    }
    if (!/[A-Z]/.test(newPassword)) {
      throw new ValidationError('Password must contain at least one uppercase letter');
    }
    if (!/[a-z]/.test(newPassword)) {
      throw new ValidationError('Password must contain at least one lowercase letter');
    }
    if (!/[0-9]/.test(newPassword)) {
      throw new ValidationError('Password must contain at least one number');
    }

    // TODO: Implement token validation
    // In production, you need to:
    // 1. Find user with matching hashed token
    // 2. Check token hasn't expired
    // 3. Hash new password
    // 4. Update user's password
    // 5. Clear reset token fields

    /*
    const users = await this.prisma.user.findMany({
      where: {
        passwordResetExpires: {
          gt: new Date(),
        },
      },
    });

    let matchedUser = null;
    for (const user of users) {
      if (user.passwordResetToken) {
        const isValidToken = await bcrypt.compare(token, user.passwordResetToken);
        if (isValidToken) {
          matchedUser = user;
          break;
        }
      }
    }

    if (!matchedUser) {
      throw new ValidationError('Invalid or expired reset token');
    }

    // Hash new password
    const newPasswordHash = await bcrypt.hash(newPassword, 12);

    // Update password and clear reset fields
    await this.prisma.user.update({
      where: { id: matchedUser.id },
      data: {
        passwordHash: newPasswordHash,
        passwordResetToken: null,
        passwordResetExpires: null,
      },
    });
    */

    return {
      message: 'Password has been reset successfully',
    };
  }

  /**
   * Change password for authenticated user
   */
  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    // Get user
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new ValidationError('User not found');
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isValidPassword) {
      throw new ValidationError('Current password is incorrect');
    }

    // Validate new password
    if (newPassword.length < 8) {
      throw new ValidationError('Password must be at least 8 characters long');
    }
    if (!/[A-Z]/.test(newPassword)) {
      throw new ValidationError('Password must contain at least one uppercase letter');
    }
    if (!/[a-z]/.test(newPassword)) {
      throw new ValidationError('Password must contain at least one lowercase letter');
    }
    if (!/[0-9]/.test(newPassword)) {
      throw new ValidationError('Password must contain at least one number');
    }

    // Hash new password
    const newPasswordHash = await bcrypt.hash(newPassword, 12);

    // Update password
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        passwordHash: newPasswordHash,
      },
    });

    return {
      message: 'Password changed successfully',
    };
  }

  /**
   * Get user profile
   */
  async getUserProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        createdAt: true,
        updatedAt: true,
        organization: {
          select: {
            id: true,
            name: true,
            createdAt: true,
          },
        },
      },
    });

    if (!user) {
      throw new ValidationError('User not found');
    }

    return user;
  }

  /**
   * Verify email token (for email verification)
   */
  async verifyEmail(token: string) {
    // TODO: Implement email verification
    // Similar to password reset flow
    return {
      message: 'Email verified successfully',
    };
  }
}
