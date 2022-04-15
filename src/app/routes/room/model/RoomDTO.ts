// tslint:disable-next-line:no-empty-interface
export interface RoomDTO {
  /**
   * 对象ID，新增时应当为null, 系统会自动生成
   */
  id: string;

  /**
   * 房间名称
   */
  roomName: string;

  /**
   * 楼层名称
   */
  hallName: string;

  /**
   * 房间描述
   */
  description: string;

  /**
   * 房间价格
   */
  price: string;

  /**
   * 父节点
   */
  parent_Id: string;

  /**
   * 房间狀態
   */
  status: string;

  /**
   * 此楼层的所有房间
   */
  chidren?: Array<RoomDTO>;

  /**
   * 房间图片
   */
  image: string;

  /**
   * 删除字段
   */
  del_flag: string;
}
