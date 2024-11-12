// components/AccountTab.tsx

import React, { useEffect, useState } from 'react';
import {
    useEthereum,
    useConnect,
    useAuthCore,
} from "@particle-network/authkit";
import {
    AAWrapProvider,
    SendTransactionMode,
    SmartAccount,
} from "@particle-network/aa";
import { ethers, type Eip1193Provider } from "ethers";

import { bscTestnet, mainnet, vechain } from "@particle-network/authkit/chains";
import MainContent from '../common/auth/MainContent';
import { formatBalance } from '@src/utils/crypto';
import Sidebar from '../common/auth/Sidebar';


import('buffer').then(({ Buffer }) => {
    window.Buffer = Buffer;
});

const AccountTab = () => {
    const { connectionStatus } = useConnect();
    const { provider, chainInfo } = useEthereum();
    const { userInfo } = useAuthCore();
    //const { setActiveAccount, setChainId, setSelectedSection, selectedSection, setActiveUser } = useStoreChat()

    const [balance, setBalance] = useState<string>(""); // states for fetching and display the balance
    const [recipientAddress, setRecipientAddress] = useState<string>(""); // states to get the address to send tokens to from the UI
    const [address, setAddress] = useState<string>(""); // states to handle the address of the smart account
    const [transactionHash, setTransactionHash] = useState<string | null>(null); // states for the transaction hash
    const [isSending, setIsSending] = useState<boolean>(false); // state to display 'Sending...' while waiting for a hash

    // state to handle the selected transaction mode. Gasless by default
    const [selectedMode, setSelectedMode] = useState<SendTransactionMode>(
        SendTransactionMode.Gasless
    );

    // Set up and configure the smart account
    const smartAccount = new SmartAccount(provider, {
        projectId: import.meta.env.VITE_PUBLIC_PROJECT_ID!,
        clientKey: import.meta.env.VITE_PUBLIC_CLIENT_KEY!,
        appId: import.meta.env.VITE_PUBLIC_APP_ID!,
        aaOptions: {
            accountContracts: {
                SIMPLE: [
                    {
                        version: "2.0.0",
                        chainIds: [bscTestnet.id, mainnet.id, vechain.id],
                    },
                ],
            },
        },
    });

    // Function to create ethers provider based on selected mode. This is for ethers V6
    const createEthersProvider = (mode: SendTransactionMode) => {
        return new ethers.BrowserProvider(
            new AAWrapProvider(smartAccount, mode) as Eip1193Provider,
            "any"
        );
    };

    // Initialize the ethers provider
    const [ethersProvider, setEthersProvider] = useState(() =>
        createEthersProvider(selectedMode)
    );

    // Update ethers provider when selectedMode changes
    useEffect(() => {
        setEthersProvider(createEthersProvider(selectedMode));
    }, [selectedMode]);

    // Fetch the balance when userInfo or chainInfo changes
    useEffect(() => {
        console.log('connectionStatus :>>', connectionStatus)
        if (userInfo) {
            console.log("🚀 ~ useEffect ~ userInfo:", userInfo)
            console.log('smartAccount :>>', smartAccount)
            fetchBalance();
        }
    }, [userInfo]);

    // Fetch the user's balance in Ether
    const fetchBalance = async () => {
        try {
            // Get the smart account address
            const address = await smartAccount.getAddress();
            const chainId = await smartAccount.getChainId();
            console.log("🚀 ~ fetchBalance ~ chainId:", chainId)
            // const user = await getOrCreateUser({ senderAddress: address, avatar: userInfo?.avatar as string, userName: userInfo?.name as string });
            // setActiveUser(user);
            // console.log("🚀 ~ fetchBalance ~ chainId:", chainId)
            // setActiveAccount(address);
            // setChainId(chainId);
            console.log("🚀 ~ fetchBalance ~ address:", address);
            if (!address) {
                return
            }
            const balanceResponse = await ethersProvider.getBalance(address);
            const balanceInEther = ethers.formatEther(balanceResponse); // ethers V5 will need the utils module for those convertion operations

            // Format the balance using the utility function
            const fixedBalance = formatBalance(balanceInEther);

            setAddress(address);
            setBalance(fixedBalance);
        } catch (error) {
            console.error("Error fetching balance:", error);
        }
    };


    const executeTxEthers = async () => {
        setIsSending(true);
        const signer = await ethersProvider.getSigner();
        const tx = {
            to: recipientAddress,
            value: ethers.parseEther("0.001"),
            data: "0x",
        };

        try {
            const txResponse = await signer.sendTransaction(tx);
            const txReceipt = await txResponse.wait();
            if (txReceipt) {
                setTransactionHash(txReceipt.hash);
            } else {
                console.error("Transaction receipt is null");
            }
        } catch (error) {
            console.error("Error executing EVM transaction:", error);
        } finally {
            setIsSending(false);
        }
    };


    return (
        <div className="p-4">
            <h2 className="mb-4 text-xl font-bold">Account connectionStatus: {connectionStatus}</h2>
            <Sidebar />
            <MainContent
                userInfo={userInfo}
                address={address}
                chainInfo={chainInfo}
                balance={balance}
                fetchBalance={fetchBalance}
                recipientAddress={recipientAddress}
                setRecipientAddress={setRecipientAddress}
                selectedMode={selectedMode}
                setSelectedMode={setSelectedMode}
                executeTxEthers={executeTxEthers}
                isSending={isSending}
                transactionHash={transactionHash}
            />
        </div>
    );
};

export default AccountTab;