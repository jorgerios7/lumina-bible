export function getTreeRowTone(index: number) {
  if (index % 3 === 1) {
    return "branch-blue";
  }

  if (index % 3 === 2) {
    return "branch-purple";
  }

  return "";
}
