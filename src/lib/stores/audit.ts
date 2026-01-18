import { writable, get } from 'svelte/store';
import type { Value, AllocationCategory } from '../data/questions';
import { ALLOCATION_WEIGHT_SCALE, categoryValueMap } from '../data/questions';
import type { ValueScores } from '../data/archetypes';

export interface Answer {
	questionId: string;
	optionIndex: number;
	optionText: string;
	values: Partial<Record<Value, number>>;
	timestamp: number;
	responseTime: number;
}

export interface AuditState {
	answers: Answer[];
	allocation: Record<AllocationCategory, number>;
	startTime: number | null;
	endTime: number | null;
	currentPhase: 'instinct' | 'allocation' | 'tradeoff' | 'deep' | 'complete';
}

const initialState: AuditState = {
	answers: [],
	allocation: {
		Career: 0,
		Relationships: 0,
		Health: 0,
		Adventure: 0
	},
	startTime: null,
	endTime: null,
	currentPhase: 'instinct'
};

function createAuditStore() {
	const { subscribe, set, update } = writable<AuditState>(initialState);

	return {
		subscribe,
		start: () =>
			update((state) => ({
				...state,
				startTime: Date.now(),
				answers: [],
				allocation: { ...initialState.allocation },
				endTime: null,
			})),
		addAnswer: (
			questionId: string,
			optionIndex: number,
			optionText: string,
			values: Partial<Record<Value, number>>,
			responseTime: number
		) =>
			update((state) => ({
				...state,
				answers: [
					...state.answers,
					{
						questionId,
						optionIndex,
						optionText,
						values,
						timestamp: Date.now(),
						responseTime
					}
				]
			})),
		setAllocation: (allocation: Record<AllocationCategory, number>) =>
			update((state) => ({
				...state,
				allocation
			})),
		setPhase: (phase: AuditState['currentPhase']) =>
			update((state) => ({
				...state,
				currentPhase: phase
			})),
		complete: () =>
			update((state) => ({
				...state,
				endTime: Date.now(),
				currentPhase: 'complete'
			})),
		reset: () => set(initialState),

		// Computed helpers
		getValueScores: (): ValueScores => {
			const state = get({ subscribe });
			const scores: ValueScores = {
				loyalty: 0,
				justice: 0,
				compassion: 0,
				ambition: 0,
				security: 0,
				freedom: 0,
				honesty: 0,
				harmony: 0
			};

			// Add scores from answers
			for (const answer of state.answers) {
				for (const [value, points] of Object.entries(answer.values)) {
					scores[value as Value] += points;
				}
			}

			// Add scores from allocation (weighted by focus points allocated)
			for (const [category, points] of Object.entries(state.allocation)) {
				const valueMap = categoryValueMap[category as AllocationCategory];
				if (valueMap) {
					for (const [value, weight] of Object.entries(valueMap)) {
						// Scale by allocation (more points = more weight)
						scores[value as Value] += Math.floor(
							(points / 12) * weight * ALLOCATION_WEIGHT_SCALE
						);
					}
				}
			}

			return scores;
		},

		getStats: () => {
			const state = get({ subscribe });
			const answers = state.answers;

			if (answers.length === 0) {
				return {
					totalTime: 0,
					avgResponseTime: 0,
					fastestResponse: 0,
					slowestResponse: 0,
					instinctAnswers: 0,
					timedOutAnswers: 0
				};
			}

			const responseTimes = answers.map((a) => a.responseTime);
			const totalTime = state.endTime && state.startTime ? state.endTime - state.startTime : 0;

			return {
				totalTime,
				avgResponseTime: responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length,
				fastestResponse: Math.min(...responseTimes),
				slowestResponse: Math.max(...responseTimes),
				instinctAnswers: answers.filter((a) => a.questionId[1] === 'i').length,
				timedOutAnswers: answers.filter(
					(a) => a.responseTime >= 5000 && a.questionId[1] === 'i'
				).length
			};
		}
	};
}

export const auditStore = createAuditStore();
