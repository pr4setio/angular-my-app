import {Injectable} from "@angular/core";

declare let _:any;
@Injectable()
export class PagerService {
    totalPages:number;
    startIndex:number;
    endIndex:number;
    totalData:number;

    getPager(currentPage:number = 1) {
        let startPage:number, endPage:number;

        if (this.totalPages <= 5) {
            startPage = 1;
            endPage = this.totalPages;
        } else {
            if (currentPage <= 3) {
                startPage = 1;
                endPage = 5;
            } else if (currentPage + 2 >= this.totalPages) {
                startPage = this.totalPages - 4;
                endPage = this.totalPages;
            } else {
                startPage = currentPage - 2;
                endPage = currentPage + 2;
            }
        }
        let pages = _.range(startPage, endPage + 1);
        return {
            totalPages: this.totalPages,
            totalData: this.totalData,
            startIndex: this.startIndex,
            endIndex: this.endIndex,
            currentPage: currentPage,
            pages: pages
        }
    }
}
