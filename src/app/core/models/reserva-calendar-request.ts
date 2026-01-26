import { FilterModel } from "./filter.model";

export interface ReservaCalendarRequest {
    start: string;
    end: string;
    filters: FilterModel[]
}