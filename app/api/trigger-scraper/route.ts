import { NextRequest, NextResponse } from 'next/server';
import { Octokit } from '@octokit/core';
import { requireUser } from '@/lib/session';
import { isValidLeetchiUrl } from '@/app/utils/validation_helper';

export async function POST(req: NextRequest) {
  try {
    const session = requireUser(req);
    if (session instanceof Response) return session;

    const body = await req.json();
    const targetUrl = body?.targetUrl;

    if (typeof targetUrl !== 'string' || !isValidLeetchiUrl(targetUrl)) {
      return NextResponse.json({ error: 'A valid Leetchi targetUrl is required' }, { status: 400 });
    }

    const octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN, // Store token securely in Vercel/Next.js env
    });

    await octokit.request(
      'POST /repos/{owner}/{repo}/actions/workflows/{workflow_id}/dispatches',
      {
        owner: 'kozmarti',
        repo: 'scraper-verify-url',
        workflow_id: 'scrape.yaml',
        ref: 'main',
        inputs: { targetUrl },
        headers: {
          'X-GitHub-Api-Version': '2022-11-28',
        },
      }
    );

    return NextResponse.json({ message: 'Workflow triggered successfully!' });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to trigger workflow' }, { status: 500 });
  }
}
