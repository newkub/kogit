import { execa } from 'execa';
import fzf from 'node-fzf';
import * as p from '@clack/prompts';
import pc from 'picocolors';

const execGitCommand = async (args: string[], options = { stdio: 'pipe' as const }) => {
  try {
    const { stdout } = await execa('git', args, options);
    return stdout;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : String(error));
  }
};

const getGitLogs = async () => {
  const output = await execGitCommand([
    'log',
    '--pretty=format:%h - %an, %ar : %s',
    '--graph',
    '--color=always',
    '--max-count=100' // Limit to the most recent 100 commits for faster loading
  ]);
  
  const lines = output.split('\n').filter(Boolean);
  if (lines.length === 0) {
    throw new Error('No commit history found');
  }
  return lines;
};

const showCommitDetails = (hash: string) => 
  execa('git', ['show', hash], { stdio: 'inherit' });

const checkoutCommit = (hash: string) => 
  execa('git', ['checkout', hash], { stdio: 'inherit' });

const showCommitDiff = (hash: string) => 
  execa('git', ['diff', hash], { stdio: 'inherit' });

const performCommitAction = (action: string, hash: string) => {
  const actions = {
    'show': () => showCommitDetails(hash),
    'checkout': () => checkoutCommit(hash),
    'diff': () => showCommitDiff(hash)
  };
  
  return actions[action as keyof typeof actions]();
};

export const showGitHistory = async () => {
  try {
    p.note('Loading git history...', 'Please wait');
    const logs = await getGitLogs();

    const result = await fzf({
      list: logs,
      mode: 'normal',
      preview: true,
      previewWindow: 'right:60%'
    });

    if (!result || !result.selected) {
      p.cancel('No commit selected');
      return;
    }

    const commitHash = result.selected.value.split(' ')[0];

    const action = await p.select({
      message: 'เลือก action ที่ต้องการ:',
      options: [
        { value: 'show', label: 'แสดงรายละเอียด commit' },
        { value: 'checkout', label: 'Checkout commit นี้' },
        { value: 'diff', label: 'แสดง diff จาก commit นี้' },
      ]
    });

    if (p.isCancel(action)) {
      p.cancel('Operation cancelled.');
      process.exit(0);
    }

    await performCommitAction(action as string, commitHash);
  } catch (error) {
    p.cancel(`Error: ${error instanceof Error ? error.message : String(error)}`);
  }
};

export async function history() {
  p.intro(pc.blue('📜 History Mode'));
  
  try {
    await showGitHistory();
  } catch (error) {
    p.note(`Error: ${error instanceof Error ? error.message : String(error)}`, 'Git History');
  }
  
  p.outro(pc.green('✅ History displayed!'));
}