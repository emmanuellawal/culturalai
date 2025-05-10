import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/services/authContext';
import RootNavigator from './src/navigation/RootNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <RootNavigator />
      </AuthProvider>
    </SafeAreaProvider>
  );
} 