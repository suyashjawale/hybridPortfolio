import { roles } from "./roles";

export interface organization {
	org_name: string,
	selectedInd: number,
	joined_date: Date,
	end_date: Date | string,
	logo_name: string,
	roles: roles[]
}
