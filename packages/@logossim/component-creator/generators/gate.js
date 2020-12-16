import generateActions from '../actions/generateActions';
import basePrompts from '../utils/basePrompts';

const gateGenerator = {
  description: 'A basic NOT gate (has configurations)',
  prompts: basePrompts,
  actions: generateActions('Gate'),
};

export default gateGenerator;
