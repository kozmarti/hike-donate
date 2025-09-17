'use client';

import { useState } from 'react';

interface Props {
  url: string;
  valid: boolean;
  setValid: (value: boolean) => void;
}

export default function CheckURLButton({ url, valid, setValid }: Props) {
  const [status, setStatus] = useState('');

  const handleClick = async () => {
    setStatus('✅ Workflow triggered. We are checking the page... please wait. This may take up to a few minutes.');
    setValid(true);

    try {
      // Trigger workflow
      const res = await fetch('/api/trigger-scraper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUrl: url }),
      });
      const data = await res.json();
      if (data.error) {
        setStatus('Error triggering workflow');
        setValid(false);
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
          setValid(false);
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
      setValid(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleClick}
        disabled={valid}
        className="custom-button"
      >
        Verify Fundraiser
      </button>
      <p>{status}</p>
    </div>
  );
}
