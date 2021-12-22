// tslint:disable-next-line:no-empty-interface
export interface UserDTO {
  /**
   * 对象ID，新增时应当为null, 系统会自动生成
   */
  id: string;

  /**
   * 用户名
   */
  username: string;

  /**
   * 密码
   */
  password: string;

  /**
   * 身份证号码
   */
  identity: string;

  /**
   * 名字
   */
  name: string;

  /**
   * 电话
   */
  phone: string;

  /**
   * 预定次数
   */
  bookingTime: string;
}
