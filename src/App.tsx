import React from 'react';
import {
  DatabaseOutlined,
  TableOutlined,
  ProfileOutlined,
  FolderViewOutlined,
} from '@ant-design/icons';
import TreeSearch from './components/TreeSearch';
import './App.css';

const treeData = [
  {
    title: 'database1',
    icon: <DatabaseOutlined />,
    children: [
      {
        title: 'Table',
        icon: <TableOutlined />,
        extra: <a>测试</a>,
        children: [
          {
            title: 'table1',
            icon: <ProfileOutlined />,
          },
          {
            title: 'table2',
            icon: <ProfileOutlined />,
            extra: <a>测试</a>,
          },
        ],
      },
      {
        title: 'View',
        icon: <FolderViewOutlined />,
        children: [
          {
            title: 'view1',
            icon: <ProfileOutlined />,
          },
          {
            title: 'view2',
            icon: <ProfileOutlined />,
          },
        ],
      },
    ],
  },
  {
    title: 'database2',
    icon: <DatabaseOutlined />,
    children: [
      {
        title: 'Table',
        icon: <TableOutlined />,
        extra: (
          <a
            onClick={(e) => {
              e.stopPropagation();
              console.log('test');
            }}
          >
            测试
          </a>
        ),
        children: [
          {
            title: 'table1',
            icon: <ProfileOutlined />,
          },
          {
            title: 'table2',
            icon: <ProfileOutlined />,
          },
        ],
      },
      {
        title: 'View',
        icon: <FolderViewOutlined />,
        children: [
          {
            title: 'view1',
            icon: <ProfileOutlined />,
          },
          {
            title: 'view2',
            icon: <ProfileOutlined />,
          },
        ],
      },
    ],
  },
];

function App() {
  return (
    <div
      style={{
        margin: 50,
        textAlign: 'center',
      }}
    >
      <TreeSearch treeData={treeData} />
    </div>
  );
}

export default App;
