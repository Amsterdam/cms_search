export default function paginate<T>(items: T[], page: number, limit: number) {
  const cursor = (page - 1) * limit

  return items.slice(cursor, cursor + limit)
}
