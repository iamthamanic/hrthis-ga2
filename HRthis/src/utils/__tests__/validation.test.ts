import { UserSchema, TeamSchema } from '../validation';

describe('Validation schemas', () => {
  describe('UserSchema', () => {
    it('should validate valid user data', () => {
      const validUser = {
        id: 'user-1',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'EMPLOYEE' as const
      };

      expect(() => UserSchema.parse(validUser)).not.toThrow();
    });

    it('should reject invalid user data', () => {
      const invalidUser = {
        id: 'user-1',
        name: '',
        email: 'invalid-email',
        role: 'INVALID_ROLE'
      };

      expect(() => UserSchema.parse(invalidUser)).toThrow();
    });

    it('should validate optional fields', () => {
      const userWithOptionals = {
        id: 'user-1',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'ADMIN' as const,
        position: 'Developer',
        weeklyHours: 40,
        vacationDays: 25
      };

      expect(() => UserSchema.parse(userWithOptionals)).not.toThrow();
    });
  });

  describe('TeamSchema', () => {
    it('should validate valid team data', () => {
      const validTeam = {
        id: 'team-1',
        name: 'Development Team',
        organizationId: 'org-1',
        leadIds: ['user-1'],
        memberIds: ['user-1', 'user-2'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      expect(() => TeamSchema.parse(validTeam)).not.toThrow();
    });

    it('should reject team with empty name', () => {
      const invalidTeam = {
        id: 'team-1',
        name: '',
        organizationId: 'org-1',
        leadIds: [],
        memberIds: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      expect(() => TeamSchema.parse(invalidTeam)).toThrow();
    });
  });
});