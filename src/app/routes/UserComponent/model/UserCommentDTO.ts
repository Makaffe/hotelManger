// tslint:disable-next-line:no-empty-interface
export interface UserCommentDTO {
  /**
   * 对象ID，新增时应当为null, 系统会自动生成
   */
  id: string;

  /**
   * 父节点Id
   */
  parent_Id: string;

  /**
   * 内容
   */
  content: string;

  /**
   * 订单Id
   */
  order_Id: string;

  /**
   * 用户Id
   */
  user_Id: string;

  /**
   * 房间Id
   */
  room_Id: string;

  /**
   * 评价星数
   */
  startCount: string;

  /**
   * 子数据
   */
  children: Array<UserCommentDTO>;
}
