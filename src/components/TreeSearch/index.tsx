// @ts-nocheck
import React, { useState, useEffect, useMemo } from 'react';
import { Space, Tree, Input } from 'antd';
import { DataNode } from 'rc-tree/lib/interface';
import { debounce, flatMapDeep } from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import styles from './style.less';

interface TreeNode {
  title: string;
  icon?: React.ReactNode;
  extra?: React.ReactNode;
  children?: TreeNode[];
}

interface Props {
  treeData: TreeNode[];
}

const generateKey: (treeData: TreeNode[]) => DataNode[] = (treeData: TreeNode[]) => {
  return treeData.map((node) => {
    const { children, ...rest } = node;
    if (children) {
      return {
        key: uuidv4(),
        children: generateKey(children),
        ...rest,
      };
    }

    return {
      key: uuidv4(),
      ...rest,
    };
  });
};

const notEmptyArray = (value: any) => {
  return Array.isArray(value) && value.length > 0;
};

// 拍平节点
const generateList = (treeData) => {
  return flatMapDeep(treeData, (node) => {
    return [
      {
        title: node.title,
        key: node.key,
      },
      [...generateList(node.children)],
    ];
  });
};

// const generateList = (treeData: TreeNode[], dataList = []) => {
//   treeData.forEach((node) => {
//     dataList.push({
//       title: node.title,
//       key: node.key,
//     });

//     if (node.children) {
//       generateList(node.children, dataList);
//     }
//   });
//   return dataList;
// };

const TreeSearch: React.FC<Props> = ({ treeData }) => {
  const [searchValue, setSearchValue] = useState<string>();
  const [expandedKeys, setExpandedKeys] = useState<React.ReactText[]>();
  const [autoExpandParent, setAutoExpandParent] = useState(false);

  const onExpand = (keys: React.ReactText[]) => {
    setExpandedKeys(keys);
  };

  const titleRender = (nodeData: TreeNode) => {
    if (searchValue && nodeData.title.includes(searchValue)) {
      const index = nodeData.title.indexOf(searchValue);
      const beforeStr = nodeData.title.substring(0, index);
      const afterStr = nodeData.title.substring(index + searchValue.length);

      if (nodeData.extra) {
        return (
          <span>
            <span>
              {beforeStr}
              <span className={styles.searchValue}>{searchValue}</span>
              {afterStr}
            </span>
            <span className={styles.tableExtra}>{nodeData.extra}</span>
          </span>
        );
      }

      return (
        <>
          {beforeStr}
          <span className={styles.searchValue}>{searchValue}</span>
          {afterStr}
        </>
      );
    }

    if (nodeData.extra) {
      return (
        <span>
          <span>{nodeData.title}</span>
          <span className={styles.tableExtra}>{nodeData.extra}</span>
        </span>
      );
    }

    return nodeData.title;
  };

  const innerTreeData = useMemo(() => {
    return generateKey(treeData);
  }, [treeData]);

  console.log(generateList(innerTreeData));

  // 搜索
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value.trim().toLocaleLowerCase());
    setAutoExpandParent(true);
  };

  return (
    <Space direction='vertical'>
      <Input.Search onChange={debounce(onChange, 500)} />
      <Tree
        className={styles.customTree}
        blockNode
        showIcon
        defaultExpandAll
        onExpand={onExpand}
        expandedKeys={expandedKeys}
        autoExpandParent={autoExpandParent}
        titleRender={titleRender}
        treeData={innerTreeData}
      />
    </Space>
  );
};

export default TreeSearch;
