import React from "react";
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';
import { useConnect } from "@particle-network/authkit";
import { getIconByName } from "@src/components/icons/Icons";
import { Header } from "../Header";


const Sidebar: React.FC = () => {
    const { connect, disconnect, connectionStatus, connected } = useConnect();
    // Handle user login
    const handleLogin = async () => {
        if (!connected) {
            await connect({});
        }
    };

    // Handle user disconnect
    const handleDisconnect = async () => {
        try {
            await disconnect();
        } catch (error) {
            console.error("Error disconnecting:", error);
        }
    };
    return (
        <aside className="flex w-24 flex-col items-center bg-gray-800 py-4 text-white">

            <Header />
            {
                connectionStatus === 'disconnected' && <button
                    className="focus:outline-none"
                    onClick={handleLogin} title="Connect"
                >
                    {getIconByName('SignIn')}
                </button>
            }
            {
                connectionStatus === 'connected' && <button
                    className="focus:outline-none"
                    title="Disconnect"
                    onClick={handleDisconnect}
                >
                    {getIconByName('SignOut')}
                </button>
            }
            <Tooltip id="social-tooltip" />
        </aside >
    );
};

export default Sidebar;