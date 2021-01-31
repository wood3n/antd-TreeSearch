// @ts-nocheck
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Space, Tree, Input, Empty, Spin } from 'antd';
import { DataNode } from 'rc-tree/lib/interface';
import { debounce, flatMapDeep } from 'lodash';
import { generateKey, filterTreeData, getAllNodeKeys, filter } from '../../util';
import styles from './style.less';
import { TreeNode } from './typings';

interface InnerTreeDataType extends TreeNode {
  key: string;
}

interface Props {
  treeData: TreeNode[];
}

const TreeSearch: React.FC<Props> = ({ treeData }) => {
  const [innerTreeData, setInnerTreeData] = useState<InnerTreeDataType[]>([]);
  const [searchValue, setSearchValue] = useState<string>();
  const [searching, setSearching] = useState(false);
  const treeDataRef = useRef<InnerTreeDataType>();
  const [expandedKeys, setExpandedKeys] = useState<React.ReactText[]>();
  const [autoExpandParent, setAutoExpandParent] = useState(false);

  const onExpand = (keys: React.ReactText[]) => {
    setExpandedKeys(keys);
    setAutoExpandParent(false);
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

  // 填充key
  useEffect(() => {
    const newTreeData = generateKey(treeData);
    treeDataRef.current = newTreeData;
    setInnerTreeData(newTreeData);
  }, [treeData]);

  // 搜索
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    if (e.target.value) {
      setSearching(true);
      // 基于antd参考实现的tree search
      // const newTreeData = filterTreeData(e.target.value, treeDataRef.current);
      const newTreeData = filter(e.target.value, treeDataRef.current);
      const expandAllKeys = getAllNodeKeys(newTreeData);
      setInnerTreeData(newTreeData);
      setExpandedKeys(expandAllKeys);
      setAutoExpandParent(true);
      setSearching(false);
    } else {
      setInnerTreeData(treeDataRef.current);
      setAutoExpandParent(false);
    }
  };

  return (
    <Space direction='vertical'>
      <Input.Search onChange={debounce(onChange, 500)} allowClear />
      <Spin spinning={searching}>
        {innerTreeData.length > 0 ? (
          <Tree
            className={styles.customTree}
            blockNode
            showIcon
            onExpand={onExpand}
            expandedKeys={expandedKeys}
            autoExpandParent={autoExpandParent}
            titleRender={titleRender}
            treeData={innerTreeData}
          />
        ) : (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='暂无数据' />
        )}
      </Spin>
    </Space>
  );
};

export default TreeSearch;
