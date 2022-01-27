// tslint:disable-next-line:no-empty-interface
export interface BookingDTO {
  /**
   * 对象ID，新增时应当为null, 系统会自动生成
   */
  id: string;

  /**
   * 訂單統計金額
   */
  totalPrice: string;

  /**
   * 訂單開始日期
   */
  startDate: string;

  /**
   * 訂單結束日期
   */
  endDate: string;

  /**
   * 創建時間, 系统会自动生成
   */
  createTime: string;

  /**
   * 修改時間，系統會自動生成
   */
  modifyTime: string;

  /**
   * 訂單狀態（1為正在進行，0為已經結束）
   */
  status: string;

  /**
   * 房間Id
   */
  room_Id: string;

  /**
   * 用戶Id
   */
  user_Id: string;

  /**
   * 评论状态
   */
  commentStatus: string;
}
