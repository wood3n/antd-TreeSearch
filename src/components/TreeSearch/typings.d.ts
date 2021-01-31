export interface TreeNode {
  title: string;
  icon?: React.ReactNode;
  extra?: React.ReactNode;
  children?: TreeNode[];
}
