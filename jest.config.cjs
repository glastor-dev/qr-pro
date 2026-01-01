module.exports = {
  setupFilesAfterEnv: ['./jest.setup.cjs'],
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    // Ignora los imports de CSS y otros assets no JS
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(png|jpg|jpeg|gif|svg)$': '<rootDir>/__mocks__/fileMock.js'
  },
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest'
  }
};
