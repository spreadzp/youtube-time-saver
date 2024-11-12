import React from "react";

interface MainContentProps {
    userInfo: any;
    address: string;
    chainInfo: any;
    balance: string;
    fetchBalance: () => void;
    recipientAddress: string;
    setRecipientAddress: (address: string) => void;
    selectedMode: number;
    setSelectedMode: (mode: number) => void;
    executeTxEthers: () => void;
    isSending: boolean;
    transactionHash: string | null;
}

const MainContent: React.FC<MainContentProps> = ({
    userInfo,
    address,
    chainInfo,
    balance,
    fetchBalance,
    recipientAddress,
    setRecipientAddress,
    selectedMode,
    setSelectedMode,
    executeTxEthers,
    isSending,
    transactionHash,
}) => {
    return (
        <main className="grow bg-black p-8 ">
            <div className="flex flex-col items-center">
                <p className="text-2xl font-bold text-white">Wallet Information</p>
                <p className="text-white">Address: {address}</p>
                <p className="text-white">Balance: {balance}</p>
                <button className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700" onClick={fetchBalance}>
                    Fetch Balance
                </button>
            </div>
        </main>
    );
};

export default MainContent;