export default function filterByCategory(category, items) {
  // NOTE -- category filtering is case sensitive
  if (category == null) return null;
  return items.reduce((p, item, i) => {
    if (item.category === category) return [...p, i];
    return p;
  }, []);
}
