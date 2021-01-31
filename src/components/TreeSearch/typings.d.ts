export interface TreeNode {
  title: string;
  value: string;
  icon?: React.ReactNode;
  extra?: React.ReactNode;
  children?: TreeNode[];
}
