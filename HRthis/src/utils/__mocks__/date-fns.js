module.exports = {
  format: jest.fn((date, formatStr) => {
    // Simple mock implementation
    if (formatStr === 'dd.MM.yyyy') {
      return '01.01.2024';
    }
    if (formatStr === 'HH:mm') {
      return '09:00';
    }
    if (formatStr === "yyyyMMdd'T'HHmmss") {
      return '20240101T090000';
    }
    return '2024-01-01';
  })
};