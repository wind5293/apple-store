export type Category = {
    icon: string,
    name: string,
    slug: string,
}

export type CategoryWithId = Category & { id: string }