'use client';

import { useState } from 'react';
import { isValidLeetchiUrl } from '../utils/validation_helper';

interface Props {
  url: string;
  valid: boolean;
  setValid: (value: boolean) => void;
}

export default function CheckURLButton({ url, valid, setValid }: Props) {
  const [status, setStatus] = useState('');
  const [isVeryfing, setisVeryfing] = useState(false);


  const handleClick = async () => {
    setisVeryfing(true);

    if (!url) {
      setStatus('❌ Please provide an url.');
      setisVeryfing(false);
      return;
    }
    if (!isValidLeetchiUrl(url)) {
      setStatus('❌ Please provide a valid leetchi url.');
      setisVeryfing(false);
      return;
    }
    setStatus('✅ Workflow triggered. We are checking the page... please wait. This may take up to a few minutes.');
    try {
      // Trigger workflow
      const res = await fetch('/api/trigger-scraper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUrl: url }),
      });
      const data = await res.json();
      if (data.error) {
        setStatus('❌ Error triggering workflow');
        setisVeryfing(false);
        return;
      }

      setStatus('🔄 We are checking... please wait. This can take up to 60 seconds.');

      // Poll MongoDB every 3s
      const startTime = Date.now();
      const interval = setInterval(async () => {
        const elapsed = Date.now() - startTime;
        if (elapsed > 60000) {
          clearInterval(interval);
          setStatus('⏱️ Sorry, we could not get a result within  60 seconds. Please try again later.');
          setisVeryfing(false);
          return;
        }

        try {
          const res = await fetch(`/api/get-amount?url=${encodeURIComponent(url)}&isRecent=true`);
          const result = await res.json();
          if (result.amount != null) {
            setStatus(`🎉 Your fundraiser is valid! ✅ Current amount raised: €${result.amount}`);
            clearInterval(interval);
            setValid(true);
        }
        } catch (err) {
          console.error('Polling error:', err);
        }
      }, 3000);
    } catch (err) {
      console.error(err);
      setStatus('Error triggering workflow');
    }
  };

  return (
    <div>
      <button
        onClick={handleClick}
        disabled={valid  || isVeryfing}
        className="custom-button"
      >
        Verify Fundraiser
      </button>
      <p>{status}</p>
    </div>
  );
}
