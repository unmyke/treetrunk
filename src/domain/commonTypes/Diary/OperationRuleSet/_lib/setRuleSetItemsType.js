export function setRuleSetItemsType(ruleSetItems, type) {
  return Object.keys(ruleSetItems).forEach(
    (ruleSetItemName) => (ruleSetItems[ruleSetItemName].type = type)
  );
}
