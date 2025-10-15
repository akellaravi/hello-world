import React from 'react';
import { render } from '@testing-library/react-native';
import App from '../App';

jest.mock('expo-status-bar', () => ({ StatusBar: () => null }));
jest.mock('@/screens/HomeScreen', () => () => null);

describe('App', () => {
  it('renders without crashing', () => {
    const { toJSON } = render(<App />);
    expect(toJSON()).toMatchSnapshot();
  });
});
