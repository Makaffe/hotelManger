import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';

const count = 5;
const fakeDataUrl = 'https://randomuser.me/api/?results=5&inc=name,gender,email,nat&noinfo';

@Component({
    selector: 'app-userComment',
    templateUrl: './userComment.component.html',
    styles: [
        `
          .demo-loadmore-list {
            min-height: 350px;
          }
          .loadmore {
            text-align: center;
            margin-top: 12px;
            height: 32px;
            line-height: 32px;
          }
        `
    ]
})
export class userCommentComponent implements OnInit {
    initLoading = true; // bug
    loadingMore = false;
    data: any[] = [];
    list: Array<{ loading: boolean; name: any }> = [];

    constructor(private http: HttpClient, private msg: NzMessageService) { }

    ngOnInit(): void {
        this.getData((res: any) => {
            this.data = res.results;
            this.list = res.results;
            this.initLoading = false;
        });
    }

    getData(callback: (res: any) => void): void {
        this.http.get(fakeDataUrl).subscribe((res: any) => callback(res));
    }

    onLoadMore(): void {
        this.loadingMore = true;
        this.list = this.data.concat([...Array(count)].fill({}).map(() => ({ loading: true, name: {} })));
        this.http.get(fakeDataUrl).subscribe((res: any) => {
            this.data = this.data.concat(res.results);
            this.list = [...this.data];
            this.loadingMore = false;
        });
    }

    edit(item: any): void {
        this.msg.success(item.email);
    }
}
