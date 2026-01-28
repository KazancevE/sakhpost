import { MantineProvider } from '@mantine/core';

export function MantineProviderWrapper({ children }: { children: React.ReactNode }) {
  return (
    <MantineProvider 
      defaultColorScheme="light"
      withGlobalClasses
      theme={{ 
        fontFamily: 'Inter, sans-serif',
        primaryColor: 'blue',
      }}
    >
      {children}
    </MantineProvider>
  );
}
