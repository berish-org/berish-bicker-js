import { renderNode, createNode, createContext, useContext, useState, useEffect } from './';

export interface Profile {
  name: string;
  age: number;
  likes: number;
}

const ThemeContext = createContext<Profile>({
  name: 'Unknown',
  age: -1,
  likes: 0,
});

export function TextComponent0() {
  const value = useContext(ThemeContext);
  console.log(`TextComponent0`, value);
}

export function Layer() {
  const context = useContext(ThemeContext);
  return createNode(ThemeContext.Provider, {
    value: { ...context, likes: context.likes * 2 },
    children: createNode(TextComponent0, {}),
  });
}

export function App() {
  const [profile, setProfile] = useState<Profile>({
    name: 'Ravil',
    age: 25,
    likes: 0,
  });

  useEffect(() => {
    const timer = setInterval(() => setProfile((profile) => ({ ...profile, likes: profile.likes + 1 })), 2000);
    return () => {
      clearInterval(timer);
    };
  }, []);

  return createNode(ThemeContext.Provider, {
    value: profile,
    children: createNode(Layer, {}),
  });
}

export function start() {
  const node = createNode(App, { title: 'Ravil' });
  const unmount = renderNode(node);
}

start();
