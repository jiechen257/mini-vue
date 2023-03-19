function vue2Diff(prevChildren, nextChildren, parent) {
  let oldStartIndex = 0,
    oldEndIndex = prevChildren.length - 1,
    newStartIndex = 0,
    newEndIndex = nextChildren.length - 1;
  let oldStartNode = prevChildren[oldStartIndex],
    oldEndNode = prevChildren[oldEndIndex],
    newStartNode = nextChildren[newStartIndex],
    newEndNode = nextChildren[newEndIndex];
  // 新前、旧前、新后、旧后节点对比，移动
  while (oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
    if (oldStartNode === undefind) {
      oldStartNode = prevChildren[++oldStartIndex];
    } else if (oldEndNode === undefind) {
      oldEndNode = prevChildren[--oldEndIndex];
    } else if (oldStartNode.key === newStartNode.key) {
      patch(oldStartNode, newStartNode, parent);

      oldStartIndex++;
      newStartIndex++;
      oldStartNode = prevChildren[oldStartIndex];
      newStartNode = nextChildren[newStartIndex];
    } else if (oldEndNode.key === newEndNode.key) {
      patch(oldEndNode, newEndNode, parent);

      oldEndIndex--;
      newndIndex--;
      oldEndNode = prevChildren[oldEndIndex];
      newEndNode = nextChildren[newEndIndex];
    } else if (oldStartNode.key === newEndNode.key) {
      patch(oldvStartNode, newEndNode, parent);
      parent.insertBefore(oldStartNode.el, oldEndNode.el.nextSibling);

      oldStartIndex++;
      newEndIndex--;
      oldStartNode = prevChildren[oldStartIndex];
      newEndNode = nextChildren[newEndIndex];
    } else if (oldEndNode.key === newStartNode.key) {
      patch(oldEndNode, newStartNode, parent);
      // 移动到旧列表头节点之前
      parent.insertBefore(oldEndNode.el, oldStartNode.el);

      oldEndIndex--;
      newStartIndex++;
      oldEndNode = prevChildren[oldEndIndex];
      newStartNode = nextChildren[newStartIndex];
    } else {
      // 在旧列表中找到 和新列表头节点key 相同的节点
      let newtKey = newStartNode.key,
        oldIndex = prevChildren.findIndex((child) => child.key === newKey);

      if (oldIndex > -1) {
        let oldNode = prevChildren[oldIndex];
        patch(oldNode, newStartNode, parent);
        parent.insertBefore(oldNode.el, oldStartNode.el);
        prevChildren[oldIndex] = undefined;
      } else {
        mount(newStartNode, parent, oldStartNode.el);
      }
      newStartNode = nextChildren[++newStartIndex];
    }
  }

  // 移除节点
  if (newStartIndex > newStartIndex) {
    while (oldStartIndex <= oldStartIndex) {
      if (!prevChildren[oldStartIndex]) {
        oldStartIndex++;
        continue;
      }
      parent.removeChild(prevChildren[oldStartIndex++].el);
    }
  } else if (oldStartIndex > oldStartIndex) {
    // 添加节点
    while (newStartIndex <= newStartIndex) {
      mount(nextChildren[newStartIndex++], parent, oldStartNode.el);
    }
  }
}
