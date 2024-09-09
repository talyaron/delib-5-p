interface ColorMappings {
  [key: string]: string;
}

export const colorMappings: ColorMappings = {
	// Agreement range
	"--range-positive-100": "--range-positive-100-contrast",
	"--range-positive-60": "--range-positive-60-contrast",
	"--range-positive-30": "--range-positive-30-contrast",

	// Conflict range
	"--range-conflict-100": "--range-conflict-100-contrast",
	"--range-conflict-60": "--range-conflict-60-contrast",
	"--range-conflict-30": "--range-conflict-30-contrast",

	// Tabu range
	"--range-tabu-100": "--range-tabu-100-contrast",
	"--range-tabu-60": "--range-tabu-60-contrast",
	"--range-tabu-30": "--range-tabu-30-contrast",

	// Hover agreement range
	"--range-hover-positive-100": "--range-hover-positive-100-contrast",
	"--range-hover-positive-60": "--range-hover-positive-60-contrast",
	"--range-hover-positive-30": "--range-hover-positive-30-contrast",

	// Hover conflict range
	"--range-hover-conflict-100": "--range-conflict-100-contrast",
	"--range-hover-conflict-60": "--range-conflict-60-contrast",
	"--range-hover-conflict-30": "--range-conflict-30-contrast",

	// Hover tabu range
	"--range-hover-tabu-100": "--range-tabu-100-contrast",
	"--range-hover-tabu-60": "--range-tabu-60-contrast",
	"--range-hover-tabu-30": "--range-tabu-30-contrast",

	// Base
	"--bg-screen": "--bg-screen-contrast",
	"--bg-overlay": "--bg-overlay-contrast",

	// Buttons
	"--btn-primary": "--btn-primary-contrast",
	"--btn-secondary": "--btn-secondary-contrast",
	"--btn-tertiary": "--btn-tertiary-contrast",
	"--btn-follow-me": "--btn-follow-me-contrast",
	"--btn-fab": "--btn-fab-contrast",
	"--btn-primary-blue": "--btn-primary-blue-contrast",
	"--btn-secondary-blue": "--btn-secondary-blue-contrast",
	"--btn-tertiary-blue": "--btn-tertiary-blue-contrast",
	"--btn-tertiary-red": "--btn-tertiary-red-contrast",

	// Card menu
	"--card-menu": "--card-menu-contrast",
	"--card-menu-stroke": "--card-menu-stroke-contrast",
	"--menu-chosen": "--menu-chosen-contrast",
	"--added-option": "--added-option-contrast",
	"--added-question": "--added-question-contrast",
	"--drag-drop-bg": "--drag-drop-bg-contrast",

	// Emojis
	"--emoji-happy": "--emoji-happy-contrast",
	"--emoji-smiley": "--emoji-smiley-contrast",
	"--emoji-neutral": "--emoji-neutral-contrast",
	"--emoji-thinking": "--emoji-thinking-contrast",
	"--emoji-sad": "--emoji-sad-contrast",

	// Headers
	"--question-header": "--question-header-contrast",
	"--header-bg-color": "--header-bg-color-contrast",
	"--header-question": "--header-question-contrast",
	"--header-option-chosen": "--header-option-chosen-contrast",
	"--header-option-non-chosen": "--header-option-non-chosen-contrast",
	"--header-home": "--header-home-contrast",
	"--header-search-chips": "--header-search-chips-contrast",

	// Icons
	"--icon-white": "--icon-white-contrast",
	"--icon-blue": "--icon-blue-contrast",
	"--icon-blue-light": "--icon-blue-light-contrast",
	"--icon-red": "--icon-red-contrast",
	"--icon-green": "--icon-green-contrast",
	"--icon-disabled-outline": "--icon-disabled-outline-contrast",
	"--icon-disabled-filled": "--icon-disabled-filled-contrast",
	"--icon-disabled-dark": "--icon-disabled-dark-contrast",

	// Info
	"--info-snackbar": "--info-snackbar-contrast",
	"--info-massage-counter": "--info-massage-counter-contrast",
	"--info-tooltip": "--info-tooltip-contrast",

	// Maps
	"--map-question": "--map-question-contrast",
	"--map-option": "--map-option-contrast",
	"--map-option-chosen": "--map-option-chosen-contrast",
	"--map-option-current": "--map-option-current-contrast",
	"--map-question-current": "--map-question-current-contrast",

	// Multisteps
	"--step-vote-inactive": "--step-vote-inactive-contrast",
	"--step-vote-active": "--step-vote-active-contrast",
	"--step-evaluate-inactive": "--step-evaluate-inactive-contrast",
	"--step-evaluate-active": "--step-evaluate-active-contrast",
	"--step-explanation-inactive": "--step-explanation-inactive-contrast",
	"--step-explanation-active": "--step-explanation-active-contrast",
	"--step-option-inactive": "--step-option-inactive-contrast",
	"--step-option-active": "--step-option-active-contrast",
	"--step-top-rank-inactive": "--step-top-rank-inactive-contrast",
	"--step-top-rank-active": "--step-top-rank-active-contrast",
	"--step-joined-members-active": "--step-joined-members-active-contrast",
	"--step-summary-active": "--step-summary-active-contrast",

	// Settings
	"--member-chip": "--member-chip-contrast",
	"--member-voter": "--member-voter-contrast",
	"--member-evaluators": "--member-evaluators-contrast",
	"--member-non-voter": "--member-non-voter-contrast",
	"--member-blocked": "--member-blocked-contrast",
	"--section-tab": "--section-tab-contrast",

	// Toggles
	"--toggle-blue-active": "--toggle-blue-active-contrast",
	"--toggle-green-active": "--toggle-green-active-contrast",
	"--toggle-crimson-active": "--toggle-crimson-active-contrast",
	"--toggle-inactive": "--toggle-inactive-contrast",
	"--toggle-inactive-icon": "--toggle-inactive-icon-contrast",

	// Triangle dots
	"--dot-agreement-100": "--dot-agreement-100-contrast",
	"--dot-agreement-50": "--dot-agreement-50-contrast",
	"--dot-agreement-0": "--dot-agreement-0-contrast",
	"--dot-taboo-50": "--dot-taboo-50-contrast",
	"--dot-taboo-100": "--dot-taboo-100-contrast",
	"--dot-disinterest": "--dot-disinterest-contrast",

	// Text
	"--text-headline": "--text-headline-contrast",
	"--text-paragraph": "--text-paragraph-contrast",
	"--text-paragraph-light": "--text-paragraph-light-contrast",
	"--text-paragraph-lightest": "--text-paragraph-lightest-contrast",
	"--text-white": "--text-white-contrast",
	"--text-blue": "--text-blue-contrast",
	"--text-green": "--text-green-contrast",
	"--text-red": "--text-red-contrast",
	"--text-crimson": "--text-crimson-contrast",
	"--text-emphasis": "--text-emphasis-contrast",
	"--text-dark-btn": "--text-dark-btn-contrast",
	"--text-light-btn": "--text-light-btn-contrast",
	"--text-disabled-paragraph": "--text-disabled-paragraph-contrast",
	"--text-disabled-light": "--text-disabled-light-contrast",
	"--text-disabled-digit": "--text-disabled-digit-contrast",
	"--text-triangle-taboo": "--text-triangle-taboo-contrast",
};
