import { FilterModel } from "./filter.model";
import { SortModel } from "./sort.model";

export interface PaginationModel {
    pageNumber: number,
    rowsPerPage: number,
    filters: FilterModel[],
    sorts: SortModel[]
}