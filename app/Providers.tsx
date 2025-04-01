'use client';

import '@rainbow-me/rainbowkit/styles.css';

import {
  darkTheme,
  getDefaultConfig,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { arbitrum, base, mainnet, optimism, polygon } from 'wagmi/chains';
import {
  JustaNameProvider,
  JustaNameProviderConfig,
} from '@justaname.id/react';

const queryClient = new QueryClient();

const config = getDefaultConfig({
  appName: 'Donation',
  projectId: 'YOUR_PROJECT_ID',
  chains: [mainnet, polygon, optimism, arbitrum, base],
  ssr: true, // If your dApp uses server side rendering (SSR)
});

const justaNameConfig: JustaNameProviderConfig = {
  networks: [{ chainId: 1, providerUrl: mainnet.rpcUrls.default.http[0] }],
};

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={darkTheme()}>
          <JustaNameProvider config={justaNameConfig}>
            {children}
          </JustaNameProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default Providers;
