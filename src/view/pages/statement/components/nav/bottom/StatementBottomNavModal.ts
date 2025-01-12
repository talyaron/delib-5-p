import { SortType } from "delib-npm";

export interface NavItem {
	link: SortType;
	name: string;
	id: SortType;
}
export const sortItems: NavItem[] = [
	{
		link: SortType.newest,
		name: "New",
		id: SortType.newest,
	},
	{
		link: SortType.mostUpdated,
		name: "Update",
		id: SortType.mostUpdated,
	},
	{
		link: SortType.random,
		name: "Random",
		id: SortType.random,
	},
	{
		link: SortType.accepted,
		name: "Agreement",
		id: SortType.accepted,
	},

];
