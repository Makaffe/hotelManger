import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { UserCommentDTO } from '../model/UserCommentDTO';
import { UserCommentService } from '../service/UserCommentService';
import { CommentDetailComponent } from './comment-detail.component';

@Component({
  selector: 'app-user-Comment',
  templateUrl: './userComment.component.html',
})
// tslint:disable-next-line:class-name
export class userCommentComponent implements OnInit {
  @ViewChild('commentDetail', { static: false })
  commentDetailComponent: CommentDetailComponent;
  listData = [];

  // 树形表格
  mapOfExpandedData: { [id: string]: any[] } = {};

  collapse(array: any[], data: any, $event: boolean): void {
    if ($event === false) {
      if (data.children) {
        data.children.forEach((d) => {
          // tslint:disable-next-line:no-non-null-assertion
          const target = array.find((a) => a.id === d.id)!;
          target.expand = false;
          this.collapse(array, target, false);
        });
      } else {
        return;
      }
    }
  }

  convertTreeToList(root: any): any[] {
    const stack: any[] = [];
    const array: any[] = [];
    const hashMap = {};
    stack.push({ ...root, level: 0, expand: false });

    while (stack.length !== 0) {
      // tslint:disable-next-line:no-non-null-assertion
      const node = stack.pop()!;
      this.visitNode(node, hashMap, array);
      if (node.children) {
        for (let i = node.children.length - 1; i >= 0; i--) {
          // tslint:disable-next-line:no-non-null-assertion
          stack.push({ ...node.children[i], level: node.level! + 1, expand: false, parent: node });
        }
      }
    }

    return array;
  }

  visitNode(node: any, hashMap: { [id: string]: boolean }, array: any[]): void {
    if (!hashMap[node.id]) {
      hashMap[node.id] = true;
      array.push(node);
    }
  }

  delete(id: string) {}

  businessReply(item: any) {
    this.commentDetailComponent.addComment(item);
  }

  constructor(private userCommentService: UserCommentService, private msg: NzMessageService) {}
  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.userCommentService.findAll().subscribe((data) => {
      this.listData = data;
      this.listData.forEach((item) => {
        this.mapOfExpandedData[item.id] = this.convertTreeToList(item);
      });

      // this.msg.success('读取成功');
    });
  }
}
