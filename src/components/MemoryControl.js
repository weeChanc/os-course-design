import OS_Modle from '@/components/OS_Modle'

class MemoryController {

  totalMemorySize = 720;
  memoryHead = null
  memoryLast = null

  constructor(totalMemorySize) {
    this.totalMemorySize = totalMemorySize;
    this.memoryHead = new MemoryNode(-1, -1)
    this.memoryLast = new MemoryNode(0, this.totalMemorySize)
    this.memoryHead.next = this.memoryLast;
    this.memoryLast.pre = this.memoryHead;
  }

  alloc(pid, size) {
    const result = this.firstFit(pid, size)
    this.update()
    return result;
  }

  free(pid) {
    var block = this.memoryHead;
    while (block) {
      block = block.next;
      if (block !== this.memoryHead && block !== this.memoryLast && block.pid === pid) {
        break;
      }
    }

    if (block == null) return;

    block.state = MemoryNode.FREE
    block.pid = undefined;

    //与前面的空闲快链接
    if (block.pre !== this.memoryHead
      && block.pre.state === MemoryNode.FREE) {
      block.pre.size += block.size;
      block.pre.next = block.next;
      block.next.pre = block.pre;
      block = block.pre;
    }

    //与后面的空闲块链接
    if (block.next !== this.memoryLast && block.next.state === MemoryNode.FREE) {
      block.size += block.next.size //空间扩充,合并为一个
      block.next.next.pre = block;
      block.next = block.next.next;
    }

    //与最后的空闲块相连
    if (block.next === this.memoryLast && block.next.state === MemoryNode.FREE)
    {
      block.size += block.next.size;
      block.next = null;
      this.memoryLast = block
    }
    this.update();
  }

  firstFit(pid, size) {
    var node = this.memoryHead.next;
    while (node != null) {
      if (node.size === size && node.state === MemoryNode.FREE) {
        node.state = MemoryNode.USED;
        node.pid = pid;
        return true;
      }

      if (node.state === MemoryNode.FREE && node.size > size) {
        let newMemory = new MemoryNode(node.address, size, pid);
        newMemory.state = MemoryNode.USED
        newMemory.pre = node.pre;
        newMemory.next = node;
        node.pre.next = newMemory;
        node.pre = newMemory;
        node.address = node.address + size;
        node.size -= size;
        return true;
      }
      node = node.next;
    }
    return false;
  }

  update() {
    const result = []
    let tempHead = this.memoryHead.next;
    while (tempHead) {
      result.push(tempHead)
      tempHead = tempHead.next
    }
    OS_Modle.memory = result;
  }
}


class MemoryNode {
  pid = null;
  pre = null;
  next = null;
  address = 0;
  state = MemoryNode.FREE = 1;
  size = 0;

  constructor(address, size, pid) {
    this.address = address;
    this.size = size;
    this.pid = pid
  }
}

MemoryNode.FREE = 1;
MemoryNode.USED = -1;


export default MemoryController
