import {
	ALLOCATION_WEIGHT_SCALE,
	allocationCategories,
	categoryValueMap,
	questionTracks,
	type AllocationCategory,
	type QuestionGraph,
	type QuestionTrack,
	type Value
} from './questions';

export interface Archetype {
	id: string;
	name: string;
	tagline: string;
	description: string;
	primaryValues: Value[];
	strengths: string[];
	blindSpots: string[];
	color: string;
	clashWith: string;
	vibeWith: string;
}

export const archetypes: Archetype[] = [
	{
		id: 'guardian',
		name: 'The Guardian',
		tagline: 'Protector of what matters most',
		description:
			'You prioritize those closest to you above abstract principles. Your loyalty runs deep, and you believe that taking care of your own is the foundation of a meaningful life.',
		primaryValues: ['loyalty', 'security'],
		strengths: ['Unwavering support for loved ones', 'Reliable in crisis', 'Strong sense of duty'],
		blindSpots: ['May overlook broader injustices', 'Can enable harmful behavior in loved ones'],
		color: '#2563eb',
		clashWith: 'crusader',
		vibeWith: 'sage'
	},
	{
		id: 'crusader',
		name: 'The Crusader',
		tagline: "Champion of what's right",
		description:
			'You believe in principles that transcend personal relationships. Justice and honesty guide your decisions, even when they come at personal cost.',
		primaryValues: ['justice', 'honesty'],
		strengths: ['Moral clarity', 'Courage to stand alone', 'Consistent principles'],
		blindSpots: ['May damage relationships for principles', 'Can seem cold or inflexible'],
		color: '#dc2626',
		clashWith: 'guardian',
		vibeWith: 'maverick'
	},
	{
		id: 'empath',
		name: 'The Empath',
		tagline: 'Heart-first decision maker',
		description:
			'Compassion drives your choices. You feel deeply for others and prioritize reducing suffering, even for strangers. Harmony matters more than being right.',
		primaryValues: ['compassion', 'harmony'],
		strengths: ['Deep emotional intelligence', 'Natural peacemaker', 'Inclusive mindset'],
		blindSpots: ['May avoid necessary conflict', 'Can be taken advantage of'],
		color: '#059669',
		clashWith: 'architect',
		vibeWith: 'sage'
	},
	{
		id: 'architect',
		name: 'The Architect',
		tagline: 'Builder of tomorrow',
		description:
			"You're driven to achieve and create. Ambition isn't a dirty word to you—it's how progress happens. You believe in earning your place.",
		primaryValues: ['ambition', 'freedom'],
		strengths: ['Goal-oriented', 'Self-motivated', 'Visionary thinking'],
		blindSpots: ['May prioritize success over relationships', 'Can justify questionable means'],
		color: '#7c3aed',
		clashWith: 'empath',
		vibeWith: 'maverick'
	},
	{
		id: 'sage',
		name: 'The Sage',
		tagline: 'Seeker of balance',
		description:
			"You value stability and thoughtful consideration. Security isn't about fear—it's about building a foundation that lets you and others thrive.",
		primaryValues: ['security', 'harmony'],
		strengths: ['Thoughtful decision-making', 'Long-term thinking', 'Calming presence'],
		blindSpots: ['May resist necessary change', 'Can be overly cautious'],
		color: '#0891b2',
		clashWith: 'maverick',
		vibeWith: 'guardian'
	},
	{
		id: 'maverick',
		name: 'The Maverick',
		tagline: 'Breaker of chains',
		description:
			'Freedom is your north star. You resist constraints and believe everyone should forge their own path. Convention is just a suggestion.',
		primaryValues: ['freedom', 'honesty'],
		strengths: ['Independent thinking', 'Authentic self-expression', 'Challenges status quo'],
		blindSpots: ['May reject helpful structure', 'Can seem unreliable to others'],
		color: '#ea580c',
		clashWith: 'sage',
		vibeWith: 'architect'
	}
];

export interface ValueScores {
	loyalty: number;
	justice: number;
	compassion: number;
	ambition: number;
	security: number;
	freedom: number;
	honesty: number;
	harmony: number;
}

export function calculateArchetype(
	scores: ValueScores,
	answers?: { questionId: string; optionIndex: number }[]
): Archetype {
	const normalizedScores = normalizeScores(scores, answers);
	let bestMatch = archetypes[0];
	let bestScore = -Infinity;

	for (const archetype of archetypes) {
		let score = 0;
		for (const value of archetype.primaryValues) {
			score += normalizedScores[value] * 2;
		}
		// Add secondary influence from all values
		for (const [key, val] of Object.entries(normalizedScores)) {
			if (!archetype.primaryValues.includes(key as Value)) {
				score += val * 0.5;
			}
		}

		if (score > bestScore) {
			bestScore = score;
			bestMatch = archetype;
		}
	}

	return bestMatch;
}

export function getTopValues(
	scores: ValueScores,
	count: number = 3
): { value: Value; score: number }[] {
	return Object.entries(scores)
		.map(([value, score]) => ({ value: value as Value, score }))
		.sort((a, b) => b.score - a.score)
		.slice(0, count);
}

export function getValueLabel(value: Value): string {
	const labels: Record<Value, string> = {
		loyalty: 'Loyalty',
		justice: 'Justice',
		compassion: 'Compassion',
		ambition: 'Ambition',
		security: 'Security',
		freedom: 'Freedom',
		honesty: 'Honesty',
		harmony: 'Harmony'
	};
	return labels[value];
}

export function getArchetypeById(id: string): Archetype | undefined {
	return archetypes.find((a) => a.id === id);
}

const CONTRADICTION_THRESHOLD_RATIO = 0.6;

function createEmptyScores(): ValueScores {
	return {
		loyalty: 0,
		justice: 0,
		compassion: 0,
		ambition: 0,
		security: 0,
		freedom: 0,
		honesty: 0,
		harmony: 0
	};
}

function addValueScores(base: ValueScores, addition: ValueScores): ValueScores {
	return {
		loyalty: base.loyalty + addition.loyalty,
		justice: base.justice + addition.justice,
		compassion: base.compassion + addition.compassion,
		ambition: base.ambition + addition.ambition,
		security: base.security + addition.security,
		freedom: base.freedom + addition.freedom,
		honesty: base.honesty + addition.honesty,
		harmony: base.harmony + addition.harmony
	};
}

function addPartialScores(
	base: ValueScores,
	addition: Partial<Record<Value, number>>
): ValueScores {
	const next = { ...base };
	for (const [value, points] of Object.entries(addition)) {
		next[value as Value] += points ?? 0;
	}
	return next;
}

function maxByValue(a: ValueScores, b: ValueScores): ValueScores {
	return {
		loyalty: Math.max(a.loyalty, b.loyalty),
		justice: Math.max(a.justice, b.justice),
		compassion: Math.max(a.compassion, b.compassion),
		ambition: Math.max(a.ambition, b.ambition),
		security: Math.max(a.security, b.security),
		freedom: Math.max(a.freedom, b.freedom),
		honesty: Math.max(a.honesty, b.honesty),
		harmony: Math.max(a.harmony, b.harmony)
	};
}

function getMaxScoresForGraph(graph: QuestionGraph): ValueScores {
	const memo = new Map<string, ValueScores>();

	const walk = (questionId: string): ValueScores => {
		const cached = memo.get(questionId);
		if (cached) return cached;

		const question = graph.questions[questionId];
		if (!question) return createEmptyScores();

		let best = createEmptyScores();
		for (const option of question.options) {
			const nextScores = option.nextId ? walk(option.nextId) : createEmptyScores();
			const candidate = addPartialScores(nextScores, option.values);
			best = maxByValue(best, candidate);
		}

		memo.set(questionId, best);
		return best;
	};

	return walk(graph.rootId);
}

function getMaxScoresForTrack(track: QuestionTrack): ValueScores {
	const instinctMax = getMaxScoresForGraph(track.instinct);
	const tradeoffMax = getMaxScoresForGraph(track.tradeoff);
	const deepMax = getMaxScoresForGraph(track.deep);
	return addValueScores(addValueScores(instinctMax, tradeoffMax), deepMax);
}

function getAllocationValueScores(
	allocation: Record<AllocationCategory, number>
): ValueScores {
	const scores = createEmptyScores();
	for (const [category, points] of Object.entries(allocation)) {
		const valueMap = categoryValueMap[category as AllocationCategory];
		if (valueMap) {
			for (const [value, weight] of Object.entries(valueMap)) {
				scores[value as Value] += Math.floor(
					(points / 12) * weight * ALLOCATION_WEIGHT_SCALE
				);
			}
		}
	}
	return scores;
}

function getTopAllocationCategory(
	allocation: Record<AllocationCategory, number>
): AllocationCategory {
	const entries = Object.entries(allocation) as [AllocationCategory, number][];
	entries.sort((a, b) => {
		const diff = b[1] - a[1];
		if (diff !== 0) return diff;
		return allocationCategories.indexOf(a[0]) - allocationCategories.indexOf(b[0]);
	});
	return entries[0]?.[0] ?? allocationCategories[0];
}

function getAllocationMaxScoresForTrack(track: AllocationCategory): ValueScores {
	let best = createEmptyScores();

	for (let career = 0; career <= 12; career++) {
		for (let relationships = 0; relationships <= 12 - career; relationships++) {
			for (let health = 0; health <= 12 - career - relationships; health++) {
				const adventure = 12 - career - relationships - health;
				const allocation: Record<AllocationCategory, number> = {
					Career: career,
					Relationships: relationships,
					Health: health,
					Adventure: adventure
				};
				if (getTopAllocationCategory(allocation) !== track) continue;
				const scores = getAllocationValueScores(allocation);
				best = maxByValue(best, scores);
			}
		}
	}

	return best;
}

const trackAllocationMaxScores = Object.fromEntries(
	allocationCategories.map((category) => [category, getAllocationMaxScoresForTrack(category)])
) as Record<AllocationCategory, ValueScores>;

const trackMaxScores = Object.fromEntries(
	allocationCategories.map((category) => {
		const trackMax = getMaxScoresForTrack(questionTracks[category]);
		return [category, addValueScores(trackMax, trackAllocationMaxScores[category])];
	})
) as Record<AllocationCategory, ValueScores>;

const overallMaxScores = allocationCategories.reduce((maxScores, category) => {
	return maxByValue(maxScores, trackMaxScores[category]);
}, createEmptyScores());

function normalizeScores(
	scores: ValueScores,
	answers?: { questionId: string; optionIndex: number }[]
): ValueScores {
	const track = answers && answers.length ? getTrackFromAnswers(answers) : null;
	const maxScores = track ? trackMaxScores[track] : overallMaxScores;
	return {
		loyalty: maxScores.loyalty ? Math.min(scores.loyalty / maxScores.loyalty, 1) : 0,
		justice: maxScores.justice ? Math.min(scores.justice / maxScores.justice, 1) : 0,
		compassion: maxScores.compassion
			? Math.min(scores.compassion / maxScores.compassion, 1)
			: 0,
		ambition: maxScores.ambition ? Math.min(scores.ambition / maxScores.ambition, 1) : 0,
		security: maxScores.security ? Math.min(scores.security / maxScores.security, 1) : 0,
		freedom: maxScores.freedom ? Math.min(scores.freedom / maxScores.freedom, 1) : 0,
		honesty: maxScores.honesty ? Math.min(scores.honesty / maxScores.honesty, 1) : 0,
		harmony: maxScores.harmony ? Math.min(scores.harmony / maxScores.harmony, 1) : 0
	};
}

function getTrackFromAnswers(
	answers: { questionId: string; optionIndex: number }[]
): AllocationCategory | null {
	const firstId = answers.find((answer) => answer.questionId.length >= 2)?.questionId;
	if (!firstId) return null;
	switch (firstId[0]) {
		case 'c':
			return 'Career';
		case 'r':
			return 'Relationships';
		case 'h':
			return 'Health';
		case 'a':
			return 'Adventure';
		default:
			return null;
	}
}

function getContradictionThresholds(
	answers: { questionId: string; optionIndex: number }[]
): ValueScores {
	const track = getTrackFromAnswers(answers);
	const maxScores = track ? trackMaxScores[track] : overallMaxScores;
	const ratio = CONTRADICTION_THRESHOLD_RATIO;
	return {
		loyalty: Math.max(1, Math.floor(maxScores.loyalty * ratio)),
		justice: Math.max(1, Math.floor(maxScores.justice * ratio)),
		compassion: Math.max(1, Math.floor(maxScores.compassion * ratio)),
		ambition: Math.max(1, Math.floor(maxScores.ambition * ratio)),
		security: Math.max(1, Math.floor(maxScores.security * ratio)),
		freedom: Math.max(1, Math.floor(maxScores.freedom * ratio)),
		honesty: Math.max(1, Math.floor(maxScores.honesty * ratio)),
		harmony: Math.max(1, Math.floor(maxScores.harmony * ratio))
	};
}

export interface Contradiction {
	title: string;
	description: string;
	values: [Value, Value];
}

export function findContradictions(
	scores: ValueScores,
	answers: { questionId: string; optionIndex: number }[]
): Contradiction[] {
	const contradictions: Contradiction[] = [];
	if (answers.length === 0) return contradictions;

	const thresholds = getContradictionThresholds(answers);

	// Check for loyalty vs justice contradiction
	if (scores.loyalty >= thresholds.loyalty && scores.justice >= thresholds.justice) {
		contradictions.push({
			title: 'The Loyalty Paradox',
			description:
				'You value both loyalty and justice highly, but chose loyalty over justice in key moments.',
			values: ['loyalty', 'justice']
		});
	}

	// Check for ambition vs harmony
	if (scores.ambition >= thresholds.ambition && scores.harmony >= thresholds.harmony) {
		contradictions.push({
			title: "The Achiever's Dilemma",
			description:
				'You seek both success and peace, but your choices lean toward ambition when forced to pick.',
			values: ['ambition', 'harmony']
		});
	}

	// Check for freedom vs security
	if (scores.freedom >= thresholds.freedom && scores.security >= thresholds.security) {
		contradictions.push({
			title: "The Wanderer's Anchor",
			description:
				'You crave both freedom and stability—a tension that shapes many of your decisions.',
			values: ['freedom', 'security']
		});
	}

	// Check for honesty vs compassion
	if (scores.honesty >= thresholds.honesty && scores.compassion >= thresholds.compassion) {
		contradictions.push({
			title: 'Truth vs Kindness',
			description:
				'You believe in honesty but also want to protect feelings. Sometimes these collide.',
			values: ['honesty', 'compassion']
		});
	}

	return contradictions;
}
