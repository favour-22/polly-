'use client';

import React, { useState } from 'react';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import { recordPollShare } from '@/lib/database';
import useAuth from '@/hooks/useAuth';

interface PollQRCodeProps {
  pollId: string;
  pollTitle?: string;
  baseUrl?: string;
}

export default function PollQRCode({ 
  pollId, 
  pollTitle = 'Poll', 
  baseUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000' 
}: PollQRCodeProps) {
  const { user } = useAuth();
  const [pollUrl, setPollUrl] = useState(`${baseUrl}/polls/${pollId}`);
  const [qrSize, setQrSize] = useState(256);

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(pollUrl);
      // Record the share
      await recordPollShare(pollId, 'copy_url', user?.id);
      alert('Poll URL copied to clipboard!');
    } catch (error) {
      alert('Failed to copy URL');
    }
  };

  const handleDownloadQR = async () => {
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${qrSize}x${qrSize}&data=${encodeURIComponent(pollUrl)}`;
    
    // Record the share
    await recordPollShare(pollId, 'download_qr', user?.id);
    
    const link = document.createElement('a');
    link.href = qrUrl;
    link.download = `poll-${pollId}-qr.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = async () => {
    // Record the share
    await recordPollShare(pollId, 'native_share', user?.id);

    if (navigator.share) {
      try {
        await navigator.share({
          title: pollTitle,
          text: `Vote on this poll: ${pollTitle}`,
          url: pollUrl,
        });
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          alert('Failed to share');
        }
      }
    } else {
      handleCopyUrl();
    }
  };

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${qrSize}x${qrSize}&data=${encodeURIComponent(pollUrl)}`;

  return (
    <div className="w-full max-w-md p-6 border rounded-lg bg-white shadow-sm">
      <div className="mb-4">
        <h3 className="text-xl font-semibold mb-2">📱 Share Poll</h3>
        <p className="text-sm text-gray-600">
          Share this QR code or link to let others vote on your poll
        </p>
      </div>

      <div className="space-y-4">
        {/* QR Code Display */}
        <div className="flex justify-center">
          <div 
            id="poll-qr-code"
            className="bg-white p-4 rounded-lg border"
            style={{ width: qrSize, height: qrSize }}
          >
            <img
              src={qrCodeUrl}
              alt="QR Code for poll"
              width={qrSize - 32}
              height={qrSize - 32}
              className="w-full h-full"
            />
          </div>
        </div>

        {/* URL Input */}
        <div className="space-y-2">
          <label htmlFor="poll-url" className="text-sm font-medium">Poll URL</label>
          <div className="flex gap-2">
            <Input
              id="poll-url"
              value={pollUrl}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPollUrl(e.target.value)}
              readOnly
            />
            <Button
              variant="default"
              onClick={handleCopyUrl}
              title="Copy URL"
              className="px-3"
            >
              📋
            </Button>
          </div>
        </div>

        {/* QR Size Control */}
        <div className="space-y-2">
          <label htmlFor="qr-size" className="text-sm font-medium">QR Code Size</label>
          <Input
            id="qr-size"
            type="range"
            min="128"
            max="512"
            step="32"
            value={qrSize}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQrSize(Number(e.target.value))}
            className="w-full"
          />
          <div className="text-sm text-gray-500 text-center">
            {qrSize}px × {qrSize}px
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button onClick={handleDownloadQR} variant="primary" className="flex-1">
            💾 Download QR
          </Button>
          <Button onClick={handleShare} variant="default" className="flex-1">
            📤 Share
          </Button>
        </div>

        {/* Poll Info */}
        <div className="text-sm text-gray-500 text-center">
          <p>Poll ID: {pollId}</p>
          <p>Title: {pollTitle}</p>
        </div>
      </div>
    </div>
  );
}
