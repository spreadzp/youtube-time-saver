

// Particle imports

import {
    AuthCoreContextProvider,
    PromptSettingType,
} from "@particle-network/authkit";
import { AuthType } from '@particle-network/auth-core';
import { bscTestnet } from '@particle-network/authkit/chains';
import { EntryPosition } from "@particle-network/wallet";

export const ParticleAuthkit = ({ children }: React.PropsWithChildren) => {
    // const bscTestnet: any = {
    //     id: 97,
    //     name: 'Binance Smart Chain Testnet',
    //     nativeCurrency: {
    //         decimals: 18,
    //         name: 'BNB',
    //         symbol: 'tBNB',
    //     },
    //     rpcUrls: {
    //         default: { http: ['https://data-seed-prebsc-1-s1.bnbchain.org:8545'] },
    //     },
    //     blockExplorers: {
    //         default: {
    //             name: 'BscScan',
    //             url: 'https://testnet.bscscan.com',
    //             apiUrl: 'https://testnet.bscscan.com/api',
    //         },
    //     },
    //     contracts: {
    //         multicall3: {
    //             address: '0xca11bde05977b3631167028862be2a173976ca11',
    //             blockCreated: 17422483,
    //         },
    //     },
    //     testnet: true,
    // }
    return (
        <AuthCoreContextProvider
            options={{
                projectId: import.meta.env.VITE_PUBLIC_PROJECT_ID!,
                clientKey: import.meta.env.VITE_PUBLIC_CLIENT_KEY!,
                appId: import.meta.env.VITE_PUBLIC_APP_ID!,
                authTypes: [
                    AuthType.email,
                    AuthType.google,
                    AuthType.twitter,
                    AuthType.github,
                    AuthType.discord,
                ],
                themeType: "dark",
                fiatCoin: "USD",
                language: "en",

                // List the chains you want to include
                chains: [bscTestnet],

                // Optionally, switches the embedded wallet modal to reflect a smart account
                erc4337: {
                    name: "SIMPLE",
                    version: "2.0.0",
                },

                // You can prompt the user to set up extra security measures upon login or other interactions
                promptSettingConfig: {
                    promptPaymentPasswordSettingWhenSign: PromptSettingType.first,
                    promptMasterPasswordSettingWhenLogin: PromptSettingType.first,
                },

                wallet: {
                    themeType: "dark", // Wallet modal theme
                    entryPosition: EntryPosition.TR,


                    // Set to false to remove the embedded wallet modal
                    visible: true,
                    customStyle: {
                        supportUIModeSwitch: true,
                        supportLanguageSwitch: false,
                    },
                },
            }}
        >
            {children}
        </AuthCoreContextProvider>
    );
};
