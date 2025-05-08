import * as p from '@clack/prompts';
import pc from 'picocolors';
import { commit } from './commands/commit';
import { history } from './commands/history';
import { merge } from './commands/merge';

async function main() {
  p.intro(pc.blue('✨ Welcome to kogit ✨'));

  const action = await p.select({
    message: 'What would you like to do?',
    options: [
      { value: 'commit', label: '📝 Commit   ', hint: 'Create a new commit' },
      { value: 'merge', label: '🔀 Merge    ', hint: 'Merge branches' },
      { value: 'history', label: '📜 History  ', hint: 'View commit history' },
    ],
  });

  if (p.isCancel(action)) {
    p.cancel('❌ Operation cancelled');
    process.exit(0);
    return;
  }

  // Handle the selected action
  switch (action) {
    case 'commit':
      await commit();
      break;
    case 'merge':
      await merge();
      break;
    case 'history':
      await history();
      break;
  }

  p.outro(pc.green('✅ Done!'));
  process.exit(0);
}

main().catch(console.error);
