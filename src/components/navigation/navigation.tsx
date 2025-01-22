import React, { FC, useState, useEffect } from "react";
import Box from "@mui/material/Box";
import { navigations } from "./navigation.data";
import { Link, Button } from "@mui/material";
import { useLocation } from "react-router-dom";
import { ethers } from 'ethers';

type NavigationData = {
  path: string;
  label: string;
};

const Navigation: FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const [account, setAccount] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert('Please install MetaMask!');
      return;
    }

    try {
      setIsConnecting(true);
      // Ask for account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });
      
      // Get the first account and set it to the state
      setAccount(accounts[0]);
      
      // Initialize the provider
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      
    } catch (error) {
      console.error('Connection error:', error);
      alert('Connection failed. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  };

  // Listen for account changes
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        setAccount(accounts[0] || null);
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', () => {});
      }
    };
  }, []);

  // Shorten the address
  const shortenAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexFlow: "wrap",
        justifyContent: "end",
        flexDirection: { xs: "column", lg: "row" }
      }}
    >
      {navigations.map(({ path: destination, label }: NavigationData) =>
        <Box
          key={label}
          component={Link}
          href={destination}
          sx={{
            display: "inline-flex",
            position: "relative",
            color: currentPath === destination ? "" : "white",
            lineHeight: "30px",
            letterSpacing: "3px",
            cursor: "pointer",
            textDecoration: "none",
            textTransform: "uppercase",
            fontWeight: 700,
            alignItems: "center",
            justifyContent: "center",
            px: { xs: 0, lg: 3 },
            mb: { xs: 3, lg: 0 },
            fontSize: "20px",
            ...destination === "/" && { color: "primary.main" },
            "& > div": { display: "none" },
            "&.current>div": { display: "block" },
            "&:hover": {
              color: "text.disabled"
            }
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: 12,
              transform: "rotate(3deg)",
              "& img": { width: 44, height: "auto" }
            }}
          >
            {/* eslint-disable-next-line */}
            <img src="/images/headline-curve.svg" alt="Headline curve" />
          </Box>
          {label}
        </Box>
      )}
      <Button
        variant="contained"
        onClick={connectWallet}
        disabled={isConnecting}
        sx={{
          background: "linear-gradient(to right, #64aeb8, #64bdb7)",
          color: "white",
          "&:hover": {
            background: "linear-gradient(to right, #5a9da6, #5aa9a4)"
          }
        }}
      >
        {isConnecting ? 'Connecting...' : 
         account ? shortenAddress(account) : 'Connect Wallet'}
      </Button>
    </Box>
  );
};

export default Navigation;
