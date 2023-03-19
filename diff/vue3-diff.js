function vue3Diff(prevChildren, nextChildren, parent) {
  let j = 0,
    prevEnd = prevChildren.length - 1,
    nextEnd = nextChildren.length - 1,
    prevNode = prevChildren[j],
    nextNode = nextChildren[j];
  // label语法
  outer: {
    while (prevNode.key === nextNode.key) {
      patch(prevNode, nextNode, parent);
      j++;
      // 循环中如果触发边界情况，直接break，执行outer之后的判断
      if (j > prevEnd || j > nextEnd) break outer;
      prevNode = prevChildren[j];
      nextNode = nextChildren[j];
    }

    prevNode = prevChildren[prevEnd];
    nextNode = prevChildren[nextEnd];

    while (prevNode.key === nextNode.key) {
      patch(prevNode, nextNode, parent);
      prevEnd--;
      nextEnd--;
      // 循环中如果触发边界情况，直接break，执行outer之后的判断
      if (j > prevEnd || j > nextEnd) break outer;
      prevNode = prevChildren[prevEnd];
      nextNode = prevChildren[nextEnd];
    }
  }

  // 边界情况的判断
  if (j > prevEnd && j <= nextEnd) {
    let nextpos = nextEnd + 1,
      refNode =
        nextpos >= nextChildren.length ? null : nextChildren[nextpos].el;
    while (j <= nextEnd) mount(nextChildren[j++], parent, refNode);
  } else if (j > nextEnd && j <= prevEnd) {
    while (j <= prevEnd) parent.removeChild(prevChildren[j++].el);
  } else {
    let prevStart = j,
      nextStart = j,
      nextLeft = nextEnd - nextStart + 1, // 新列表中剩余的节点长度
      source = new Array(nextLeft).fill(-1), // 创建数组，填满-1
      nextIndexMap = {}, // 新列表节点与index的映射
      patched = 0,
      move = false, // 是否移动
      lastIndex = 0; // 记录上一次的位置

    // 保存映射关系
    for (let i = nextStart; i <= nextEnd; i++) {
      let key = nextChildren[i].key;
      nextIndexMap[key] = i;
    }

    // 去旧列表找位置
    for (let i = prevStart; i <= prevEnd; i++) {
      let prevNode = prevChildren[i],
        prevKey = prevNode.key,
        nextIndex = nextIndexMap[prevKey];
      // 新列表中没有该节点 或者 已经更新了全部的新节点，直接删除旧节点
      if (nextIndex === undefind || patched >= nextLeft) {
        parent.removeChild(prevNode.el);
        continue;
      }
      // 找到对应的节点
      let nextNode = nextChildren[nextIndex];
      patch(prevNode, nextNode, parent);
      // 给source赋值
      source[nextIndex - nextStart] = i;
      patched++;

      // 递增方法，判断是否需要移动
      if (nextIndex < lastIndex) {
        move = false;
      } else {
        lastIndex = nextIndex;
      }
    }

    if (move) {
      // 需要移动
      const seq = lis(source); // [0, 1]
      let j = seq.length - 1; // 最长子序列的指针
      // 从后向前遍历
      for (let i = nextLeft - 1; i >= 0; i--) {
        let pos = nextStart + i, // 对应新列表的index
          nextNode = nextChildren[pos], // 找到vnode
          nextPos = pos + 1, // 下一个节点的位置，用于移动DOM
          refNode =
            nextPos >= nextChildren.length ? null : nextChildren[nextPos].el, //DOM节点
          cur = source[i]; // 当前source的值，用来判断节点是否需要移动

        if (cur === -1) {
          // 情况1，该节点是全新节点
          mount(nextNode, parent, refNode);
        } else if (cur === seq[j]) {
          // 情况2，是递增子序列，该节点不需要移动
          // 让j指向下一个
          j--;
        } else {
          // 情况3，不是递增子序列，该节点需要移动
          parent.insetBefore(nextNode.el, refNode);
        }
      }
    } else {
      //不需要移动
      for (let i = nextLeft - 1; i >= 0; i--) {
        let cur = source[i]; // 当前source的值，用来判断节点是否需要移动

        if (cur === -1) {
          let pos = nextStart + i, // 对应新列表的index
            nextNode = nextChildren[pos], // 找到vnode
            nextPos = pos + 1, // 下一个节点的位置，用于移动DOM
            refNode =
              nextPos >= nextChildren.length ? null : nextChildren[nextPos].el; //DOM节点
          mount(nextNode, parent, refNode);
        }
      }
    }
  }
}
