import { ThemeProvider } from './components/theme/ThemeProvider';
import { ButtonPlayground } from './components/playground/ButtonPlayground';

export function App() {
  return (
    <ThemeProvider defaultMode="dark">
      <ButtonPlayground />
    </ThemeProvider>
  );
}
