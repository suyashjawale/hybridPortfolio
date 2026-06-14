import { projects } from "./projects";

export interface roles {
	role_name: string,
	role_start: Date,
	role_end: Date | string,
	tag_line: string,
	projects: projects[]
}

