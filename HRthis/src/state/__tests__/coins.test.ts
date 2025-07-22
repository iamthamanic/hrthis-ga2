import { useCoinsStore, CoinRule, CoinsState } from '../coins';

// Mock data for testing
const mockTransaction = {
  id: 'test-1',
  userId: 'user-1',
  amount: 50,
  reason: 'Test grant',
  type: 'ADMIN_GRANT' as const,
  adminId: 'admin-1',
  createdAt: new Date().toISOString()
};

const mockRule = {
  title: 'Test Rule',
  description: 'Test rule description',
  coinAmount: 25,
  isActive: true
};

describe('CoinsStore', () => {
  let store: CoinsState;

  beforeEach(() => {
    store = useCoinsStore.getState();
    // Reset store state
    useCoinsStore.setState({
      transactions: [],
      rules: [],
      balances: [],
      isLoading: false
    });
  });

  describe('grantCoins', () => {
    it('should add transaction and update balance', async () => {
      const currentStore = useCoinsStore.getState();
      const initialTransactionCount = currentStore.transactions.length;
      
      await store.grantCoins('user-1', 50, 'Test grant', 'admin-1');
      
      const updatedStore = useCoinsStore.getState();
      expect(updatedStore.transactions.length).toBe(initialTransactionCount + 1);
      expect(updatedStore.isLoading).toBe(false);
      
      const newTransaction = updatedStore.transactions[0];
      expect(newTransaction.userId).toBe('user-1');
      expect(newTransaction.amount).toBe(50);
      expect(newTransaction.reason).toBe('Test grant');
      expect(newTransaction.type).toBe('ADMIN_GRANT');
    });

    it('should handle errors gracefully', async () => {
      // Test error handling by mocking a failure
      const originalSetTimeout = global.setTimeout;
      global.setTimeout = jest.fn((cb: TimerHandler, delay?: number) => {
        if (delay === 500) {
          throw new Error('Test error');
        }
        return originalSetTimeout(cb as () => void, delay);
      }) as unknown as typeof setTimeout;

      const testStore = useCoinsStore.getState();
      await expect(testStore.grantCoins('user-1', 50, 'Test grant', 'admin-1')).rejects.toThrow();
      
      global.setTimeout = originalSetTimeout;
    });
  });

  describe('getUserBalance', () => {
    it('should calculate correct balance for user', () => {
      // Add test transactions
      useCoinsStore.setState({
        transactions: [
          { ...mockTransaction, amount: 100 },
          { ...mockTransaction, id: 'test-2', amount: -30 },
          { ...mockTransaction, id: 'test-3', amount: 50 }
        ]
      });

      const currentStore = useCoinsStore.getState();
      const balance = currentStore.getUserBalance('user-1');
      
      expect(balance.userId).toBe('user-1');
      expect(balance.totalEarned).toBe(150); // 100 + 50
      expect(balance.totalSpent).toBe(30);   // 30
      expect(balance.currentBalance).toBe(120); // 150 - 30
    });

    it('should return zero balance for user with no transactions', () => {
      const currentStore = useCoinsStore.getState();
      const balance = currentStore.getUserBalance('unknown-user');
      
      expect(balance.totalEarned).toBe(0);
      expect(balance.totalSpent).toBe(0);
      expect(balance.currentBalance).toBe(0);
    });
  });

  describe('getUserTransactions', () => {
    it('should return filtered and sorted transactions', () => {
      const now = new Date();
      const earlier = new Date(now.getTime() - 1000);
      
      useCoinsStore.setState({
        transactions: [
          { ...mockTransaction, userId: 'user-1', createdAt: earlier.toISOString() },
          { ...mockTransaction, id: 'test-2', userId: 'user-2', createdAt: now.toISOString() },
          { ...mockTransaction, id: 'test-3', userId: 'user-1', createdAt: now.toISOString() }
        ]
      });

      const currentStore = useCoinsStore.getState();
      const userTransactions = currentStore.getUserTransactions('user-1');
      
      expect(userTransactions).toHaveLength(2);
      expect(userTransactions[0].id).toBe('test-3'); // Most recent first
      expect(userTransactions[1].id).toBe('test-1');
    });
  });

  describe('coin rules management', () => {
    it('should add new coin rule', async () => {
      const currentStore = useCoinsStore.getState();
      const initialRulesCount = currentStore.rules.length;
      
      await currentStore.addCoinRule(mockRule);
      
      const updatedStore = useCoinsStore.getState();
      expect(updatedStore.rules.length).toBe(initialRulesCount + 1);
      
      const newRule = updatedStore.rules[0];
      expect(newRule.title).toBe(mockRule.title);
      expect(newRule.isActive).toBe(true);
      expect(newRule.id).toBeDefined();
      expect(newRule.createdAt).toBeDefined();
    });

    it('should update existing rule', async () => {
      // Add a rule first
      const currentStore = useCoinsStore.getState();
      await currentStore.addCoinRule(mockRule);
      const rule = useCoinsStore.getState().rules[0];
      
      await currentStore.updateCoinRule(rule.id, { title: 'Updated Title', coinAmount: 100 });
      
      const updatedStore = useCoinsStore.getState();
      const updatedRule = updatedStore.rules.find(r => r.id === rule.id);
      
      expect(updatedRule?.title).toBe('Updated Title');
      expect(updatedRule?.coinAmount).toBe(100);
      expect(updatedRule?.description).toBe(mockRule.description); // Unchanged
    });

    it('should delete rule', async () => {
      // Add a rule first
      const currentStore = useCoinsStore.getState();
      await currentStore.addCoinRule(mockRule);
      const rule = useCoinsStore.getState().rules[0];
      const initialCount = useCoinsStore.getState().rules.length;
      
      await currentStore.deleteCoinRule(rule.id);
      
      const updatedStore = useCoinsStore.getState();
      expect(updatedStore.rules.length).toBe(initialCount - 1);
      expect(updatedStore.rules.find(r => r.id === rule.id)).toBeUndefined();
    });

    it('should return only active rules', () => {
      useCoinsStore.setState({
        rules: [
          { ...mockRule, id: '1', isActive: true, createdAt: '2024-01-01T00:00:00Z' },
          { ...mockRule, id: '2', isActive: false, createdAt: '2024-01-02T00:00:00Z' },
          { ...mockRule, id: '3', isActive: true, createdAt: '2024-01-03T00:00:00Z' }
        ]
      });

      const currentStore = useCoinsStore.getState();
      const activeRules = currentStore.getCoinRules();
      
      expect(activeRules).toHaveLength(2);
      expect(activeRules.every((rule: CoinRule) => rule.isActive)).toBe(true);
      expect(activeRules[0].id).toBe('3'); // Most recent first
    });
  });

  describe('updateUserBalance', () => {
    it('should update balance in balances array', () => {
      useCoinsStore.setState({
        transactions: [{ ...mockTransaction, amount: 75 }],
        balances: []
      });

      const currentStore = useCoinsStore.getState();
      currentStore.updateUserBalance('user-1');
      
      const updatedStore = useCoinsStore.getState();
      expect(updatedStore.balances).toHaveLength(1);
      expect(updatedStore.balances[0].userId).toBe('user-1');
      expect(updatedStore.balances[0].currentBalance).toBe(75);
    });

    it('should replace existing balance for user', () => {
      useCoinsStore.setState({
        transactions: [{ ...mockTransaction, amount: 100 }],
        balances: [
          { userId: 'user-1', totalEarned: 50, totalSpent: 0, currentBalance: 50, lastUpdated: '2024-01-01T00:00:00Z' }
        ]
      });

      const currentStore = useCoinsStore.getState();
      currentStore.updateUserBalance('user-1');
      
      const updatedStore = useCoinsStore.getState();
      expect(updatedStore.balances).toHaveLength(1);
      expect(updatedStore.balances[0].currentBalance).toBe(100);
    });
  });
});