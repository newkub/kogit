import * as p from '@clack/prompts';
import pc from 'picocolors';
import { commit } from './commands/commit';
import { history } from './commands/history';
import { merge } from './commands/merge';
import { remote } from './commands/remote';
import { local } from './commands/local';
import { branch } from './commands/branch';

const displayIntro = () => p.intro(pc.blue('✨ Welcome to kogit ✨'));

const getSelectedAction = () => p.select({
  message: 'What would you like to do?',
  options: [
    { value: 'commit', label: '📝 Commit   ', hint: 'Create a new commit' },
    { value: 'merge', label: '🔀 Merge    ', hint: 'Merge branches' },
    { value: 'history', label: '📜 History  ', hint: 'View commit history' },
    { value: 'local', label: '🏠 Local    ', hint: 'Local operations' },
    { value: 'remote', label: '🌐 Remote   ', hint: 'Remote operations' },
    { value: 'branch', label: '🌿 Branch   ', hint: 'Branch operations' },
  ],
});

const handleCancellation = (action: unknown): action is symbol => {
  if (p.isCancel(action)) {
    p.cancel('❌ Operation cancelled');
    process.exit(0);
    return true;
  }
  return false;
};

const executeAction = async (action: string) => {
  const actions = {
    'commit': commit,
    'merge': merge,
    'history': history,
    'local': local,
    'remote': remote,
    'branch': branch,
  };
  
  await (actions[action as keyof typeof actions] || (() => {}))();
};

const displayOutro = () => {
  p.outro(pc.green('✅ Done!'));
  process.exit(0);
};

const main = async () => {
  displayIntro();
  
  const action = await getSelectedAction();
  
  if (handleCancellation(action)) return;
  
  await executeAction(action as string);
  
  displayOutro();
};

main().catch(console.error);
