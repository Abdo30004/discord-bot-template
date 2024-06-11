import { Event } from '../../@types/event';


const event: Event<'ready'> = {
	name: 'ready',
	run: async (client) => {
	
		
		console.log(`Logged in as ${client.user.tag}`);
		return true;
	}
};

export default event;
