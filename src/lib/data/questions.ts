export type Value =
	| 'loyalty'
	| 'justice'
	| 'compassion'
	| 'ambition'
	| 'security'
	| 'freedom'
	| 'honesty'
	| 'harmony';

export interface QuestionOption {
	text: string;
	values: Partial<Record<Value, number>>;
	nextId?: string;
}

export interface Question {
	id: string;
	text: string;
	type: 'instinct' | 'allocation' | 'tradeoff' | 'deep';
	options: QuestionOption[];
	timeLimit?: number;
}

export interface QuestionGraph {
	rootId: string;
	length: number;
	questions: Record<string, Question>;
}

export interface QuestionTrack {
	instinct: QuestionGraph;
	tradeoff: QuestionGraph;
	deep: QuestionGraph;
}

export const allocationCategories = ['Career', 'Relationships', 'Health', 'Adventure'] as const;

export type AllocationCategory = (typeof allocationCategories)[number];

export const categoryValueMap: Record<AllocationCategory, Partial<Record<Value, number>>> = {
	Career: { ambition: 2, security: 1 },
	Relationships: { loyalty: 2, harmony: 1 },
	Health: { security: 2, compassion: 1 },
	Adventure: { freedom: 3, ambition: 1 }
};

export const ALLOCATION_WEIGHT_SCALE = 4;

const careerInstinct: QuestionGraph = {
	rootId: 'ci1',
	length: 5,
	questions: {
		ci1: {
			id: 'ci1',
			type: 'instinct',
			text:
				'In a project review, a teammate takes credit for your idea. Do you speak up?',
			options: [
				{ text: 'Speak up now', values: { honesty: 3, justice: 2 }, nextId: 'ci2a' },
				{ text: 'Talk after', values: { harmony: 3, loyalty: 1 }, nextId: 'ci2b' }
			],
			timeLimit: 5
		},
		ci2a: {
			id: 'ci2a',
			type: 'instinct',
			text: 'Afterward they ask you to smooth it over to keep peace. Do you?',
			options: [
				{ text: 'Smooth it', values: { compassion: 2, harmony: 2 }, nextId: 'ci3' },
				{ text: 'Hold the line', values: { justice: 2, honesty: 2 }, nextId: 'ci3' }
			],
			timeLimit: 5
		},
		ci2b: {
			id: 'ci2b',
			type: 'instinct',
			text: 'They ask you to cover again next time to avoid tension. Agree?',
			options: [
				{ text: 'Agree once', values: { loyalty: 2, compassion: 1 }, nextId: 'ci3' },
				{ text: 'Say no', values: { honesty: 3, security: 1 }, nextId: 'ci3' }
			],
			timeLimit: 5
		},
		ci3: {
			id: 'ci3',
			type: 'instinct',
			text: 'A rival team offers a bigger role and fast track. Do you leave?',
			options: [
				{ text: 'Take the leap', values: { ambition: 3, freedom: 2 }, nextId: 'ci4a' },
				{ text: 'Stay put', values: { loyalty: 2, security: 2 }, nextId: 'ci4b' }
			],
			timeLimit: 5
		},
		ci4a: {
			id: 'ci4a',
			type: 'instinct',
			text: 'The new role means long hours and constant travel. Accept it?',
			options: [
				{ text: 'Accept and push', values: { ambition: 3, security: 1 }, nextId: 'ci5' },
				{ text: 'Set boundaries', values: { harmony: 2, freedom: 2 }, nextId: 'ci5' }
			],
			timeLimit: 5
		},
		ci4b: {
			id: 'ci4b',
			type: 'instinct',
			text: 'Your team is stalled and leadership avoids change. Push a reset?',
			options: [
				{ text: 'Push change', values: { ambition: 2, justice: 2 }, nextId: 'ci5' },
				{ text: 'Keep stability', values: { security: 3, harmony: 1 }, nextId: 'ci5' }
			],
			timeLimit: 5
		},
		ci5: {
			id: 'ci5',
			type: 'instinct',
			text: 'A peer is slipping and the team feels it. Are you direct?',
			options: [
				{ text: 'Be direct', values: { honesty: 3, justice: 1 } },
				{ text: 'Coach gently', values: { compassion: 3, harmony: 1 } }
			],
			timeLimit: 5
		}
	}
};

const careerTradeoff: QuestionGraph = {
	rootId: 'ct1',
	length: 5,
	questions: {
		ct1: {
			id: 'ct1',
			type: 'tradeoff',
			text: 'You can take a stable role or join a risky startup. Which do you choose?',
			options: [
				{ text: 'Stable role', values: { security: 3, harmony: 1 }, nextId: 'ct2a' },
				{ text: 'Risky startup', values: { ambition: 3, freedom: 2 }, nextId: 'ct2b' }
			]
		},
		ct2a: {
			id: 'ct2a',
			type: 'tradeoff',
			text: 'A policy hurts a small group on your team. Challenge it openly?',
			options: [
				{ text: 'Challenge it', values: { justice: 3, honesty: 1 }, nextId: 'ct3' },
				{ text: 'Work within', values: { loyalty: 2, harmony: 2 }, nextId: 'ct3' }
			]
		},
		ct2b: {
			id: 'ct2b',
			type: 'tradeoff',
			text: 'A partner cuts corners to ship on time. Do you stop them?',
			options: [
				{ text: 'Stop them', values: { honesty: 3, justice: 1 }, nextId: 'ct3' },
				{ text: 'Let it slide', values: { ambition: 3, freedom: 1 }, nextId: 'ct3' }
			]
		},
		ct3: {
			id: 'ct3',
			type: 'tradeoff',
			text: 'You can pick a strict mentor or a supportive one. Which do you choose?',
			options: [
				{ text: 'Strict mentor', values: { ambition: 2, security: 2 }, nextId: 'ct4a' },
				{ text: 'Supportive mentor', values: { compassion: 2, harmony: 2 }, nextId: 'ct4b' }
			]
		},
		ct4a: {
			id: 'ct4a',
			type: 'tradeoff',
			text: 'Your mentor asks you to relocate for opportunity. Do you go?',
			options: [
				{ text: 'Relocate', values: { freedom: 2, ambition: 2 }, nextId: 'ct5' },
				{ text: 'Decline', values: { loyalty: 2, security: 2 }, nextId: 'ct5' }
			]
		},
		ct4b: {
			id: 'ct4b',
			type: 'tradeoff',
			text: 'Your coach urges you to slow down to avoid burnout. Do you?',
			options: [
				{ text: 'Slow down', values: { harmony: 2, security: 2 }, nextId: 'ct5' },
				{ text: 'Keep pace', values: { ambition: 3, freedom: 1 }, nextId: 'ct5' }
			]
		},
		ct5: {
			id: 'ct5',
			type: 'tradeoff',
			text: 'For the next decade, do you trade balance for influence?',
			options: [
				{ text: 'Influence', values: { ambition: 3, justice: 1 } },
				{ text: 'Balance', values: { harmony: 3, compassion: 1 } }
			]
		}
	}
};

const careerDeep: QuestionGraph = {
	rootId: 'cd1',
	length: 5,
	questions: {
		cd1: {
			id: 'cd1',
			type: 'deep',
			text: 'You discover your product harms users in edge cases. Pause the launch?',
			options: [
				{ text: 'Pause now', values: { compassion: 3, justice: 2 }, nextId: 'cd2a' },
				{ text: 'Ship and fix', values: { ambition: 3, security: 1 }, nextId: 'cd2b' }
			]
		},
		cd2a: {
			id: 'cd2a',
			type: 'deep',
			text: 'Leadership blames you for the delay. Do you take the hit?',
			options: [
				{ text: 'Take blame', values: { honesty: 3, justice: 1 }, nextId: 'cd3' },
				{ text: 'Share blame', values: { loyalty: 2, harmony: 2 }, nextId: 'cd3' }
			]
		},
		cd2b: {
			id: 'cd2b',
			type: 'deep',
			text: 'A whistleblower plans to leak details. Do you join them?',
			options: [
				{ text: 'Join the leak', values: { honesty: 3, freedom: 1 }, nextId: 'cd3' },
				{ text: 'Ask for time', values: { loyalty: 2, security: 2 }, nextId: 'cd3' }
			]
		},
		cd3: {
			id: 'cd3',
			type: 'deep',
			text: 'A rival offers to buy and shelve your work. Accept?',
			options: [
				{ text: 'Accept', values: { security: 3, loyalty: 1 }, nextId: 'cd4a' },
				{ text: 'Refuse', values: { honesty: 3, freedom: 1 }, nextId: 'cd4b' }
			]
		},
		cd4a: {
			id: 'cd4a',
			type: 'deep',
			text: 'Selling saves jobs but ends the mission. Do you do it?',
			options: [
				{ text: 'Save jobs', values: { compassion: 3, security: 1 }, nextId: 'cd5' },
				{ text: 'Protect mission', values: { ambition: 2, freedom: 2 }, nextId: 'cd5' }
			]
		},
		cd4b: {
			id: 'cd4b',
			type: 'deep',
			text: 'Refusing risks closure. Do you ask staff to take cuts?',
			options: [
				{ text: 'Ask for cuts', values: { loyalty: 2, justice: 1 }, nextId: 'cd5' },
				{ text: 'Close down', values: { honesty: 2, security: 2 }, nextId: 'cd5' }
			]
		},
		cd5: {
			id: 'cd5',
			type: 'deep',
			text: 'You are offered a powerful role that limits autonomy. Take it?',
			options: [
				{ text: 'Take role', values: { ambition: 2, justice: 1 } },
				{ text: 'Decline', values: { freedom: 3, harmony: 1 } }
			]
		}
	}
};

const relationshipsInstinct: QuestionGraph = {
	rootId: 'ri1',
	length: 5,
	questions: {
		ri1: {
			id: 'ri1',
			type: 'instinct',
			text: 'A friend lies to your partner about you. Do you tell them?',
			options: [
				{ text: 'Tell partner', values: { honesty: 3, justice: 1 }, nextId: 'ri2a' },
				{ text: 'Confront friend', values: { loyalty: 2, harmony: 2 }, nextId: 'ri2b' }
			],
			timeLimit: 5
		},
		ri2a: {
			id: 'ri2a',
			type: 'instinct',
			text: 'Your friend asks you to stay quiet for now. Do you?',
			options: [
				{ text: 'Stay quiet', values: { loyalty: 2, compassion: 1 }, nextId: 'ri3' },
				{ text: 'Still tell', values: { honesty: 3, justice: 1 }, nextId: 'ri3' }
			],
			timeLimit: 5
		},
		ri2b: {
			id: 'ri2b',
			type: 'instinct',
			text: 'Your friend admits it and wants time to fix it. Give it?',
			options: [
				{ text: 'Give time', values: { compassion: 3, harmony: 1 }, nextId: 'ri3' },
				{ text: 'Tell now', values: { honesty: 3, justice: 1 }, nextId: 'ri3' }
			],
			timeLimit: 5
		},
		ri3: {
			id: 'ri3',
			type: 'instinct',
			text: 'Same night: family dinner or a key work event. Which do you choose?',
			options: [
				{ text: 'Family dinner', values: { loyalty: 3, harmony: 1 }, nextId: 'ri4a' },
				{ text: 'Work event', values: { ambition: 2, freedom: 2 }, nextId: 'ri4b' }
			],
			timeLimit: 5
		},
		ri4a: {
			id: 'ri4a',
			type: 'instinct',
			text: 'Your family asks for long-term help. Do you commit?',
			options: [
				{ text: 'Commit', values: { loyalty: 3, security: 1 }, nextId: 'ri5' },
				{ text: 'Set limits', values: { freedom: 2, honesty: 2 }, nextId: 'ri5' }
			],
			timeLimit: 5
		},
		ri4b: {
			id: 'ri4b',
			type: 'instinct',
			text: 'Your partner is upset about the event. Do you still go?',
			options: [
				{ text: 'Go anyway', values: { ambition: 3, freedom: 1 }, nextId: 'ri5' },
				{ text: 'Stay with them', values: { compassion: 2, harmony: 2 }, nextId: 'ri5' }
			],
			timeLimit: 5
		},
		ri5: {
			id: 'ri5',
			type: 'instinct',
			text: 'A friend asks for blunt feedback about them. Do you give it?',
			options: [
				{ text: 'Be blunt', values: { honesty: 3, justice: 1 } },
				{ text: 'Be gentle', values: { compassion: 3, harmony: 1 } }
			],
			timeLimit: 5
		}
	}
};

const relationshipsTradeoff: QuestionGraph = {
	rootId: 'rt1',
	length: 5,
	questions: {
		rt1: {
			id: 'rt1',
			type: 'tradeoff',
			text: 'Your partner gets a dream job elsewhere. Move or keep your job?',
			options: [
				{ text: 'Move', values: { loyalty: 3, compassion: 1 }, nextId: 'rt2a' },
				{ text: 'Keep job', values: { ambition: 2, freedom: 2 }, nextId: 'rt2b' }
			]
		},
		rt2a: {
			id: 'rt2a',
			type: 'tradeoff',
			text: 'The new city feels isolating. Build a new circle fast?',
			options: [
				{ text: 'Build fast', values: { harmony: 2, freedom: 1 }, nextId: 'rt3' },
				{ text: 'Stick to old ties', values: { loyalty: 2, security: 2 }, nextId: 'rt3' }
			]
		},
		rt2b: {
			id: 'rt2b',
			type: 'tradeoff',
			text: 'Your partner feels unsupported lately. Do you cut back work?',
			options: [
				{ text: 'Cut back', values: { compassion: 3, harmony: 1 }, nextId: 'rt3' },
				{ text: 'Hold pace', values: { ambition: 3, security: 1 }, nextId: 'rt3' }
			]
		},
		rt3: {
			id: 'rt3',
			type: 'tradeoff',
			text: 'You move in together. Keep money joint or separate?',
			options: [
				{ text: 'Joint', values: { security: 3, loyalty: 1 }, nextId: 'rt4a' },
				{ text: 'Separate', values: { freedom: 3, honesty: 1 }, nextId: 'rt4b' }
			]
		},
		rt4a: {
			id: 'rt4a',
			type: 'tradeoff',
			text: 'Your partner buys something big without asking. Confront them?',
			options: [
				{ text: 'Confront', values: { justice: 2, honesty: 2 }, nextId: 'rt5' },
				{ text: 'Let it go', values: { harmony: 3, compassion: 1 }, nextId: 'rt5' }
			]
		},
		rt4b: {
			id: 'rt4b',
			type: 'tradeoff',
			text: 'Your partner wants full transparency about spending. Agree?',
			options: [
				{ text: 'Agree', values: { honesty: 3, harmony: 1 }, nextId: 'rt5' },
				{ text: 'Keep privacy', values: { freedom: 3, security: 1 }, nextId: 'rt5' }
			]
		},
		rt5: {
			id: 'rt5',
			type: 'tradeoff',
			text: 'In love, do you want stability or spontaneity?',
			options: [
				{ text: 'Stability', values: { security: 3, loyalty: 1 } },
				{ text: 'Spontaneity', values: { freedom: 3, ambition: 1 } }
			]
		}
	}
};

const relationshipsDeep: QuestionGraph = {
	rootId: 'rd1',
	length: 5,
	questions: {
		rd1: {
			id: 'rd1',
			type: 'deep',
			text: 'You learn a friend hurt someone long ago. Do you confront them?',
			options: [
				{ text: 'Confront', values: { justice: 3, honesty: 1 }, nextId: 'rd2a' },
				{ text: 'Keep peace', values: { loyalty: 2, harmony: 2 }, nextId: 'rd2b' }
			]
		},
		rd2a: {
			id: 'rd2a',
			type: 'deep',
			text: 'They deny it and seem hurt. Do you drop it?',
			options: [
				{ text: 'Drop it', values: { compassion: 3, harmony: 1 }, nextId: 'rd3' },
				{ text: 'Press for truth', values: { honesty: 3, justice: 1 }, nextId: 'rd3' }
			]
		},
		rd2b: {
			id: 'rd2b',
			type: 'deep',
			text: 'The victim asks you what you know. Do you tell them?',
			options: [
				{ text: 'Tell them', values: { honesty: 3, justice: 1 }, nextId: 'rd3' },
				{ text: 'Protect friend', values: { loyalty: 3, security: 1 }, nextId: 'rd3' }
			]
		},
		rd3: {
			id: 'rd3',
			type: 'deep',
			text: 'A loved one asks you to break a rule for them. Do you?',
			options: [
				{ text: 'Break it', values: { loyalty: 2, compassion: 2 }, nextId: 'rd4a' },
				{ text: 'Refuse', values: { honesty: 3, justice: 1 }, nextId: 'rd4b' }
			]
		},
		rd4a: {
			id: 'rd4a',
			type: 'deep',
			text: 'Breaking it would harm a stranger. Do you continue?',
			options: [
				{ text: 'Continue', values: { loyalty: 2, security: 1 }, nextId: 'rd5' },
				{ text: 'Stop', values: { justice: 2, compassion: 2 }, nextId: 'rd5' }
			]
		},
		rd4b: {
			id: 'rd4b',
			type: 'deep',
			text: 'Refusing strains the bond. Do you explain fully?',
			options: [
				{ text: 'Explain fully', values: { honesty: 2, harmony: 2 }, nextId: 'rd5' },
				{ text: 'Keep it brief', values: { security: 2, freedom: 1 }, nextId: 'rd5' }
			]
		},
		rd5: {
			id: 'rd5',
			type: 'deep',
			text: 'If forced to choose, do you pick truth or kindness?',
			options: [
				{ text: 'Truth', values: { honesty: 3, justice: 1 } },
				{ text: 'Kindness', values: { compassion: 3, harmony: 1 } }
			]
		}
	}
};

const healthInstinct: QuestionGraph = {
	rootId: 'hi1',
	length: 5,
	questions: {
		hi1: {
			id: 'hi1',
			type: 'instinct',
			text: 'You are short on sleep but work needs you. Keep pushing?',
			options: [
				{ text: 'Keep pushing', values: { ambition: 3, security: 1 }, nextId: 'hi2a' },
				{ text: 'Protect sleep', values: { security: 3, harmony: 1 }, nextId: 'hi2b' }
			],
			timeLimit: 5
		},
		hi2a: {
			id: 'hi2a',
			type: 'instinct',
			text: 'You feel burned out but deadlines loom. Tell your boss?',
			options: [
				{ text: 'Tell them', values: { honesty: 3, harmony: 1 }, nextId: 'hi3' },
				{ text: 'Power through', values: { ambition: 3, freedom: 1 }, nextId: 'hi3' }
			],
			timeLimit: 5
		},
		hi2b: {
			id: 'hi2b',
			type: 'instinct',
			text: 'Friends want you out late before a big day. Go?',
			options: [
				{ text: 'Go anyway', values: { freedom: 2, harmony: 1 }, nextId: 'hi3' },
				{ text: 'Decline to rest', values: { security: 3, loyalty: 1 }, nextId: 'hi3' }
			],
			timeLimit: 5
		},
		hi3: {
			id: 'hi3',
			type: 'instinct',
			text: 'A risky treatment offers big upside. Do you try it?',
			options: [
				{ text: 'Take the risk', values: { freedom: 3, ambition: 1 }, nextId: 'hi4a' },
				{ text: 'Choose safe plan', values: { security: 3, harmony: 1 }, nextId: 'hi4b' }
			],
			timeLimit: 5
		},
		hi4a: {
			id: 'hi4a',
			type: 'instinct',
			text: 'The risky plan disrupts family plans. Continue anyway?',
			options: [
				{ text: 'Continue', values: { ambition: 2, freedom: 2 }, nextId: 'hi5' },
				{ text: 'Pause for family', values: { loyalty: 2, harmony: 2 }, nextId: 'hi5' }
			],
			timeLimit: 5
		},
		hi4b: {
			id: 'hi4b',
			type: 'instinct',
			text: 'The safe plan is slow. Add a strict routine?',
			options: [
				{ text: 'Add routine', values: { security: 2, justice: 1 }, nextId: 'hi5' },
				{ text: 'Keep it flexible', values: { freedom: 2, compassion: 1 }, nextId: 'hi5' }
			],
			timeLimit: 5
		},
		hi5: {
			id: 'hi5',
			type: 'instinct',
			text: 'A coach says to push past pain. Do you?',
			options: [
				{ text: 'Push', values: { ambition: 2, security: 1 } },
				{ text: 'Stop', values: { compassion: 3, harmony: 1 } }
			],
			timeLimit: 5
		}
	}
};

const healthTradeoff: QuestionGraph = {
	rootId: 'ht1',
	length: 5,
	questions: {
		ht1: {
			id: 'ht1',
			type: 'tradeoff',
			text: 'Do you choose a strict diet or balanced treats?',
			options: [
				{ text: 'Strict diet', values: { security: 3, ambition: 1 }, nextId: 'ht2a' },
				{ text: 'Balanced treats', values: { harmony: 3, freedom: 1 }, nextId: 'ht2b' }
			]
		},
		ht2a: {
			id: 'ht2a',
			type: 'tradeoff',
			text: 'The strict plan hurts social life. Keep it?',
			options: [
				{ text: 'Keep it', values: { security: 3, loyalty: 1 }, nextId: 'ht3' },
				{ text: 'Loosen it', values: { freedom: 2, harmony: 2 }, nextId: 'ht3' }
			]
		},
		ht2b: {
			id: 'ht2b',
			type: 'tradeoff',
			text: 'The balanced plan slows progress. Intensify it?',
			options: [
				{ text: 'Intensify', values: { ambition: 3, justice: 1 }, nextId: 'ht3' },
				{ text: 'Stay balanced', values: { harmony: 3, compassion: 1 }, nextId: 'ht3' }
			]
		},
		ht3: {
			id: 'ht3',
			type: 'tradeoff',
			text: 'Do you prefer solo training or a group class?',
			options: [
				{ text: 'Solo', values: { freedom: 3, ambition: 1 }, nextId: 'ht4a' },
				{ text: 'Group', values: { harmony: 3, loyalty: 1 }, nextId: 'ht4b' }
			]
		},
		ht4a: {
			id: 'ht4a',
			type: 'tradeoff',
			text: 'Solo training feels isolating. Join a team?',
			options: [
				{ text: 'Join team', values: { loyalty: 2, harmony: 2 }, nextId: 'ht5' },
				{ text: 'Stay solo', values: { freedom: 3, security: 1 }, nextId: 'ht5' }
			]
		},
		ht4b: {
			id: 'ht4b',
			type: 'tradeoff',
			text: 'The group pushes past limits. Set boundaries?',
			options: [
				{ text: 'Set boundaries', values: { honesty: 2, security: 2 }, nextId: 'ht5' },
				{ text: 'Go with group', values: { harmony: 2, loyalty: 2 }, nextId: 'ht5' }
			]
		},
		ht5: {
			id: 'ht5',
			type: 'tradeoff',
			text: 'Would you trade comfort for peak health?',
			options: [
				{ text: 'Trade comfort', values: { ambition: 2, freedom: 1 } },
				{ text: 'Keep comfort', values: { security: 3, compassion: 1 } }
			]
		}
	}
};

const healthDeep: QuestionGraph = {
	rootId: 'hd1',
	length: 5,
	questions: {
		hd1: {
			id: 'hd1',
			type: 'deep',
			text: 'A doctor offers a risky trial with unknown outcomes. Join?',
			options: [
				{ text: 'Join', values: { freedom: 3, ambition: 1 }, nextId: 'hd2a' },
				{ text: 'Decline', values: { security: 3, harmony: 1 }, nextId: 'hd2b' }
			]
		},
		hd2a: {
			id: 'hd2a',
			type: 'deep',
			text: 'The trial could help future patients. Share your data?',
			options: [
				{ text: 'Share data', values: { justice: 2, compassion: 2 }, nextId: 'hd3' },
				{ text: 'Keep private', values: { freedom: 2, security: 2 }, nextId: 'hd3' }
			]
		},
		hd2b: {
			id: 'hd2b',
			type: 'deep',
			text: 'Care is costly for your family. Downsize plans?',
			options: [
				{ text: 'Downsize', values: { loyalty: 2, compassion: 2 }, nextId: 'hd3' },
				{ text: 'Protect plans', values: { ambition: 2, freedom: 1 }, nextId: 'hd3' }
			]
		},
		hd3: {
			id: 'hd3',
			type: 'deep',
			text: 'Do you push through pain to hit a goal?',
			options: [
				{ text: 'Push through', values: { ambition: 3, security: 1 }, nextId: 'hd4a' },
				{ text: 'Stop and recover', values: { compassion: 3, harmony: 1 }, nextId: 'hd4b' }
			]
		},
		hd4a: {
			id: 'hd4a',
			type: 'deep',
			text: 'Pushing risks long-term harm. Do it anyway?',
			options: [
				{ text: 'Still push', values: { ambition: 2, freedom: 2 }, nextId: 'hd5' },
				{ text: 'Back off', values: { security: 2, honesty: 1 }, nextId: 'hd5' }
			]
		},
		hd4b: {
			id: 'hd4b',
			type: 'deep',
			text: 'Resting means missing a chance. Accept it?',
			options: [
				{ text: 'Accept it', values: { harmony: 2, security: 2 }, nextId: 'hd5' },
				{ text: 'Reschedule anyway', values: { ambition: 2, honesty: 1 }, nextId: 'hd5' }
			]
		},
		hd5: {
			id: 'hd5',
			type: 'deep',
			text: 'In a crisis, do you choose health or duty?',
			options: [
				{ text: 'Health first', values: { security: 3, compassion: 1 } },
				{ text: 'Duty first', values: { loyalty: 2, justice: 1 } }
			]
		}
	}
};

const adventureInstinct: QuestionGraph = {
	rootId: 'ai1',
	length: 5,
	questions: {
		ai1: {
			id: 'ai1',
			type: 'instinct',
			text: 'A friend offers a last-minute trip with no plan. Go?',
			options: [
				{ text: 'Go now', values: { freedom: 3, ambition: 1 }, nextId: 'ai2a' },
				{ text: 'Decline', values: { security: 3, harmony: 1 }, nextId: 'ai2b' }
			],
			timeLimit: 5
		},
		ai2a: {
			id: 'ai2a',
			type: 'instinct',
			text: 'The trip clashes with a family event. Still go?',
			options: [
				{ text: 'Go anyway', values: { freedom: 3, ambition: 1 }, nextId: 'ai3' },
				{ text: 'Stay for family', values: { loyalty: 3, harmony: 1 }, nextId: 'ai3' }
			],
			timeLimit: 5
		},
		ai2b: {
			id: 'ai2b',
			type: 'instinct',
			text: 'You say no but feel stuck. Plan a big trip?',
			options: [
				{ text: 'Plan a big trip', values: { ambition: 2, freedom: 2 }, nextId: 'ai3' },
				{ text: 'Keep routines', values: { security: 3, harmony: 1 }, nextId: 'ai3' }
			],
			timeLimit: 5
		},
		ai3: {
			id: 'ai3',
			type: 'instinct',
			text: 'Do you explore solo or with a group?',
			options: [
				{ text: 'Solo', values: { freedom: 3, honesty: 1 }, nextId: 'ai4a' },
				{ text: 'Group', values: { harmony: 3, loyalty: 1 }, nextId: 'ai4b' }
			],
			timeLimit: 5
		},
		ai4a: {
			id: 'ai4a',
			type: 'instinct',
			text: 'The solo route is risky but rewarding. Take it?',
			options: [
				{ text: 'Take the risk', values: { freedom: 3, ambition: 1 }, nextId: 'ai5' },
				{ text: 'Choose safer path', values: { security: 3, compassion: 1 }, nextId: 'ai5' }
			],
			timeLimit: 5
		},
		ai4b: {
			id: 'ai4b',
			type: 'instinct',
			text: 'The group wants to ignore a local rule. Push back?',
			options: [
				{ text: 'Push back', values: { justice: 2, honesty: 2 }, nextId: 'ai5' },
				{ text: 'Go along', values: { loyalty: 2, harmony: 2 }, nextId: 'ai5' }
			],
			timeLimit: 5
		},
		ai5: {
			id: 'ai5',
			type: 'instinct',
			text: 'While traveling, do you share your location with family?',
			options: [
				{ text: 'Share it', values: { security: 2, compassion: 2 } },
				{ text: 'Keep it private', values: { freedom: 3, honesty: 1 } }
			],
			timeLimit: 5
		}
	}
};

const adventureTradeoff: QuestionGraph = {
	rootId: 'at1',
	length: 5,
	questions: {
		at1: {
			id: 'at1',
			type: 'tradeoff',
			text: 'Do you prefer a planned itinerary or open-ended travel?',
			options: [
				{ text: 'Planned', values: { security: 3, harmony: 1 }, nextId: 'at2a' },
				{ text: 'Open-ended', values: { freedom: 3, ambition: 1 }, nextId: 'at2b' }
			]
		},
		at2a: {
			id: 'at2a',
			type: 'tradeoff',
			text: 'A plan blocks a chance encounter. Break the plan?',
			options: [
				{ text: 'Break plan', values: { freedom: 2, compassion: 2 }, nextId: 'at3' },
				{ text: 'Stick to plan', values: { security: 3, loyalty: 1 }, nextId: 'at3' }
			]
		},
		at2b: {
			id: 'at2b',
			type: 'tradeoff',
			text: 'Open-ended travel busts your budget. Cut the trip short?',
			options: [
				{ text: 'Cut short', values: { security: 3, honesty: 1 }, nextId: 'at3' },
				{ text: 'Extend anyway', values: { ambition: 2, freedom: 2 }, nextId: 'at3' }
			]
		},
		at3: {
			id: 'at3',
			type: 'tradeoff',
			text: 'On a trip, do you lead the group or follow?',
			options: [
				{ text: 'Lead', values: { ambition: 2, justice: 1 }, nextId: 'at4a' },
				{ text: 'Follow', values: { harmony: 2, loyalty: 2 }, nextId: 'at4b' }
			]
		},
		at4a: {
			id: 'at4a',
			type: 'tradeoff',
			text: 'Leading raises risk for others. Accept it?',
			options: [
				{ text: 'Accept risk', values: { justice: 2, security: 2 }, nextId: 'at5' },
				{ text: 'Step back', values: { harmony: 2, compassion: 2 }, nextId: 'at5' }
			]
		},
		at4b: {
			id: 'at4b',
			type: 'tradeoff',
			text: 'The leader ignores safety advice. Speak up?',
			options: [
				{ text: 'Speak up', values: { honesty: 3, justice: 1 }, nextId: 'at5' },
				{ text: 'Go with it', values: { loyalty: 2, security: 1 }, nextId: 'at5' }
			]
		},
		at5: {
			id: 'at5',
			type: 'tradeoff',
			text: 'Do you trade comfort for discovery?',
			options: [
				{ text: 'Discovery', values: { freedom: 3, ambition: 1 } },
				{ text: 'Comfort', values: { security: 3, harmony: 1 } }
			]
		}
	}
};

const adventureDeep: QuestionGraph = {
	rootId: 'ad1',
	length: 5,
	questions: {
		ad1: {
			id: 'ad1',
			type: 'deep',
			text: 'You find an untouched place. Share its location with others?',
			options: [
				{ text: 'Share it', values: { ambition: 2, freedom: 2 }, nextId: 'ad2a' },
				{ text: 'Keep it secret', values: { security: 2, compassion: 2 }, nextId: 'ad2b' }
			]
		},
		ad2a: {
			id: 'ad2a',
			type: 'deep',
			text: 'Sharing damages the place. Apologize publicly?',
			options: [
				{ text: 'Apologize', values: { honesty: 3, justice: 1 }, nextId: 'ad3' },
				{ text: 'Leave it up', values: { ambition: 2, freedom: 1 }, nextId: 'ad3' }
			]
		},
		ad2b: {
			id: 'ad2b',
			type: 'deep',
			text: 'You could profit by guiding tours there. Do it?',
			options: [
				{ text: 'Run tours', values: { ambition: 3, security: 1 }, nextId: 'ad3' },
				{ text: 'Refuse', values: { loyalty: 2, harmony: 2 }, nextId: 'ad3' }
			]
		},
		ad3: {
			id: 'ad3',
			type: 'deep',
			text: 'A risky rescue needs volunteers. Do you go?',
			options: [
				{ text: 'Go', values: { compassion: 3, justice: 1 }, nextId: 'ad4a' },
				{ text: 'Stay back', values: { security: 3, honesty: 1 }, nextId: 'ad4b' }
			]
		},
		ad4a: {
			id: 'ad4a',
			type: 'deep',
			text: 'The rescue ends your trip. Continue anyway?',
			options: [
				{ text: 'Continue rescue', values: { compassion: 2, loyalty: 2 }, nextId: 'ad5' },
				{ text: 'Return to plan', values: { ambition: 2, freedom: 2 }, nextId: 'ad5' }
			]
		},
		ad4b: {
			id: 'ad4b',
			type: 'deep',
			text: 'Staying back brings guilt. Donate resources?',
			options: [
				{ text: 'Donate', values: { compassion: 2, justice: 1 }, nextId: 'ad5' },
				{ text: 'Keep resources', values: { security: 2, freedom: 1 }, nextId: 'ad5' }
			]
		},
		ad5: {
			id: 'ad5',
			type: 'deep',
			text: 'Long term, do you choose freedom or responsibility?',
			options: [
				{ text: 'Freedom', values: { freedom: 3, ambition: 1 } },
				{ text: 'Responsibility', values: { loyalty: 2, security: 2 } }
			]
		}
	}
};

export const questionTracks: Record<AllocationCategory, QuestionTrack> = {
	Career: {
		instinct: careerInstinct,
		tradeoff: careerTradeoff,
		deep: careerDeep
	},
	Relationships: {
		instinct: relationshipsInstinct,
		tradeoff: relationshipsTradeoff,
		deep: relationshipsDeep
	},
	Health: {
		instinct: healthInstinct,
		tradeoff: healthTradeoff,
		deep: healthDeep
	},
	Adventure: {
		instinct: adventureInstinct,
		tradeoff: adventureTradeoff,
		deep: adventureDeep
	}
} as const;
