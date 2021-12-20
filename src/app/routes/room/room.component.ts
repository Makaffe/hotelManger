import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { NzFormatEmitEvent, NzMessageService } from 'ng-zorro-antd';
import { RoomDetailComponent } from './roomdetail.component';
import { RoomService } from './service/RoomService';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
})
export class RoomComponent implements OnInit {
  @ViewChild('bookingDetail', { static: false })
  roomDetailComponent: RoomDetailComponent;
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

  showModal() {}
  constructor(private msg: NzMessageService, private roomService: RoomService) {}

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.roomService.findAll().subscribe((data) => {
      this.listData = data;
      this.listData.forEach((item) => {
        this.mapOfExpandedData[item.id] = this.convertTreeToList(item);
      });
    });
  }

  edit(item: any, isWatch: boolean) {}

  delete(id: string) {}
}
