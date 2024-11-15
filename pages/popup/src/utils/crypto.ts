// Utility function to format the balance to 6 decimal places

import { ethers } from 'ethers';

// This is more accurate than using .toFixed() because it does not rount it
export const formatBalance = (balanceInEther: string): string => {
  const [integerPart, decimalPart] = balanceInEther.split('.');
  const truncatedDecimalPart = decimalPart ? decimalPart.slice(0, 6) : '000000';
  return `${integerPart}.${truncatedDecimalPart}`;
};

// Function to truncate addresses for display
export const truncateAddress = (address: string): string => {
  return address ? `${address.slice(0, 6)}...${address.slice(address.length - 4)}` : '';
};

export function rankAddresses(add1: string, add2: string): string {
  if (add1 > add2) {
    return add1 + '_' + add2;
  } else {
    return add2 + '_' + add1;
  }
}

export function createHashFromString(inputString: string) {
  const buffByteLike = fromStringToHash(inputString);
  const mnemonic = ethers.Mnemonic.entropyToPhrase(buffByteLike);
  try {
    const hash = ethers.Wallet.fromPhrase(mnemonic);
    return hash.address;
  } catch (error) {
    console.error('Error creating hash:', error);
    return null;
  }
}

export function fromStringToHash(inputString: string) {
  const buffByteLike = ethers.id(inputString);
  return buffByteLike;
}

export function reworkYouTubeUrl(url: string) {
  // Regular expressions to match various YouTube URL formats
  const youtubeWatchRegex = /^https:\/\/www\.youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/;
  const youtubeShortsRegex = /^https:\/\/www\.youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/;
  const youtubeEmbedRegex = /^https:\/\/www\.youtube\.com\/embed\/([a-zA-Z0-9_-]+)/;

  // Check if it's already an embed URL
  const embedMatch = url.match(youtubeEmbedRegex);
  if (embedMatch) {
    return url; // Return as is if it's already an embed URL
  }

  // Check if the URL matches other patterns
  const watchMatch = url.match(youtubeWatchRegex);
  const shortsMatch = url.match(youtubeShortsRegex);

  if (watchMatch || shortsMatch) {
    // Extract the video ID from the matched URL
    const videoId = watchMatch ? watchMatch[1] : shortsMatch![1];
    // Construct the embed URL
    const embedUrl = `https://www.youtube.com/embed/${videoId}`;
    return embedUrl;
  } else {
    // Return the original URL if it's not a recognized YouTube URL
    return url;
  }
}
