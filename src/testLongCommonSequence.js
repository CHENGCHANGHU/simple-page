export default function testLongCommonSequence() {
  /**
   * 构造一张表，表的横行是source，表的竖行是target
   * 
   * 两条路径（第二条的公共节点更多）：
   * B - C - K
   * B - D - E - F - K
   * 
   *   B H D E F C K
   * A - - - - - - -
   * B 1 - - - - - -
   * C - - - - - 1 -
   * D - - 1 - - - -
   * E - - - 1 - - -
   * F - - - - 1 - -
   * K - - - - - - 1
   * 
   *   B H D E F C K
   * A - - - - - - -
   * B 1 - - - - - -
   * C - - - - - 2 -
   * D - - 2 - - - -
   * E - - - 3 - - -
   * F - - - - 4 - -
   * K - - - - - - 5
   * 
   *   B H D E F C K
   * A 0 0 0 0 0 0 0
   * B 1*1 1 1 1 1 1
   * C 1 1 1 1 1 2*2
   * D 1 1 2*2 2 2 2
   * E 1 1 2 3*3 3 3
   * F 1 1 2 3 4*4 4
   * K 1 1 2 3 4 4 5*
   * 
   * if matched: T[i, j] = T[i-1, j-1]+1
   * not matched: T[i, j] = max(T[i-1, j], T[i, j-1])
   * 
   * 记录下每个数据的来源（from：match，left，top）
   * 逆推就可以得到一个最长公共节点的数组
   * 
   */

  const source = 'BHDEFCK';
  const target = 'ABCDEFK';


}