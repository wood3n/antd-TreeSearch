// @ts-nocheck
import { flatMapDeep } from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import { TreeNode } from '../components/TreeSearch/typings';

/**
 * antd版本的筛选树节点
 * @param searchValue 搜索关键字
 * @param treeData 数据
 */
export function filterTreeData(searchValue: string, treeData: TreeNode[]): TreeNode[] {
  // @ts-expect-error
  function dig(list: TreeNode[], keepAll: boolean = false) {
    return list
      .map((dataNode) => {
        const { children } = dataNode;

        // 保留所有的标识属性
        const match = keepAll || String(dataNode.title).includes(String(searchValue).trim());
        // @ts-expect-error
        const childList = dig(children || [], match);

        if (match || childList.length) {
          return {
            ...dataNode,
            children: childList,
          };
        }
        return null;
      })
      .filter((node) => node);
  }

  return dig(treeData);
}

interface InnerTreeNodeType extends Omit<TreeNode, 'children'> {
  key: string;
  children?: InnerTreeNodeType[];
}

/**
 * 生成tree的key
 */
export function generateKey(treeData: TreeNode[]) {
  return treeData.map((node) => {
    if (Array.isArray(node.children)) {
      return {
        ...node,
        key: uuidv4(),
        children: generateKey(node.children),
      };
    }

    return {
      ...node,
      key: uuidv4(),
    };
  });
}

/**
 * 扁平化tree数据
 * @param treeData 原始数据
 */
export const flatTreeData: (
  treeData: InnerTreeNodeType[]
) => {
  title?: string;
  key?: string;
}[] = (treeData) => {
  return flatMapDeep(treeData, (node) => {
    if (node.children) {
      return [
        {
          title: node.title,
          key: node.key,
        },
        [...flatTreeData(node.children)],
      ];
    }

    return [
      {
        title: node.title,
        key: node.key,
      },
    ];
  });
};

/**
 * 获取所有节点的key
 */
export function getAllNodeKeys(treeData) {
  return flatMapDeep(treeData, (node) => {
    if (node.children) {
      return [node.key, getAllNodeKeys(node.children)];
    }

    return node.key;
  });
}

/**
 * 获取当前节点的父节点key
 * @param key
 * @param tree
 */
export const getParentKey: (key: string, treeData: InnerTreeNodeType[]) => string | undefined = (
  key,
  treeData
) => {
  let parentKey;
  for (let i = 0; i < treeData.length; i++) {
    const node = treeData[i];
    if (node.children) {
      if (node.children.some((item) => item.key === key)) {
        parentKey = node.key;
      } else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children);
      }
    }
  }
  return parentKey;
};

/**
 * 更精确的搜索
 * @param searchValue 搜索关键字
 * @param treeData 树节点
 */
export function filter(searchValue, treeData) {
  return treeData.reduce((result, node) => {
    const selfContain = node.title.includes(searchValue.trim());
    if (selfContain) {
      if (Array.isArray(node.children)) {
        result.push({
          ...node,
          children: filter(searchValue, node.children),
        });
      } else {
        result.push(node);
      }
    } else if (Array.isArray(node.children)) {
      const childList = filter(searchValue, node.children);
      if (childList.length) {
        result.push({
          ...node,
          children: childList,
        });
      }
    }

    return result;
  }, []);
}
