import { spawn } from 'child_process'
import { cancel, isCancel, select } from '@clack/prompts'
// @ts-ignore
import fzf from 'node-fzf'
import * as p from '@clack/prompts';
import pc from 'picocolors';

export async function showGitHistory() {
    try {
        // ดึง git log ในรูปแบบที่เหมาะสำหรับ fzf
        const logs = await getGitLogs()

        // ใช้ fzf เพื่อเลือก commit
        const result = await fzf({
            list: logs,
            mode: 'normal',
            preview: true,
            previewWindow: 'right:60%'
        })

        if (!result || !result.selected) {
            cancel('No commit selected');
            return;
        }

        const commitHash = result.selected.value.split(' ')[0]

        // ให้ผู้ใช้เลือก action ที่ต้องการ
        const action = await select({
            message: 'เลือก action ที่ต้องการ:',
            options: [
                { value: 'show', label: 'แสดงรายละเอียด commit' },
                { value: 'checkout', label: 'Checkout commit นี้' },
                { value: 'diff', label: 'แสดง diff จาก commit นี้' },
            ]
        })

        if (isCancel(action)) {
            cancel('Operation cancelled.')
            process.exit(0)
        }

        // Execute action ตามที่เลือก
        switch (action) {
            case 'show':
                await showCommitDetails(commitHash)
                break
            case 'checkout':
                await checkoutCommit(commitHash)
                break
            case 'diff':
                await showCommitDiff(commitHash)
                break
        }
    } catch (error) {
        cancel(`Error: ${error instanceof Error ? error.message : String(error)}`)
    }
}

async function getGitLogs(): Promise<string[]> {
    return new Promise((resolve, reject) => {
        const child = spawn('git', [
            'log',
            '--pretty=format:%h - %an, %ar : %s',
            '--graph',
            '--color=always'
        ])

        let output = ''
        let errorOutput = ''
        
        child.stdout.on('data', (data) => {
            output += data.toString()
        })
        
        child.stderr.on('data', (data) => {
            errorOutput += data.toString()
        })

        child.on('close', (code) => {
            if (code === 0) {
                const lines = output.split('\n').filter(Boolean)
                if (lines.length === 0) {
                    reject(new Error('No commit history found'))
                } else {
                    resolve(lines)
                }
            } else {
                reject(new Error(errorOutput.trim() || `Git log failed with code ${code}`))
            }
        })
    })
}

async function showCommitDetails(hash: string) {
    const child = spawn('git', ['show', hash], {
        stdio: 'inherit'
    })

    await new Promise((resolve) => {
        child.on('close', resolve)
    })
}

async function checkoutCommit(hash: string) {
    const child = spawn('git', ['checkout', hash], {
        stdio: 'inherit'
    })

    await new Promise((resolve) => {
        child.on('close', resolve)
    })
}

async function showCommitDiff(hash: string) {
    const child = spawn('git', ['diff', hash], {
        stdio: 'inherit'
    })

    await new Promise((resolve) => {
        child.on('close', resolve)
    })
}

export async function history() {
  p.intro(pc.blue('📜 History Mode'));
  
  const s = p.spinner();
  s.start('Loading history...');
  
  try {
    await showGitHistory();
    s.stop('History loaded');
  } catch (error) {
    s.stop('Failed to load history');
    p.note(`Error: ${error instanceof Error ? error.message : String(error)}`, 'Git History');
  }
  
  p.outro(pc.green('✅ History displayed!'));
}